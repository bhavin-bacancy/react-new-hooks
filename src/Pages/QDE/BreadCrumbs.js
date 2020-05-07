import React from "react";
import { Link, withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
class BreadCrumbs extends React.Component {
  constructor() {
    super();
  }

  render() {
    let { match, leadDetail, status, history } = this.props;
    return (
      <React.Fragment>
        <section className="bg_l-secondary pt-4">
          <div className="container  ">
            <div class="d-flex justify-content-start align-items-center">
              <div className="breadcrums d-flex align-items-center flex-wrap">
                <ul>
                  <li className="mr-1" class="active">
                    {(leadDetail &&
                      (leadDetail.cif ||
                        history.location.pathname.startsWith(
                          public_url.co_applicant_update_profile
                        ))) ||
                    history.location.pathname.startsWith(
                      public_url.co_applicant_summary_page
                    ) ? (
                      <Link to={`${public_url.prospect_list}`}>
                        LAP Prospects
                      </Link>
                    ) : (
                      <Link to={`${public_url.lead_list}`}>Leads</Link>
                    )}
                  </li>
                  {history.location.pathname.startsWith(
                    public_url.co_applicant_update_profile
                  ) && (
                    <li className="mr-1" class="active">
                      <Link
                        to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                      >
                        Profile
                      </Link>
                    </li>
                  )}
                  {!status && leadDetail && (
                    <li className="mr-1" class="active">
                      <Link
                        to={`${
                          history.location.pathname.startsWith(
                            public_url.co_applicant_update_profile
                          ) ||
                          history.location.pathname.startsWith(
                            public_url.co_applicant_summary_page
                          )
                            ? public_url.co_applicant_update_profile +
                              "/" +
                              match.params.leadcode +
                              "/" +
                              leadDetail.mobileNumber +
                              "/" +
                              leadDetail.custcode
                            : `${public_url.update_profile}/${match.params.leadcode}/${leadDetail.mobileNumber}`
                        }`}
                      >
                        {history.location.pathname.startsWith(
                          public_url.co_applicant_update_profile
                        ) ||
                        history.location.pathname.startsWith(
                          public_url.co_applicant_summary_page
                        )
                          ? "Co-applicant profile"
                          : "Update Profile"}
                      </Link>
                    </li>
                  )}
                  {status && (
                    <li className="mr-1">
                      {
                        <Link
                          to={`${
                            status.type == "applicant"
                              ? `${public_url.update_profile}/${match.params.leadcode}/${leadDetail.mobileNumber}`
                              : `${public_url.co_applicant_update_profile}/${match.params.leadcode}/${status.mobileNumber}/${status.custcode}`
                          }`}
                        >
                          Update Profile
                        </Link>
                      }
                    </li>
                  )}
                </ul>
                <span className="note ml-3 mt-md-0 mt-3">
                  {match.params.leadcode && match.params.leadcode}
                </span>
                {!history.location.pathname.startsWith(
                  public_url.co_applicant_status
                ) &&
                  leadDetail &&
                  leadDetail.cif && (
                    <span className="note ml-3 mt-md-0 mt-3">
                      Cif - {leadDetail.cif}
                    </span>
                  )}
                {leadDetail && leadDetail.loanrefnumber && (
                  <span className="note ml-3 mt-md-0 mt-3">
                    Loan Reference Number-{leadDetail.loanrefnumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default withRouter(BreadCrumbs);
