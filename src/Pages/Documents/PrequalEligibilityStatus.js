import React from "react";
import BreadCrumbDocuments from "./BreadCrumbDocuments";
import { postLeadDetail } from "../../Utility/Services/QDE";
import { public_url } from "../../Utility/Constant";
import { postCoApplicantDetailDetail } from "../../Utility/Services/CoApplicant";
import { getApplicantbyLoan } from "../../Utility/Services/Documents";
import { te } from "../../Utility/ReduxToaster";
import { find } from "lodash";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { getprequaleligibility } from "../../Utility/Services/GetPrequalEligibility";

class PrequalEligibilityStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      leadDetail: "",
      leadType: "",
      refnumber: null,
      loanNumber: "GS100LAP010816",
      status: "",
      prequalEligibilityData: {},
      loading: false
    };
  }

  getApplicantbyLoan = status => {
    //dont remove comments
    let { match } = this.props;
    let { params } = match;
    getApplicantbyLoan(params.refrencenumber).then(res => {
      console.log("PrequalEligibilityStatus -> res", res);
      this.setState({
        leadDetail: res.data.data.firmName
          ? res.data.data.firmName
          : res.data.data.customerName,
        leadType: res.data && res.data.data && res.data.data.typeOfEntity,
        refnumber: res.data.data.loannumber,
        status: status === undefined ? params.status : status
      });
    });
  };

  componentDidMount() {
    let { match } = this.props;
    let { params } = match;
    let postData = { leadCode: params.leadcode };

    if (this.props.location.data !== undefined) {
      this.setState({ prequalEligibilityData: this.props.location.data });
      this.getApplicantbyLoan();
    } else {
      this.setState({ loading: true });
      getprequaleligibility(params.leadcode).then(res => {
        /* if (res.status == 404) {
          res = {
            data: {
              loanapplicantname: "VIVEK BABAN PATIL",
              loanstatus: "GO",
              loanreferencenumber: "GS001LAP040245",
              deviationlist: [
                "DEVIATION_LOANAMOUNT",
                "DEVIATION_TENURE",
                "COMPANY_VINTAGE_DEVIATION",
                "BANKING_SCORE"
              ]
            },
            message: "Application is Good to Proceed !!!",
            error: false,
            statusCode: "200",
            status: "success"
          };
        } */
        if (res.error) {
          this.setState({ loading: true });
          this.props.history.goBack();
          return;
        } else {
          this.getApplicantbyLoan(res.data.loanstatus);
          this.setState({ prequalEligibilityData: res.data, loading: false });
        }
      });
    }
  }

  onNextClick = (e, status) => {
    e.preventDefault();
    let { match } = this.props;
    let { params } = match;
	let { leadType } = this.state;
	//if true enable next button and redirect according to condition else redirect to summary
    if (status) {
      if (leadType && leadType == "Sole Proprietory Concern") {
        this.props.history.push(
          `${public_url.collateral_detail}/${params.leadcode}`
        );
      } else {
        this.props.history.push(
          `${public_url.promoter_detail}/${params.leadcode}`
        );
      }
    } else {
      this.props.history.push(
        `${public_url.co_applicant_status}/${params.leadcode}`
      );
    }
  };

  render() {
    let { match } = this.props;
    let {
      leadDetail,
      refnumber,
      status,
      prequalEligibilityData,
      loading,
      leadType
    } = this.state;

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
        {loading ? (
          <div className="row">
            <div className="col-lg-12 text-primary font-weight-bold fs-24 text-center mt-3 h3 ">
              <i className="fa fa-spinner fa-spin mr-2 fa-lg" /> Loading...
            </div>
          </div>
        ) : (
          <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
            <div className="container">
              <div className="bg-white p-md-4 p-3 text-center mt-5">
                <h2 className="colorGreen fs-18 mb-md-4 mb-3 mt-3">
                  {status === "GO"
                    ? "Good To Proceed"
                    : status === "NOGO"
                    ? "Not Good To Proceed"
                    : ""}
                </h2>
                <h2 className="mr-auto text-primary fs-20 mb-md-4 mb-3 fs-900">
                  {leadDetail && leadDetail}
                </h2>
                <div className="text-primary text-center">{`For`}</div>
                <h2 className="colorGreen fs-20 mb-md-4 mb-3 mt-3">
                  Reference ID: {refnumber && refnumber}
                </h2>
                {/* {status === "NOGO" && (
										<div className="text-left pr-lg-5 mt-3 pl-5">
											<div class="row">
												<div class="col-md-4 pl-4 offset-md-4 mb-3 gAccordion__title text-secondary font-weight-bold">
													Deviations
                      </div>
											</div>
											<div class="row">
												<div class="col-md-4 pl-5 offset-md-4">
													<ul style={{ listStyleType: "disc" }}>
														{prequalEligibilityData &&
															prequalEligibilityData.deviationlist &&
															prequalEligibilityData.deviationlist.length > 0 &&
															prequalEligibilityData.deviationlist.map(
																(deviation, key) => {
																	return (
																		<li className="text-left fs-14">
																			{deviation}
																		</li>
																	);
																}
															)}
													</ul>
												</div>
											</div>
										</div>
									)} */}
                {status === "GO" ? (
                  <div className="text-sm-right">
                    <button
                      className="btn btn-green text-white btn-rounded fs-16 py-2 mb-md-0 mb-2"
                      onClick={e =>
                        this.onNextClick(e,true)
                      }
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </section>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(PrequalEligibilityStatus);
