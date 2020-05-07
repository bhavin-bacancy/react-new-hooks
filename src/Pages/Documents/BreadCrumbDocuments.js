import React from "react";
import { Link, withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
class BreadCrumbDocuments extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { match } = this.props;
    return (
      <React.Fragment>
        <section className="bg_l-secondary pt-4">
          <div className="container  ">
            <div className="d-flex justify-content-start align-items-center">
              <div className="breadcrums d-flex align-items-center flex-wrap">
                <ul>
                  <li className="mr-1 active" className="active">
                    <Link to="">LAP Prospects</Link>
                  </li>
                  {/* <li className="mr-1" class="active">
                    <Link to={`${public_url.lead_con}}`}>Update Profile</Link>
                  </li> */}
                  <li className="mr-1">
                    <Link
                      to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                    >
                      Profile
                    </Link>
                    {/* <a href="#">Profile</a> */}
                  </li>
                  <li className="mr-1">
                    <a href="#">Document Upload</a>
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
export default withRouter(BreadCrumbDocuments);
