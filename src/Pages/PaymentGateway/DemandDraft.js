import React from "react";
import { Input, Select } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import { te, ts } from "../../Utility/ReduxToaster";
import { postBankBranchIfsc, 
         postGetAmount, 
         postDepositePayment,
         getBankList } from "../../Utility/Services/Payment";
import { withRouter } from "react-router-dom";
import moment from "moment";
import { public_url } from "../../Utility/Constant";
import { getLeadDetail } from "../../Utility/Services/QDE";


const detailForm = {
  errors: {
    accountHolderName: null,
    ifscCode: null,
    chequeDdNumber:null,
    bank: null,
    branch: null,
    paymentDate: null
  },
  accountHolderName: "",
  bank: "",
  branch:"",
  ifscCode: "",
  chequeDdNumber:"",
  // cif: "",
  // lan: "878",
  paymentType: "DD",
  paymentDate:"",
  amount: null,
};

class DemandDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: cloneDeep(detailForm),
      loading: false,
      ifscCodeCheck: false,
      bankList: [],
      lan: null,
      leadDetail:""
    };
  }

  GetAmount = () => {
    postGetAmount().then(res => {
      if (res.error) {
        return;
      }
      const{form} = this.state;
      form.amount = res.data.depositAmountWithGst;
      // form.cif = this.props.cif
      this.setState({ form});
    });
  };

  componentDidMount() {
    this.GetAmount();
    this.BankList();
    this.GetLeadDetail();
  }

  BankList = () => {
    getBankList().then(res => {
      if (res.error) {
        return;
      }
      this.setState({ bankList: res.data.data });
    });
  };

  OnSubmit = e => {
    e.preventDefault();
    const { form, loading, leadDetail } = this.state;
    const { selectedOption } = this.props
    let { match } = this.props;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    let {
      accountHolderName,
      bank,
      branch,
      ifscCode ,
      chequeDdNumber,
      // cif,
      // lan,
      paymentType,
      paymentDate,
      amount ,
    } = this.state.form;
    let objForm = {
      accountHolderName,
      bank,
      branch,
      ifscCode ,
      chequeDdNumber,
      // cif,
      // lan,
      paymentType,
      paymentDate,
      amount ,
    }
    if (obj) {
      let { match } = this.props;
      let { params } = match;
      let objForm = cloneDeep(form);
      delete objForm.errors
      objForm.cif = leadDetail;
      objForm.lan = params.refrencenumber;
      postDepositePayment(objForm).then(res => {
        if (res.error) {
          this.setState({ loading: false });
          return;
        }
       else {
        ts(res.data.message);
        this.props.history.push({ 
            pathname: `${public_url.payment_confirmation}/${match.params.leadcode}/${match.params.refrencenumber}`,
            state: {...objForm, selectedOption:"cheque" }});
        }
      });
    }
    this.setState({ loading: true });
  };

  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }

  onInputChange = (name, value, error = undefined) => {
    let { form, ifscCodeCheck } = this.state;
    form[name] = value;
    if (error !== undefined) {
      let { errors } = form;
      errors[name] = error;
    }
    if (name == "ifscCode") {
      ifscCodeCheck = false
    }
    this.setState({ ifscCodeCheck, form });
  };

  onInputValidate = (name, error) => {
    let { errors } = this.state.form;
    errors[name] = error;
    this.setState({
      form: { ...this.state.form, errors: errors }
    });
  };
  
  GetLeadDetail = () => {
    let { match } = this.props;
    getLeadDetail(match.params.leadcode).then(res => {
      if (res.error) return;
      if (res.data.error) {
        te(res.data.message);
      } else {
        res.data.data.mainapplicant.type = "applicant";
        this.setState({
          leadDetail: res.data.data.mainapplicant.cif,
          status: res.data.data.mainapplicant
        });
      }
    });
  };

  OnCheckClick = () => { 
    const { form, loading, ifscCodeCheck} = this.state;
    let obj = getFormDetails(form.ifscCode, this.onInputValidate);
    if (obj){
    postBankBranchIfsc(this.state.form.ifscCode).then(res => {
      if (res && res.data && res.data.error&& res.data.error == "false") {
        this.setState({ ifscCodeCheck: true ,form:{...form,bank:res.data.data.bank, branch:res.data.data.branch} });
      } else if ( res && res.data && res.data.error && res.data.error == "true") {
        te("Invalid IFSC Code");
      }
    });
  }
  }

  render() {
    let {
      accountHolderName,
      bank,
      ifscCode,
      branch,
      amount,
      chequeDdNumber,
      paymentDate,
      errors
    } = this.state.form;
    let { ifscCodeCheck, bankList, leadDetail} = this.state;
    let minDate = moment(new Date()).subtract(30, 'days').format('YYYY-MM-DD');
    let maxDate = moment(new Date()).add(90, 'days').format('YYYY-MM-DD');

    return (
      <React.Fragment>
           <div className="d-flex flex-wrap border p-3 justify-content-md-around mb-3">
            <div className="row justify-content-center w-100 text-left">
              <div className="col-md-6 py-lg-3 pr-lg-4">
                <div className="bg-white">
                  <form
                    // className="form_style-1"
                    autoComplete="off"
                  >
                    <div className="form-group row align-items-start">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Account Holder's Name
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                        <Input
                          className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2"
                          id="colFormLabelSm"
                          placeholder="Type Name"
                          name="accountHolderName"
                          value={accountHolderName}
                          title="Acccount Holder's Name"
                          isReq={true}
                          onChangeFunc={this.onInputChange}
                          error={errors.accountHolderName}
                          validationFunc={this.onInputValidate}
                          reqType="onlyAlphbate"
                          maxLength="100"
                        />
                      </div>
                    </div>
                    <div className="form-group row align-items-start position-relative">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        IFSC Code
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form d-flex align-items-center">
                        <Input
                          className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2"
                          id="colFormLabelSm"
                          placeholder="Type IFSC code"
                          name="ifscCode"
                          value={ifscCode}
                          title="IFSC code"
                          isReq={true}
                          onChangeFunc={(name,value,error)=>{this.onInputChange(name,value.toUpperCase(),error)}}
                          error={errors.ifscCode}
                          validationFunc={this.onInputValidate}
                          reqType="IFSCCode"
                          maxLength="11"
                          minLength="11"
                        />
                      <span className="text-primary font-weight-bold ml-2" onClick={()=>!errors.ifscCode&&this.OnCheckClick()}>Check</span>
                      </div>
                    </div>
                    <div className="form-group row align-items-start">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Branch Name
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                      <Input
                          className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2"
                          id="colFormLabelSm"
                          placeholder="Type Branch Name"
                          name="branch"
                          value={branch}
                          title="Branch Name"
                          isReq={true}
                          onChangeFunc={this.onInputChange}
                          error={errors.branch}
                          validationFunc={this.onInputValidate}
                          maxLength="100"
                          disabled={ifscCodeCheck}
                        />
                      </div>
                    </div>
                    <div className="form-group row align-items-start">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                       Date
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form d-flex align-items-start">
                        <div className="select w-100">
                        <Input
                          name="paymentDate"
                          placeholder="Enter Date"
                          className="form-control border-rounded-pill fs-12 p-2"
                          onChangeFunc={(name, value, error) => {
                            this.onInputChange(name, value, error, "date");
                          }}
                          title="Date"
                          type="date"
                          isReq={true}
                          error={errors.paymentDate}
                          validationFunc={(name, error) => {
                            if (
                              new Date(minDate) <
                              new Date(paymentDate) &&
                              new Date(maxDate) > new Date(paymentDate)
                            ) {
                            } else {
                              error = "Please enter valid date.";
                            }
                            this.onInputValidate(name, error, "date");
                          }}
                          // validationFunc={(name, error) => {
                          //   this.onInputValidate(name, error, "date");
                          // }}
                          value={paymentDate}
                          min ={minDate}
                          max= {maxDate}
                        />
                        </div>
                        {/* <img
                          src="/images/date-primary.png"
                          className="img-fluid mt-1"
                          alt="Date Icon"
                        /> */}
                      </div>
                      <div className="col-2 col-md-1 px-2">
                        
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-6 py-lg-3 pl-lg-4">
                <div className="bg-white">
                  <form
                    autoComplete="off"
                  >
                    <div className="form-group row align-items-start">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Amount
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                        <span className="colorGreen font-weight-bold"> ₹ { this.state.form.amount ? this.state.form.amount : ""}</span>
                      </div>                    
                    </div>
                    <div className="form-group row align-items-start">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Bank Name
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form bankNameControl">
                        <Select
                            className="w-100 fs-12 create-lead-form-select"
                            options={bankList}
                            value={bank}
                            title="Bank"
                            name="bank"
                            isReq={true}
                            onChangeFunc={this.onInputChange}
                            error={errors.bank}
                            // isMulti={true}
                            labelKey="bankname"
                            valueKey="bankname"
                            disabled={ifscCodeCheck}
                          />
                      </div>
                    </div>
                    
                    <div className="form-group row align-items-start">
                      <label
                        htmlFor="colFormLabelSm"
                        className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                       Demand Draft No.
                      </label>
                      <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                        <div className="select">
                          <Input
                            className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2"
                            id="colFormLabelSm"
                            placeholder="Type DD No."
                            name="chequeDdNumber"
                            value={chequeDdNumber}
                            title="DD No"
                            isReq={true}
                            onChangeFunc={this.onInputChange}
                            error={errors.chequeDdNumber}
                            validationFunc={this.onInputValidate}
                            minLength="6"
                            maxLength="6"
                            reqType="number"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="text-primary ml-lg-4 text-left mb-3">
            Note : These fees are applicable to process the profile and therefore non-refundable irrespective of Loan approval
             or rejection when you proceed..
          </div>
          <div className="text-sm-right">
              <button 
                  className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2"
                  onClick={this.OnSubmit}
              > 
                  Submit 
              </button>
          </div>
      </React.Fragment>
    );
  }
}
export default withRouter(DemandDraft);