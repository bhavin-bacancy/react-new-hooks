import React from "react";
import PanGst from "./PanGst";
import AdditionalDetail from "./AdditionalDetail/index";
import {
  postLeadDetail,
  postCreateUpdateCustomer,
  postLoanDetailAsProductDetail,
  postCreateLoan,
  getCityAndStateByPincode
} from "../../../Utility/Services/QDE";
import ProfessionalDetail from "./ProfessionalDetail";
import PersonalDetails from "./ProfessionalDetail/PersonalDetails";
import LoanDetail from "./LoanDetail";
import Extra from "./Extra";
import AdharDetail from "./AdharDetail";
import Tan from "./Tan";
import { public_url } from "../../../Utility/Constant";
import { ts, te, ti } from "../../../Utility/ReduxToaster";
import { Link } from "react-router-dom";
import {
  postCoApplicantDetailDetail,
  postCoCreateCustomer
} from "../../../Utility/Services/CoApplicant";
import { withRouter } from "react-router-dom";
import { find } from "lodash";
import BreadCrumbs from "../BreadCrumbs";
class QdeSummary extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      leadDetail: "",
      mainApplicantData: "",
      loanDetail: ""
    };
  }

  componentDidMount() {
    let { match, history } = this.props;
    let { params } = match;
    if (
      history.location.pathname.startsWith(public_url.co_applicant_summary_page)
    ) {
      this.GetCoapplicantDetail();
    } else {
      this.GetLeadDetail();
    }
  }
  GetCoapplicantDetail = () => {
    let { match } = this.props;
    postCoApplicantDetailDetail(match.params.leadcode).then(res => {
      if (res.error) return;
      if (res.data.error) {
        te(res.data.message);
      } else {
        let coApplicantData = "";
        if (res.data.data.coApplicantList) {
          coApplicantData = find(res.data.data.coApplicantList, {
            custcode: match.params.custcode
          });
        }
        this.setState({
          leadDetail: coApplicantData,
          mainApplicantData: res.data.data
        });
        postLoanDetailAsProductDetail(res.data.data.productId).then(res => {
          if (res.error) return;
          this.setState({ loanDetail: res.data.data });
        });
      }
    });
  };
  CreateCoUpdateCustomer = () => {
    this.setState({ loading: true });
    let { mainApplicantData, leadDetail } = this.state;
    let { match } = this.props;
    let obj = {
      leadCode: match.params.leadcode,
      mobileNumber: leadDetail.mobileNumber
    };
    postCoCreateCustomer(obj).then(res => {
      if (res.error) {
				te(res.data.message);
        this.setState({ loading: false });
        return;
      }
      this.setState({ loading: false });
      if (!res.data.error) {
				ts(res.data.message);
				this.props.history.push(
					`${public_url.co_applicant_status}/${match.params.leadcode}`
				);
      } else {
        if (
          res.data.data.cif ||
          // res.data.data.returnStatus.returnCode == "0000"
          res.data.data.returnCode == "0000"
        ) {
          this.props.history.push(
            `${public_url.co_applicant_status}/${match.params.leadcode}`
          );
        } else if (
          res.data &&
          // res.data.data.returnStatus.returnCode == "41014"
          res.data.data.returnCode == "41014"
        ) {
          te(res.data.message);
        } else {
          te(res.data.message);
        }
      }
    });
  };
  CreateUpdateCustomer = () => {
    this.setState({ loading: true });
    let { match } = this.props;
    let obj = {
      leadCode: match.params.leadcode,
      mobileNumber: match.params.mobileno
    };
    postCreateUpdateCustomer(obj).then(res => {
      if (res.error) {
        this.setState({ loading: false });
        return;
      }
      this.setState({ loading: false });
      if (res.data.error) {
        te(res.data.message);
      } else {
        if (
          res.data.data.cif ||
          // res.data.data.returnStatus.returnCode == "0000"
          res.data.data.returnCode == "0000"
        ) {
          ts(res.data.message);
          this.props.history.push(
            `${public_url.co_applicant_status}/${match.params.leadcode}`
          );
        } else if (
          res.data &&
          // res.data.data.returnStatus.returnCode == "41014"
          res.data.data.returnCode == "41014"
        ) {
          te("Customer PAN Already Exist");
        } else {
          // this.props.history.push(
          //   `${public_url.update_profile_applicant_list}/${match.params.leadcode}/${match.params.mobileno}`
          // );
          te(res.data.message);
          // te("Something went wrong, Please try again !");
        }
      }
    });
  };
  GetLeadDetail = () => {
    let { match } = this.props;
    let { params } = match;
    return postLeadDetail(params.leadcode, params.mobileno).then(res => {
      if (res.error) return;
      this.setState({ leadDetail: res.data.data });
      postLoanDetailAsProductDetail(res.data.data.productId).then(res => {
        if (res.error) return;
        this.setState({ loanDetail: res.data.data });
      });
    });
  };
  GetCityStateByPincode = pincode => {
    let { form } = this.state;
    this.setState({ pincodeLoading: true });
    getCityAndStateByPincode(pincode).then(res => {
      if (res.error) {
        this.setState({ pincodeLoading: false });
        return;
      }
    });
  };
  render() {
    let { match, history } = this.props;
    let { params } = match;
    let { loading, leadDetail, loanDetail } = this.state;

    return (
      <React.Fragment>
        <div className="backToDashboard py-3">
          <div className="container-fluid">
            <Link to={public_url.lead_list}>Home</Link>
          </div>
        </div>
        <BreadCrumbs leadDetail={leadDetail} />
        <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
          <div className="container">
            <div class="d-flex justify-content-start align-items-center">
              <section class="py-4 position-relative bg_l-secondary w-100 ">
                <div class="pb-5 bg-white">
                  {" "}
                  {leadDetail ? (
                    <div className="gAccordion pt-4">
                      <div className="gAccordion__title colorGreen">
                        <b><i className="icon">-</i> {leadDetail.firmName ? leadDetail.firmName :leadDetail.customerName}</b>
                      </div>
                      <div className="gAccordion__body pl-4">
                        <PanGst leadDetail={leadDetail} />
                        <AdditionalDetail leadDetail={leadDetail} />
                        {leadDetail.tanApplicable && (
                          <Tan leadDetail={leadDetail} />
                        )}
                        {history.location.pathname.startsWith(
                          public_url.co_applicant_summary_page 
                        ) && leadDetail && leadDetail.indNonIndFlag == "individual" && <AdharDetail leadDetail={leadDetail} />}

                        <ProfessionalDetail leadDetail={leadDetail} />
                        {history.location.pathname.startsWith(
                          public_url.co_applicant_summary_page
                        ) && <PersonalDetails leadDetail={leadDetail} />}

                        {!history.location.pathname.startsWith(
                          public_url.co_applicant_summary_page
                        ) && (
                          <LoanDetail
                            leadDetail={leadDetail}
                            loanDetail={loanDetail}
                          />
                        )}

                        <Extra leadDetail={leadDetail} />
                      </div>
                    </div>
                  ) : (
                    "Loading... "
                  )}
                  {!history.location.pathname.startsWith(
                    public_url.co_applicant_summary_page
                  ) ? (
                    <>
                      <div className="gAccordion">
                        <div className="row justify-content-end mt-3 pr-4 mt-lg-0 mx-0">
                          <Link
                            to={`${public_url.update_profile}/${params.leadcode}/${params.mobileno}`}
                          >
                            <button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
                              Edit
                            </button>
                          </Link>
                          <button
                            disabled={loading}
                            className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                            onClick={this.CreateUpdateCustomer}
                          >
                            {loading ? "Loading..." : "Confirm"}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="row justify-content-end mt-3 pr-4 mt-lg-0 mx-0">
                      <Link
                        to={`${public_url.co_applicant_update_profile}/${params.leadcode}/${params.comobileno}/${params.custcode}`}
                      >
                        <button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
                          Edit
                        </button>
                      </Link>
                      <button
                        disabled={loading}
                        className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                        onClick={this.CreateCoUpdateCustomer}
                      >
                        {loading ? "Loading..." : "Confirm"}
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
export default withRouter(QdeSummary);
