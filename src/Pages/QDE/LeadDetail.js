import React from "react";
import { withRouter } from "react-router-dom";
const LeadDetail = props => {
  console.log(props);
  let { match, leadDetail } = props;
  let { params } = match;

  return (
    <React.Fragment>
      {" "}
      <div class="d-flex lead-detail lead-detail--new flex-wrap mb-4">
        <div class="lead-code d-flex align-items-center justify-content-center">
          <p class="mb-0 px-2 py-2 fs-14 fw-700 text-center">
            {" "}
            {params.leadcode}
          </p>
        </div>
        <div class="col-md-5 d-flex align-items-center">
          <div class="row w-100">
            <p class="col-lg-5 mb-0 text-white fw-600">Lead Name:</p>
            <span className="col-lg-7 text-primary fw-600">
              {leadDetail && leadDetail.leadcustname}
            </span>
          </div>
        </div>
        <div class="col-md-5 d-flex flex-column ml-auto py-2">
          <div class="row w-100 mb-auto">
            <p class="col-lg-5 mb-0 text-white fw-600">Mobile Number:</p>
            <span className="col-lg-7 text-primary fw-600">
            {leadDetail && leadDetail.mobileNumber}
              {/* {params.mobileno} */}
              {/* {params.comobileno} */}
            </span>
          </div>
          <div class="row w-100">
            <p class="col-lg-5 mb-0 text-white fw-600">Email Address:</p>
            <span className="col-lg-7 text-primary fw-600">
              {leadDetail && leadDetail.emailid}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withRouter(LeadDetail);
