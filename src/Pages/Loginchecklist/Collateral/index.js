import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { DetailForm } from "./DetailForm";
import { postGetCollateralDetail } from "../../../Utility/Services/CollateralDetail";
import { te } from "../../../Utility/ReduxToaster";

export const Collateral = props => {
  let [state, setState] = useState({
    collateralDetail: [],
    mainlApplicant: ""
  });

  useEffect(() => {
    let { match } = props;
    GetCollateralDetail(match.params.leadcode);
  }, []);

  const GetCollateralDetail = leadcode => {
    postGetCollateralDetail(leadcode).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        setState({
          collateralDetail: res.data.data,
          mainlApplicant: res.data.applicant
        });
      }
    });
  };

  return (
    <>
      <div className="backToDashboard py-3">
        <div className="container-fluid">
          <Link to={public_url.lead_list}>Back to Dashboard</Link>
        </div>
      </div>
      <BreadCrumbs
        {...props}
        collateralDetail={state.collateralDetail}
        mainlApplicant={state.mainlApplicant}
      />
      <DetailForm
        collateralDetail={state.collateralDetail}
        GetCollateralDetail={GetCollateralDetail}
        mainlApplicant={state.mainlApplicant}
      />
    </>
  );
};
