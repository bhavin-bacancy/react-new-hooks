import React from "react";
import BreadCrumbsPayment from "./BreadCrumbsPayment";
import { withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import {Link} from "react-router-dom"
class SmsPaymentFailed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { match } = this.props;
    let { params } = match;
    return (
      <React.Fragment>
        <div className="backToDashboard py-3 d-none d-xl-block">
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
                <div className="bg-white p-4  border text-center my-5">
                  <>          
                      <div className="p-4 text-center my-4">
                          <span className="text-danger fa fa-close text-blue fs-50 mb-3"></span>
                          <div className="text-align-center text-danger fs-25 font-weight-bold">  Payment Not received </div>
                          <div className="text-align-center colorGreen fs-14 font-weight-bold">  </div>
                      </div>    
                  </>
                </div>                                                                  

                <div className="text-sm-right w-100 d-flex justify-content-end">
                  <button
                    className="btn btn-secondary btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 d-none d-xl-block"
                    onClick={this.props.history.goBack}
                  >
                    Previous
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
export default withRouter(SmsPaymentFailed);
