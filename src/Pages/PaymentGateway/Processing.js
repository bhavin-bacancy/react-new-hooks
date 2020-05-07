import React from "react";
import { public_url } from "../../Utility/Constant";
import {Link} from "react-router-dom"
export default class Processing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <div className="backToDashboard py-3">
          <div className="container-fluid">
            <Link to={public_url.lead_list}>Home</Link>
          </div>
        </div>
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div className="bg-white p-md-4 p-3 text-center mt-5">
              <div className="text-primary fw-400 fs-18 font-weight-bold mr text-left mb-4">
                Growth source processing fees
              </div>
              <div class="c_radiobtn styleGreen d-flex pl-md-5 mb-3 flex-wrap">
                <div className="mr-sm-5 mr-5">
                  <label
                    htmlFor="pay"
                    className="colorGreen fs-14 font-weight-bold"
                  >
                    Online Payment
                  </label>
                </div>
              </div>
              <div className="d-flex flex-wrap ml-lg-4 border p-3 p-lg-5 justify-content-md-around mb-3">
                <div className="text-primary  ml-lg-4 text-left mb-3">
                  {/* <img
                                        src="/images/830.gif"
                                        className="img-fluid"
                                        alt="Date Icon"
                                    /> */}
                  Proceeding to the payment gateway.
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
