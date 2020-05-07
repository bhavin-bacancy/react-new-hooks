import React from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
// import BreadCrumbs from "../QDE/BreadCrumbs";

export default class PaymentProfile extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <React.Fragment>
        <div className="backToDashboard py-3">
          <div className="container-fluid">
            <Link to={public_url.lead_list}>Home</Link>
          </div>
        </div>
        {/* <BreadCrumbs /> */}
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div className="bg-white p-md-4 p-3 text-center mt-5">
              <h2 className="colorGreen fs-18 mb-md-5 mb-4 my-3">
                Congratulations!!
              </h2>
              <h2 className="mr-auto text-primary fs-20 mb-md-5 mb-4 fs-900">
                Krishna Handlooms
              </h2>
              <p className="mr-auto text-primary fs-18 mb-md-5 mb-4">
                Your Reference ID has been <br /> created
              </p>
              <h2 className="colorGreen fs-20 mb-md-5 mb-4 my-3">
                XXXXXXXXXXX
              </h2>
              <div className="text-sm-right">
                <button className="btn btn-secondary mr-3 text-primary btn-rounded fs-16 mb-md-0 mb-2">
                  Previous
                </button>
                <Link
                  className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2"
                  to={public_url.payment_methods}
                >
                  Next
                </Link>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
