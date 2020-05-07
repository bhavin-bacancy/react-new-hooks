import React from "react";
import { Link, withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";

const BreadCrumb = props => {
  let { match } = props;
  return (
    <>
      <section className="bg_l-secondary pt-4">
        <div className="container  ">
          <div className="d-flex justify-content-start align-items-center">
            <div className="breadcrums d-flex align-items-center flex-wrap">
              <ul>
                <li className="mr-1" class="active">
                  <Link to={`${public_url.prospect_list}`}>LAP Prospects</Link>
                </li>
                <li className="mr-1" class="active">
                  <Link
                    to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                  >
                    Profile
                  </Link>
                </li>
                <li className="mr-1" class="active">
                  Signatory
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export const BreadCrumbs = withRouter(BreadCrumb);
