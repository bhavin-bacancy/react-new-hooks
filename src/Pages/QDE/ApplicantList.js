import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import { Link } from "react-router-dom";
import { postCreateLoan, postLeadDetail } from "../../Utility/Services/QDE";
import { ts, te } from "../../Utility/ReduxToaster";
import { public_url } from "../../Utility/Constant";

export default class ApplicantList extends React.Component {
  constructor() {
    super();
    this.state = { leadDetail: "" };
  }
  componentDidMount() {
    this.GetLeadDetail();
  }
  GetLeadDetail = () => {
    let { match } = this.props;
    let { params } = match;
    postLeadDetail(params.leadcode, params.mobileno).then(res => {
      if (res.error) return;
      this.setState({ leadDetail: res.data.data });
    });
  };

  CreateLoan = () => {
    let { match } = this.props;
    let obj = {
      leadCode: match.params.leadcode,
      mobileNumber: match.params.mobileno
    };
    this.setState({ loading: true });
    postCreateLoan(obj).then(res => {
      if (res.error) {
        this.setState({ loading: false });
        return;
      }
      if (res.data.error) {
        te(res.data.status);
        this.setState({ loading: false });
      } else {
        ts(res.data.status);
        this.props.history.push(
          `${public_url.update_profile_refrence_number}/${match.params.leadcode}/${match.params.mobileno}/${res.data.data.loanreferencenumber}`
        );
        this.setState({ loading: false });
      }
    });
  };
  render() {
    let { loading, leadDetail } = this.state;
    let { match } = this.props;
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
            <div className="bg-white p-md-4 p-3">
              <div className="d-flex flex-wrap align-items-center mb-4">
                <h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3">
                  - {leadDetail && leadDetail.customerName}
                </h2>
                <Link
                  to={`${public_url.update_profile}/${match.params.leadcode}/${match.params.mobileno}`}
                >
                  <button className="btn btn-secondary btn-rounded text-primary ls-1 cursor-pointer fs-18">
                    Edit
                  </button>
                </Link>
              </div>
              <div className="row">
                <div className="col-md-6 pl-lg-5">
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        Contact details
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        PAN and GST verification
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        Additional Details
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        Aadhaar Details
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        Professional Profile
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        Loan Details
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-10 col-md-5">
                      <label className="fs-14 mb-0 gTextPrimary fw-700">
                        Extras
                      </label>
                    </div>
                    <div className="col-2 col-md-2">
                      <i className="iconCircleTick"></i>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 align-items-center justify-content-center d-flex">
                  <p className="colorGreen">Your profile is completed!</p>
                </div>
                <div className="col-12 text-sm-right">
                  <Link
                    to={`${public_url.co_applicant}/${match.params.leadcode}/${
                      match.params.mobileno
                    }/${leadDetail && leadDetail.cif}`}
                  >
                    <button className="btn mr-3 btn-navy-blue btn-rounded fs-16 py-2 mb-md-0 mb-2">
                      Add Co-applicant
                    </button>
                  </Link>
                  <button
                    className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2"
                    onClick={this.CreateLoan}
                  >
                    {loading ? "Loading..." : " Next"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
