import React, { Component } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { Select, Input } from "../../Component/Input";
import { ts, te } from "../../Utility/ReduxToaster";
import {
  getStampDutyList,
  updateFrankingFeeDataByLeadCode,
  getFrankingFeeDataByLeadCode,
  getFrankingFeeAmountByLeadCode,
} from "../../Utility/Services/Logchecklist";
import { cloneDeep } from "lodash";

const initForm = {
  amount: null,
  collectedckeck: null,
  description: "",
  frankingfeeCode: null,
  errors: {
    description: null,
  },
};

export class FrankingFees extends Component {
  state = {
    feesList: [],
    form: cloneDeep(initForm),
    disSave: true,
  };
  componentDidMount() {
    this.FrankingFeesData();
    this.StampDutyList();
  }

  StampDutyList = () => {
    getStampDutyList().then((res) => {
      console.log("response", res);
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        this.setState({ feesList: res.data.data });
      }
    });
  };

  calculateAmount = () => {
    let { form } = this.state;
    let { frankingfeeCode } = form;
    let { match } = this.props;
    let obj = {
      loanNum: match.params.loanrefnumber,
      leadCode: match.params.leadcode,
      frankingfeeCode: frankingfeeCode,
    };
    getFrankingFeeAmountByLeadCode(obj).then((res) => {
      console.log("calculateAmount", res);
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        this.setState(
          {
            form: { ...form, amount: res.data && res.data.amount },
            disSave: false,
          },
          () => this.getToast()
        );
      }
    });
  };

  getToast = () => {
    let { form } = this.state;
    let { amount } = form;

    console.log("amount", form.amount);
    if (amount == 0) {
      ts("State is not configured in the system");
    }
  };

  FrankingFeesData = () => {
    let { match } = this.props;
    let obj = {
      loanNum: match.params.loanrefnumber,
      leadCode: match.params.leadcode,
      frankingfeeCode: null,
    };
    getFrankingFeeDataByLeadCode(obj).then((res) => {
      console.log("res", res);
      if (res.data.error === false) {
        this.setState({
          form: res.data && res.data.frankingFee,
        });
      }
    });
  };

  listOfFees = (name, value, error = undefined) => {
    let { form } = this.state;
    console.log("name", form[name], value);
    if (form[name] === value) {
      // te("Please Calculate Amount");
      this.setState({
        disSave: true,
      });
    }
    if (error !== undefined) {
      let { errors } = form;
      errors[name] = error;
    }
    form[name] = value;
    this.setState({
      form,
    });
  };

  onInputChange = (e) => {
    const { form } = this.state;
    let { collectedckeck } = form;
    this.setState({
      form: { ...form, collectedckeck: !collectedckeck },
    });
  };

  handleSubmit = () => {
    let { match } = this.props;
    let { form } = this.state;
    let obj = cloneDeep(form);
    obj.loannum = match.params.loanrefnumber;
    obj.leadcode = match.params.leadcode;
    obj.createdBy = "";
    obj.updatedBy = "";
    delete obj.errors;
    updateFrankingFeeDataByLeadCode(obj).then((response) => {
      console.log("response", response.data.message);
      if (response.error === false) {
        ts(response.data.message);
        this.componentDidMount();
        this.props.history.push(
          `${public_url.co_applicant_status}/${match.params.leadcode}`
        );
      } else {
        te("Plaese Select Mandatory fields");
        return false;
      }
    });
  };

  render() {
    let { feesList, form, disSave } = this.state;
    let { collectedckeck, amount, frankingfeeCode } = form;
    let { match } = this.props;
    let frankingFeeFlag = false;
    // console.log("amount", amount);
    // if (amount == 0) {
    //   ts("State is not configured in the system");
    // }

    return (
      <React.Fragment>
        <section>
          <div className="backToDashboard py-3">
            <div className="container-fluid">
              <Link to={public_url.lead_list}>Back to Dashboard</Link>
            </div>
          </div>
          <BreadCrumbs {...this.props} />
        </section>
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div className="bg-white p-md-4 p-2">
              <div className="fees mt-3">
                <h5 className="font-weight-bold text-primary">Franking Fees</h5>
                <div className="ml-3" style={{ width: 400 }}>
                  <Select
                    className="w-100 fs-12 create-lead-form-select"
                    options={feesList}
                    value={frankingfeeCode}
                    title="Franking Fees"
                    name="frankingfeeCode"
                    onChangeFunc={(name, value, error) => {
                      this.listOfFees(name, value, error);
                    }}
                    disabled={frankingFeeFlag}
                    labelKey="description"
                    valueKey="frankingfeeCode"
                    isMulti={true}
                  />
                </div>
                <div>
                  <button
                    className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-5"
                    disabled={
                      frankingfeeCode === "" ||
                      frankingfeeCode === null ||
                      frankingFeeFlag
                    }
                    onClick={this.calculateAmount}
                  >
                    Calculate
                  </button>
                </div>
              </div>
              <div className="container mt-3 mb-4">
                <div className="row">
                  <div className="col-sm-9 col-md-7 col-lg-6 mx-auto fees-card">
                    <div className="container ml-5">
                      <div className="p-3" style={{ display: "flex" }}>
                        <h5
                          className="fs-16 mb-0 gTextPrimary"
                          style={{ color: "white" }}
                        >
                          Amount :
                        </h5>
                        <div className="ml-3">
                          <h5
                            className="fs-16 mb-0 gTextPrimary"
                            style={{ color: "white" }}
                          >
                            {amount}
                          </h5>
                        </div>
                      </div>
                      <div className="custom-control custom-checkbox ml-3">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="collectedckeck"
                          id="defaultUnchecked"
                          value={collectedckeck}
                          checked={collectedckeck}
                          onChange={(e) => {
                            this.onInputChange(e);
                          }}
                          disabled={frankingFeeFlag}
                          style={{ color: "white" }}
                        />
                        <label
                          className="custom-control-label"
                          for="defaultUnchecked"
                          style={{ color: "white" }}
                        >
                          Is Franking Fees Collected?
                        </label>
                      </div>
                    </div>
                    <div className="row justify-content-end mt-5 mb-4 pr-0 ">
                      <Link
                        to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                      >
                        <button className="btn btn-green btn-rounded ls-1 py-1 px-5 text-white cursor-pointer fs-16 mr-3">
                          Cancel
                        </button>
                      </Link>
                      {/* <Link
                        to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                      > */}
                      <button
                        className={`btn btn-rounded ls-1 py-1 px-5 text-black cursor-pointer fs-16 mr-3 ${
                          !disSave && "btn-green text-white"
                        }`}
                        onClick={this.handleSubmit}
                        disabled={disSave}
                      >
                        Save
                      </button>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default FrankingFees;
