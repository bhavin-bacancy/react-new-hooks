import React from "react";
import BreadCrumbsPayment from "./BreadCrumbsPayment";
import { Link } from "react-router-dom";

export default class PaymentReject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        {/* <div className="backToDashboard py-3">
          <div className="container-fluid">
            <Link href="#">Home</Link>
          </div>
        </div> */}
        <BreadCrumbsPayment />
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div className="bg-white p-md-4 p-3 text-center mt-5">
              <div className="text-primary fw-400 fs-18 font-weight-bold mr text-left mb-4">
                Growth source processing fees
              </div>
              <>
                <div className="d-flex flex-wrap border p-3 justify-content-md-around mb-3">
                  <div className="row justify-content-center w-100 text-left">
                    <div className="col-md-6 py-lg-3 pr-lg-4">
                      <div className="bg-white">
                        <form className="form_style-1" autoComplete="off">
                          <div className="text-danger fs-14">
                            {" "}
                            Payment Reject
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm-right">
                  <button className="btn btn-secondary mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
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
