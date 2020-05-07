import React from "react";
import { loadPurpose, tenure } from "../../../../Utility/Constant";
import { cloneDeep, maxBy } from "lodash";
import { withRouter } from "react-router-dom";

const initForm = {
  purposeofloan: "Timepass",
  amount: "",
  collateralvalue: "",
  tenure: "",
  yeild: "",
  productName: "LAP",
  existemiobligation: "YES",
  customerstatus: "APPROVED",
  mainapplicant: true,
  createdBy: "VI1000P",
  updatedBy: "VI1000P",
  leadCode: "LAP-0001",
  errors: {
    purposeofloan: null,
    amount: null,
    collateralvalue: null,
    tenure: null,
    yeild: null,
    productName: null,
    existemiobligation: null,
    customerstatus: null
  }
};
class LoanDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      loanDetailOpen: true,
      loanPurposeList: cloneDeep(loadPurpose),
      form: cloneDeep(initForm),
      amountData: [100, 10000],
      collateralData: [1, 5665448],
      tenureList: tenure,
      saveForm: false,
      loandDetailLoading: false
    };
  }
  loanDetailOpen = () => {
    let { loanDetailOpen } = this.state;
    this.setState({ loanDetailOpen: !loanDetailOpen });
  };
  componentDidMount() {
    let { leadDetail } = this.props;
    this.setState({ form: { ...this.state.form, ...leadDetail } });
  }
  AmountFigure = amount => {
    if (amount > 0 && amount <= 99) {
      return "rs";
    } else if (amount > 99 && amount <= 999) {
      return "hundred rs";
    } else if (amount > 999 && amount <= 99999) {
      return "thousand res";
    } else if (amount > 99999 && amount <= 9999999) {
      return "lac rs";
    } else if (amount > 9999999 && amount <= 999999999) {
      return "cr rs";
    } else if (amount > 999999999 && amount <= 99999999999) {
      return "arab rs";
    }
    return "";
  };
  render() {
    let {
      loanDetailOpen,
      form,
      loanPurposeList,
      amountData,
      collateralData,
      tenureList,
      saveForm,
      loandDetailLoading
    } = this.state;
    let {
      purposeofloan,
      errors,
      amount,
      collateralvalue,
      tenure,
      yeild
    } = form;
    let { loanDetail } = this.props;
    return (
      <React.Fragment>
        <div className="gAccordion">
          <div className="gAccordion__title" onClick={this.loanDetailOpen}>
            <i class="icon">{loanDetailOpen ? "-" : "+"}</i> Loan Details
          </div>
          {loanDetailOpen && (
            <div className="gAccordion__body pl-4">
              <div className="row align-items-center pr-lg-5 mt-3">
                <div className="col-12 mb-3">
                  <label class="fs-14 mb-0 gTextPrimary fw-700">
                    Loan against property
                  </label>
                </div>
                <div class="col-md-4 col-lg-2 d-flex align-items-center">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">
                    Purpose of Loan
                  </label>
                </div>
                <div class="col-md-8 col-lg-4 mt-2 mt-lg-0 mr-auto">
                  <div class="select">
                    {loanDetail &&
                      loanDetail.purposelist.map(res => {
                        if (res.subcatId == purposeofloan) {
                          return res.loanpurpose;
                        }
                      })}
                  </div>
                </div>
              </div>
              <div className="row align-items-center pr-lg-5 mt-3">
                <div class="col-md-4 col-lg-2 d-flex align-items-center">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">
                    Amount Required
                  </label>
                </div>
                <div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                  {amount}
                </div>
                <div class="col-md-8 col-lg-5 d-flex align-items-center mt-lg-0 mt-3 offset-md-4 offset-lg-0">
                  <div class="progressWrap w-100">
                    <span className="amount colorGreen" style={{ left: "50%" }}>
                      {amount} {this.AmountFigure(amount)}
                    </span>
                    {loanDetail && (
                      <div class="progress w-100">
                        <div
                          class="progress-bar"
                          role="progressbar"
                          style={{
                            width:
                              (amount * 100) /
                                loanDetail.loandetails.maxloanamt +
                              "%"
                          }}
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    )}
                    <span className="valueMin">
                      {loanDetail && loanDetail.loandetails.minloanamt}
                    </span>
                    <span className="valueMax">
                      {loanDetail && loanDetail.loandetails.maxloanamt}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row align-items-center pr-lg-5 mt-3">
                <div class="col-md-4 col-lg-2 d-flex align-items-center">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">
                    Collateral Declared Value
                  </label>
                </div>
                <div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                  {collateralvalue}
                </div>
                <div class="col-md-8 col-lg-5 d-flex align-items-center mt-lg-0 mt-3 offset-md-4 offset-lg-0">
                  <div class="progressWrap w-100">
                    <span className="amount colorGreen" style={{ left: "55%" }}>
                      {collateralvalue} {this.AmountFigure(amount)}
                    </span>
                    <div class="progress w-100">
                      {loanDetail && (
                        <div
                          class="progress-bar"
                          role="progressbar"
                          style={{
                            width:
                              (collateralvalue * 100) /
                                loanDetail.loandetails.maxcollateralvalue +
                              "%"
                          }}
                          aria-valuenow="55"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      )}
                    </div>
                    <span className="valueMin">
                      {loanDetail && loanDetail.loandetails.mincollateralvalue}
                    </span>
                    <span className="valueMax">
                      {loanDetail && loanDetail.loandetails.maxcollateralvalue}
                    </span>
                  </div>
                </div>
              </div>
              <div className="row align-items-center pr-lg-5 mt-3">
                <div class="col-md-4 col-lg-2 d-flex align-items-center">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">
                    Tenure Required
                  </label>
                </div>
                <div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3">
                  <div class="select">
                    {/* {tenureList.map(res => {
                      if (res.id == tenure) {
                        return tenureList.label;
                      }
                    })} */}
                    {tenure}
                  </div>
                </div>
                <div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3 mr-auto">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">Month</label>
                </div>
                <div class="col-md-8 col-lg-5 d-flex align-items-center mt-lg-0 mt-3 offset-md-4 offset-lg-0">
                  {loanDetail && (
                    <div class="progressWrap w-100">
                      <span
                        className="amount colorGreen"
                        style={{ left: "75%" }}
                      >
                        {tenure} Months
                      </span>
                      <div class="progress w-100">
                        <div
                          class="progress-bar"
                          role="progressbar"
                          style={{
                            width:
                              (tenure * 100) /
                                loanDetail.loandetails.maxtenure +
                              "%"
                          }}
                          aria-valuenow="75"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span className="valueMin">
                        {loanDetail.loandetails.mintenure}
                      </span>
                      <span className="valueMax">
                        {loanDetail.loandetails.maxtenure}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="row align-items-center pr-lg-5 mt-3">
                <div class="col-md-4 col-lg-2 d-flex align-items-center">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">
                    Yield Required
                  </label>
                </div>
                <div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3">
                  {yeild}
                </div>
                <div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">%</label>
                </div>
              </div>
            </div>
          )}
          <hr class="bg_lightblue border-0 h-1px" />
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(LoanDetail);
