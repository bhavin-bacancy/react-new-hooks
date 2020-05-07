import React from "react";
import BreadCrumbsPayment from "./BreadCrumbsPayment";
import { public_url } from "../../Utility/Constant";
import { cloneDeep } from "lodash";
import {
  postBankBranchIfsc,
  postGetAmount,
  postDepositePayment
} from "../../Utility/Services/Payment";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

class ChequeConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {
      accountHolderName,
      ifscCode,
      branch,
      paymentDate,
      amount,
      bank,
      chequeDdNumber,
      selectedOption
    } = this.props.location.state;
    let { match } = this.props;
    let { params } = match;
    return (
      <React.Fragment>
        <div className="backToDashboard py-3">
          <div className="container-fluid">
            <Link to={public_url.lead_list}>Home</Link>
          </div>
        </div>
        <BreadCrumbsPayment />
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div className="bg-white p-md-4 p-3 text-center mt-5">
              <div className="text-primary fw-400 fs-18 font-weight-bold mr text-left mb-4">
                Growth source processing fees
              </div>
              <>
                <div className="colorGreen fw-400 fs-18 font-weight-bold mr text-left mb-2">
                  {this.props.location.state ? (
                    <>
                      Payment completed &nbsp;
                      <span class="fa fa-check text-blue fs-30 mb-3"></span>
                    </>
                  ) : (
                    "Your cheque is recieved being processed"
                  )}
                </div>
                <div className="d-flex flex-wrap border p-3 justify-content-md-around mb-3">
                  <div className="row justify-content-center w-100 text-left">
                    <div className="col-md-6 py-lg-3 pr-lg-4">
                      <div className="bg-white">
                        <form className="form_style-1" autoComplete="off">
                          <div className="form-group row align-items-start">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              Account Holder's Name:
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                              {accountHolderName}
                            </div>
                          </div>
                          <div className="form-group row align-items-start position-relative">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              IFSC Code:
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form d-flex align-items-center">
                              {ifscCode}
                            </div>
                          </div>
                          <div className="form-group row align-items-start">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              Branch Name:
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                              {branch}
                            </div>
                          </div>
                          <div className="form-group row align-items-start">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              Date:
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form d-flex align-items-start">
                              <div className="select mr-2">{paymentDate}</div>
                            </div>
                            <div className="col-2 col-md-1 px-2"></div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="col-md-6 py-lg-3 pl-lg-4">
                      <div className="bg-white">
                        <form className="form_style-1" autoComplete="off">
                          <div className="form-group row align-items-start">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              Amount:
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                              <span className="colorGreen font-weight-bold">
                                {" "}
                                ₹{amount}
                              </span>
                            </div>
                          </div>
                          <div className="form-group row align-items-start">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              Bank Name:
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                              {bank}
                            </div>
                          </div>

                          <div className="form-group row align-items-start">
                            <label
                              htmlFor="colFormLabelSm"
                              className="col-sm-12 col-lg-4 col-xl-6 text-primary mb-0 d-flex align-items-center mt-1"
                            >
                              {selectedOption === "cheque"
                                ? "Cheque No:"
                                : "Demand Draft No:"}
                            </label>
                            <div className="col-sm-12 col-lg-8 col-xl-6 create-lead-form">
                              {chequeDdNumber}
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm-right">
                  <button
                    className="btn btn-secondary btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2"
                    onClick={() => {
                      this.props.history.push(
                        `${public_url.documents}/${match.params.leadcode}/${match.params.refrencenumber}`
                      );
                    }}
                  >
                    Next
                  </button>
                </div>
              </>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default withRouter(ChequeConfirmation);
