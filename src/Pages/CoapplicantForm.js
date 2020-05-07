import React from "react";
import { Input, Select, Checkbox } from "../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../Utility/Helper";
import { te, ts } from "../Utility/ReduxToaster";
import {
  postCreateLeads,
  getProductList,
  postProductList,
  getLeadsByLeadid,
  postDuplicateEmailMobile
} from "../Utility/Services/Leads";
import { Link } from "react-router-dom";
import { public_url } from "../Utility/Constant";
import {
  CreateCoapplicant,
  postCoApplicantCreateConsent,
  postCoapplicantDetailByCustomerCode
} from "../Utility/Services/CoApplicant";
import Pagination from "react-js-pagination";
import { postLeadDetail } from "../Utility/Services/QDE";
import { FrontendURL } from "../Utility/Config";
const detailForm = {
  leadCode: "",
  productId: null,
  mobileNumber: "",
  emailid: "",
  custname: "",
  status: "Consent Pending",
  // term1: "",
  // term2: "",
  errors: {
    // term1: null,
    // term2: null,
    custname: null,
    mobileNumber: null,
    emailid: null
  }
};
export default class CoapplicantForm extends React.Component {
  constructor() {
    super();
    this.state = {
      form: cloneDeep(detailForm),
      productList: [],
      editMode: false,
      loadingEdit: false,
      loadingSave: false,
      formStatus: false,
      formSubmitResponse: "",
      leadDetail: "",
      sendType: 1,
      detailFormStatus: false
    };
  }
  GetLeadDetail = () => {
    let { form } = this.state;
    let { match } = this.props;
    let { params } = match;
    postLeadDetail(params.leadcode, params.mobileno).then(res => {
      if (res.error) return;
      this.setState({
        leadDetail: res.data.data
      });
    });
  };
  componentDidMount() {
    if (window.location.pathname.startsWith(public_url.co_applicant_detail)) {
      this.postCoapplicantDetailByCustomerCode();
    } else {

      this.GetLeadDetail();
    }

    this.ProductList();
  }
  ProductList = () => {
    postProductList().then(res => {
      if (res.error) {
        return;
      }
      this.setState({ productList: res.data.data });
    });
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
    const { form } = this.state;
    form[name] = value;
    if (error !== undefined) {
      let { errors } = form;
      errors[name] = error;
    }
    this.setState({ form });
  };
  // handle validation
  onInputValidate = (name, error) => {
    let { errors } = this.state.form;
    errors[name] = error;
    this.setState({
      form: { ...this.state.form, errors: errors }
    });
  };
  HandleSubmit = e => {
    e.preventDefault();
    const { form, loading, leadDetail } = this.state;
    let { match } = this.props;
    let {
      leadCode,
      productId,
      mobileNumber,
      emailid,
      custname,
      errors,
      custcode,
      id
    } = form;
    let formObj = {
      leadCode: match.params.leadcode,
      productId,
      mobileNumber,
      emailid,
      custname,
      custcode,
      id,
      errors: {
        leadCode: errors.leadCode,
        productId: errors.productId,
        mobileNumber: errors.mobileNumber,
        emailid: errors.emailid,
        custname: errors.custname
      }
    };
    let obj = getFormDetails(formObj, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    if (obj) {
      this.setState({ loadingEdit: true });
      let objForm = cloneDeep(formObj);
      delete objForm.term1;
      delete objForm.term2;
      delete objForm.errors;
      //delete objForm.leadCode
      this.setState({ loadingSave: true });
      obj.mainapplicantcif = match.params.cif;
      objForm.productId = leadDetail.productId;
      objForm.status = "Consent Pending";
      objForm.mainapplicantcif=match.params.cif
      obj.leadCode=match.params.leadcode
      CreateCoapplicant(objForm).then(res => {
        if (res.error) {
          this.setState({ loadingSave: false });
          return;
        }
        if (res.data.error == false) {
          ts(res.data.message);
          this.setState(
            {
              loadingSave: false,
              formStatus: true,
              formSubmitResponse: res.data.data,
              form: { ...form, custcode: res.data.data.custcode }
            },
            () => this.getcustomerbyId()
          );
          this.editMode();
        } else if (res.data.error == true) {
          // this.GetLeadDetail();

          te(res.data.message);
          this.setState({ loadingSave: false, formStatus: false });
        }
      });
    }
  };
  CreateConstent = () => {
    const { form, loading, leadDetail, formSubmitResponse } = this.state;
    let { match } = this.props;
    let { params } = match;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    //return;
    let objForm = {
      leadCode: params.leadcode,
      productId: leadDetail.productId,
      // mobileNumber: params.mobileno,
      mobileNumber: form.mobileNumber,
      mainapplicantcif: leadDetail.cif,
      emailid: form.emailid,
      id: 1,
      custcode: formSubmitResponse.custcode,
      status: "Consent Pending",
      custname: formSubmitResponse.custname
    };
    this.setState({ loadingConstent: true });
    postCoApplicantCreateConsent(
      objForm,
      this.state.sendType == 1
        ? `${FrontendURL}${public_url.consent_co_otp_verify_by_url}/${formSubmitResponse.custcode}/${match.params.leadcode}`
        : ""
    ).then(res => {
      if (res.error) {
        this.setState({ loadingConstent: false });
        return;
      }
      if (res.data.error == "false") {
        ts(res.data.message);
        this.setState({
          loadingConstent: false
        });
        if (this.state.sendType == 1) {
          this.props.history.push(
            `${public_url.co_applicant_consent_waiting}/${form.custcode}/${params.leadcode}`
          );
        } else {
          this.props.history.push(
            `${public_url.co_applicant_otp_verify}/${form.custcode}/${params.leadcode}`
          );
        }

        this.setState({ loadingConstent: false });
      } else if (res.data.error == "true") {
        te(res.data.message);
        this.setState({ loadingConstent: false });
      }
    });
  };
  postCoapplicantDetailByCustomerCode = () => {
    
    let { match } = this.props;
    let { form } = this.state;
    postCoapplicantDetailByCustomerCode(match.params.custcode).then(res => {
      if (res.error) {
        return;
      }
      if (!res.data.error) {
        this.setState({
          form: { ...form, ...res.data.data },
          formSubmitResponse:{...form,...res.data.data},
          leadDetail: res.data.data,
          formStatus: true,
          sendType: 2,
          detailFormStatus: true
        });
        // this.CheckSms();
      } else {
        te(res.data.message);
      }
    });
  };
  editMode = () => {
    let { form, editMode, formStatus } = this.state;
    let { errors } = form;
    if (formStatus) {
      form = {
        ...form,
        // term1: "",
        // term2: "",
        errors: {
          ...errors
          //  term1: null, term2: null
        }
      };
    } else {
      delete errors.term1;
      delete errors.term2;
      form = {
        ...form,
        //term1: "", term2: "",
        errors: { ...errors }
      };
    }
    this.setState({ editMode: !editMode, form: form });
  };

  getcustomerbyId = () => {
    let { custcode } = this.state.form;
    let { form } = this.state;
    postCoapplicantDetailByCustomerCode(custcode).then(response => {
      console.log(
        "response of customer",
        response.data.data && response.data.data.id
      );
      this.setState({
        form: { ...form, id: response.data.data && response.data.data.id }
      });
    });
  };

  render() {
    let {
      custname,
      mobileNumber,
      emailid,
      productId,
      errors,
      custcode,
      id
    } = this.state.form;
    let {
      productList,
      editMode,
      loadingConstent,
      loadingSave,
      formStatus,
      leadDetail,
      detailFormStatus
    } = this.state;
    let { match, history } = this.props;
    let { params } = match;
    console.log("form", this.state.form);

    return (
      <React.Fragment>
        <section class="py-4 position-relative bg_l-secondary ">
          <div className="container  ">
            <div class="d-flex justify-content-start align-items-center">
              <div className="breadcrums">
                <ul>
                  <li className="mr-1" class="active">
                    <Link to={public_url.prospect_list}>LAP Prospects</Link>
                  </li>
                  {history.location.pathname.startsWith(
                    public_url.co_applicant
                  ) && (
                    <li className="mr-1" class="active">
                      <Link
                        to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                      >
                        Profile
                      </Link>
                    </li>
                  )}
                  <li className="mr-1">
                    <a href="#">Consent Pending</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div class="container pb-5 bg-white">
            <div class="row justify-content-center align-items-start ">
              <div class="col-md-1 pl-0">
                <p class="mb-0 px-2 py-4 bg_d-primary text-white fs-14 text-center">
                  {" "}
                  {params.leadcode}{" "}
                </p>
              </div>
              <div class="col-md-11 consent-conversion">
                <form class="p-3 form_style-1">
                  <div class="row">
                    <div class="col-md-8">
                      <div class="form-group row">
                        <label
                          htmlFor="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Customer Name
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <Input
                            className="form-control form-control-md fs-12"
                            id="colFormLabelSm"
                            placeholder="Type Name"
                            name="custname"
                            value={custname}
                            title="Customer Name"
                            isReq={true}
                            onChangeFunc={this.onInputChange}
                            error={errors.custname}
                            validationFunc={this.onInputValidate}
                            // disabled={!editMode}
                            maxLength="100"
                            reqType="onlyAlphbate"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          htmlFor="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Mobile
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <Input
                            className="form-control form-control-md fs-12"
                            id="colFormLabelSm"
                            placeholder="Type Mobile Number"
                            name="mobileNumber"
                            value={mobileNumber}
                            title="Mobile Number"
                            isReq={true}
                            onChangeFunc={(name, value, error) => {
                              let regex = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                              if (value.match(regex) == null)
                                this.onInputChange(name, value, error);
                            }}
                            error={errors.mobileNumber}
                            validationFunc={this.onInputValidate}
                            disabled={detailFormStatus}
                            reqType="mobile10"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          htmlFor="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Email Address
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <Input
                            className="form-control form-control-md fs-12"
                            id="colFormLabelSm"
                            placeholder="Type Email Address"
                            name="emailid"
                            value={emailid}
                            title="Email Address"
                            isReq={true}
                            onChangeFunc={this.onInputChange}
                            error={errors.emailid}
                            validationFunc={this.onInputValidate}
                            disabled={detailFormStatus}
                            reqType="email"
                            maxLength="255"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          htmlFor="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Product
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <div class="select create-lead-form-select">
                            <Select
                              className="w-100 fs-12"
                              options={productList}
                              value={leadDetail && leadDetail.productId}
                              title="Product"
                              name="productId"
                              onChangeFunc={this.onInputChange}
                              error={errors.productId}
                              isReq={true}
                              isMulti={true}
                              labelKey="productcategory"
                              valueKey="productId"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {editMode ? ( */}
                    <div class="col-md-4 ">
                      <div class="d-flex justify-content-end mt-4 w-100">
                        <button
                          href="#"
                          class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green "
                          onClick={e => {
                            this.HandleSubmit(e);
                          }}
                          disabled={loadingSave || detailFormStatus}
                        >
                          {loadingSave ? "Saving" : "Save"}
                        </button>
                      </div>
                      <div class="d-flex justify-content-end mt-4 w-100">
                        <button
                          href="#"
                          class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green "
                          onClick={() => {
                            this.props.history.push(public_url.prospect_list);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div
              className={`${formStatus ? "" : "disable-consent-conversion"}`}
            >
              {/* <div class="row justify-content-center py-3 ">
                <div class="">
                  <div className="mb-4">
                    <div className="d-flex col-md-8 ml-5 pl-5 ">
                      <label class="main text-primary ">
                        <input
                          type="checkbox"
                          onChange={e => {
                            this.onInputChange(
                              e.target.name,
                              e.target.checked ? "term1" : "",
                              !e.target.checked
                            );
                          }}
                          name="term1"
                          value={this.state.form.term1}
                          checked={this.state.form.term1}
                        />
                        <span class="geekmark"></span>
                      </label>
                      <p className="mb-0 text-primary">
                        {" "}
                        I, {custname}, agree to the{" "}
                        <span className="text-green">Terms & Conditions</span>{" "}
                        attached herewith.
                      </p>
                    </div>
                    {errors.term1 && (
                      <span className="reqEstric  ml-5 pl-5 checkbox-error consent-conversion-checbox-error">
                        Please select this
                      </span>
                    )}
                  </div>

                  <div className="d-flex col-md-8 ml-5 pl-5">
                    <label class="main text-primary ">
                      <input
                        type="checkbox"
                        onChange={e => {
                          console.log(e.target.checked);
                          this.onInputChange(
                            e.target.name,
                            e.target.checked ? "term2" : "",
                            !e.target.checked
                          );
                        }}
                        checked={this.state.form.term2}
                        name="term2"
                        value={this.state.form.term2}
                      />
                      <span class="geekmark"></span>
                      <br />
                    </label>
                    <p className="mb-0 text-primary">
                      I, {custname}, agree to consent Growth Source for
                      collecting my Aadhaar/ Driving licence and
                      <span> storing and using the same for KYC purpose.</span>
                    </p>
                    <br />
                  </div>
                  {errors.term2 && (
                    <span className="reqEstric  ml-5 pl-5 checkbox-error consent-conversion-checbox-error">
                      Please select this
                    </span>
                  )}
                </div>
              </div> */}
              <div class="row justify-content-center pb-5">
                {/* <div class="control">
                <label class="c_radio  mr-5 pr-5">
                  <input type="radio" name="answer" disabled />
                  <span className="checkmark"> Send link to customer </span>
                </label>
                <label class="c_radio">
                  <input type="radio" name="answer" checked />
                  <span className="checkmark"> OTP </span>
                </label>
              </div> */}
                <div class="c_radiobtn w-50 d-flex ">
                  <div className="mr-4">
                    <input
                      type="radio"
                      id="test2"
                      name="radio-group"
                      onClick={e => {
                        this.setState({ sendType: 1 });
                      }}
                      checked={this.state.sendType == 1 && true}
                    />
                    <label htmlFor="test2">Send link to customer</label>
                  </div>
                  <div className="">
                    <input
                      type="radio"
                      id="test3"
                      name="radio-group"
                      checked={this.state.sendType == 2 && true}
                      onClick={e => {
                        this.setState({ sendType: 2 });
                      }}
                    />
                    <label htmlFor="test3">OTP</label>
                  </div>
                </div>
              </div>
              <div class="row justify-content-center w-100">
                <button
                disabled={loadingConstent}
                  onClick={this.CreateConstent}
                  class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green"
                  disabled={!formStatus}
                >
                  {loadingConstent ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
