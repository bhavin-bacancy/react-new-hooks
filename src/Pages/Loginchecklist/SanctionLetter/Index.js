import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import {
  getSanctionDetail,
  fetchCreditStatus,
} from "../../../Utility/Services/Sanction";
import { SanctionPage } from "./SanctionPage";
import { ts, te } from "../../../Utility/ReduxToaster";

export const SanctionLetter = (props) => {
  const [state, setState] = useState({
    sanctionDetail: {},
    creditflag: false,
  });

  let { sanctionDetail, creditflag } = state;

  /*   useEffect(() => {
    getSanctionDetails();
  }, []); */

  useEffect(() => {
    getCreditStatus();
  }, []);

  const getSanctionDetails = () => {
    let { match } = props;
    getSanctionDetail(match.params.leadcode).then((res) => {
      if (res.error) return;
      setState({ sanctionDetail: res.data });
    });
  };

  const getCreditStatus = () => {
    let { match } = props;

    fetchCreditStatus(match.params.leadcode).then((response) => {
      console.log("fetchCreditStatus", response, match.params.leadcode);
      if (response.error) {
        return;
      }
      if (!response.data.creditflag) {
        ts(response.data.message);
      }

      getSanctionDetail(match.params.leadcode).then((res) => {
        if (res.error) return;
        setState({ sanctionDetail: res.data, creditflag: response.data.data.creditflag });
      });
    });
  };
  return (
    <>
      <div className="backToDashboard py-3">
        <div className="container-fluid">
          <Link to={public_url.lead_list}>Back to Dashboard</Link>
        </div>
      </div>
      <SanctionPage
        {...props}
        sanctionDetail={sanctionDetail}
        creditflag={creditflag}
      />
    </>
  );
};
