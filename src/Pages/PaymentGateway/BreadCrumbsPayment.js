import React from "react";
import { Link, withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";

class BreadCrumbsPayment extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { match } = this.props;
    return (
      <React.Fragment>
        <section className="bg_l-secondary pt-4">
          <div className="container  ">
            <div class="d-flex justify-content-start align-items-center">
              <div className="breadcrums d-flex align-items-center flex-wrap">
                <ul>
                  <li className="mr-1  fs-18" class="active">
                    <Link  to =""
                    // to={`${public_url.lead_list}`}
                    >
                        LAP Prospects
                    </Link>
                  </li>
                  <li className="mr-1  fs-18" class="active">
                    <Link to=""
                    // public_url.co_applicant_status}/:leadcode
                        to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                    >
                        Profile
                    </Link>
                  </li>
                  <li className="mr-1 font-weight-bold fs-18" class="active">
                    <Link to =""
                        // to={`${public_url.lead_con}}`}
                    >
                        Payment
                    </Link>
                  </li>
                </ul>
                {/* <span className="note ml-3 mt-md-0 mt-3">MUM-43</span> */}
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default withRouter(BreadCrumbsPayment);

