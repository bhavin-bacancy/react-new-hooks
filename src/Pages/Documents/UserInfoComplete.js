import React from "react";
import BreadCrumbDocuments from "./BreadCrumbDocuments";
import { postLeadDetail } from "../../Utility/Services/QDE";
import { public_url } from "../../Utility/Constant";
import { postCoApplicantDetailDetail } from "../../Utility/Services/CoApplicant";
import { getApplicantbyLoan } from "../../Utility/Services/Documents";
import { te } from "../../Utility/ReduxToaster";
import { find } from "lodash";
import { Link } from "react-router-dom";

export default class UserInfoComplete extends React.Component {
  constructor() {
    super();
    this.state = {
      leadDetail: "",
      refnumber: null,
      loanNumber: "GS100LAP010816"
    };
  }

  getApplicantbyLoan = () => {
    //dont remove comments
    let { match } = this.props;
    let { params } = match;
    getApplicantbyLoan(params.refrencenumber).then(res => {
      this.setState({
        leadDetail: res.data.data.customerName,
        refnumber: res.data.data.loannumber
      });
    });
  };

  componentDidMount() {
    this.getApplicantbyLoan();
  }

  render() {
    let { match } = this.props;
    let { leadDetail, refnumber } = this.state;
    console.log("match", match);

    return (
      <React.Fragment>
        {" "}
        {/* Congratulations Box */}
        <div className="backToDashboard py-3">
          <div className="container-fluid">
            <Link to={public_url.lead_list}>Home</Link>
          </div>
        </div>
        <BreadCrumbDocuments />
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div className="bg-white p-md-4 p-3 text-center mt-5">
              <h2 className="colorGreen fs-18 mb-md-4 mb-3 mt-3">
                Congratulations!!
              </h2>
              <h2 className="mr-auto text-primary fs-20 mb-md-4 mb-3 fs-900">
                {leadDetail && leadDetail}
              </h2>
              <div className="text-primary text-center">{`For`}</div>
              <h2 className="colorGreen fs-20 mb-md-4 mb-3 mt-3">
                Reference ID: {refnumber && refnumber}
              </h2>
              <div className="text-sm-right">
                {match.params.type === "applicant" ? (
                  <Link
                    // to={`${public_url.checklist}/${match.params.leadcode}/${match.params.comobileno}`}
                    to={`${public_url.collateral_detail}/${match.params.leadcode}`}
                  >
                    <button className="btn btn-green text-white btn-rounded fs-16 py-2 mb-md-0 mb-2">
                      Next
                    </button>
                  </Link>
                ) : (
                  <Link
                    // to={`${public_url.co_applicant_checklist}/${match.params.leadcode}/${match.params.comobileno}`}
                    to={`${public_url.collateral_detail}/${match.params.leadcode}`}
                  >
                    <button className="btn btn-green text-white btn-rounded fs-16 py-2 mb-md-0 mb-2">
                      Next
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
