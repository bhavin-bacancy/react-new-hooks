import React from "react";
import { Link,withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";

 const BreadCrumbs1 = props => {
  return (
    <>
      <section className="bg_l-secondary pt-4">
        <div className="container  ">
          <div class="d-flex justify-content-start align-items-center">
            <div className="breadcrums d-flex align-items-center flex-wrap">
              <ul>
                <li className="mr-1" class="active">
               <Link to={`${public_url.prospect_list}`}>LAP Prospects</Link>
                </li>
                <li className="mr-1" class="active">
               <Link to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}>Profile</Link>
                </li>
                <li className="mr-1" class="active">
                 Disbrusal upload
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export const BreadCrumbs=withRouter(BreadCrumbs1)