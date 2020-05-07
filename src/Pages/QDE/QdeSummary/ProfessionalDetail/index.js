import React from "react";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../../../Utility/Helper";
import {
  postAddLoanDetail,
  postAddProfessionalDetail
} from "../../../../Utility/Services/QDE";
import { te, ts } from "../../../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";
import { public_url } from "../../../../Utility/Constant";

import {
  getIndustryList,
  getSectorList,
  getProfileList,
  getSubsectorList
} from "../../../../Utility/Services/QDE";
const initForm = {
  sector: "",
  industry: "",
  subindustry: "",
  profile: "",
  turnover: "",
  networth: "",
  ebitda: "",
  //cin: "",
  //registrationNumber: "",
  //llpin: "",
  //leadCode: "",
  errors: {
    sector: null,
    industry: null,
    subindustry: null,
    profile: null,
    turnover: null,
    networth: null,
    ebitda: null
    //cin: null,
    //registrationNumber: null,
    //llpin: null,
  }
};
class ProfessionalDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      ProfessionalDetailOpen: true,
      form: cloneDeep(initForm),
      sectorList: [],
      industryList: [],
      subindustryList: [],
      profileList: [],
      professionalFormLoading: false,
      saveForm: false
    };
  }
  profileList = () => {
    let { history } = this.props;
    let type = "";
    if (
      history.location.pathname.startsWith(public_url.co_applicant_summary_page)
    ) {
      type = "RETAIL";
    } else {
      type = "SME";
    }
    getProfileList(type).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        this.setState({ profileList: res.data.data });
      }
    });
  };
  ProfessionalDetailOpen = () => {
    let { ProfessionalDetailOpen } = this.state;
    this.setState({ ProfessionalDetailOpen: !ProfessionalDetailOpen });
  };

  componentDidMount() {
    let { form } = this.state;
    let { leadDetail } = this.props;
    this.IndustryList();
    this.setState({ form: { ...form, ...leadDetail } });
    this.profileList();
    this.subIndustry();
    if (leadDetail && leadDetail.sector) {
      this.subIndustry(leadDetail.sector);
    }
  }

  subIndustry = sector => {
    getSubsectorList(sector).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        // te(res.data.message)
      } else {
        this.setState({ subindustryList: res.data.data });
      }
    });
  };

  IndustryList = () => {
    getIndustryList().then(res => {
      if (res.error) {
        return;
      }
      this.setState({ industryList: res.data.data });
    });
  };
  render() {
    let { selectedEntity } = this.props;
    let {
      ProfessionalDetailOpen,
      form,
      sectorList,
      industryList,
      profileList,
      subindustryList,
      professionalFormLoading,
      saveForm
    } = this.state;
    let {
      sector,
      industry,
      subindustry,
      profile,
      turnover,
      networth,
      registrationNumber,
      ebitda,
      typeOfEntity,
      cin,
      errors,
      llpin,
      emptype,
      empname,
      designation,
      department,
      segment,
      emiObligation
    } = form;

    let ProfessionalFormStatus = false;
    let loanDetailFormStatus = false;
    let CheckForm = Object.keys(form).filter(res => {
      if (res != "errors" && !form[res]) return res;
    });
    let formStatus = getFormDetails(form, () => {});

    if (CheckForm.length == 0 && formStatus) {
      ProfessionalFormStatus = true;
    }

    return (
      <React.Fragment>
        <div className="gAccordion">
          <div
            className="gAccordion__title"
            onClick={this.ProfessionalDetailOpen}
          >
            <i className="icon">{ProfessionalDetailOpen ? "-" : "+"}</i>{" "}
            Professional Profile
          </div>
          {ProfessionalDetailOpen && (
            <div className="gAccordion__body pl-4">
              {
                <div className="row align-items-center pr-lg-5 mt-3">
                  {emptype && (
                    <>
                      <div className="col-md-4 col-lg-2 d-flex align-items-center">
                        <label className="fs-14 mb-0 gTextPrimary fw-500">
                          Employee Type
                        </label>
                      </div>
                      <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                        <div className="select">{emptype}</div>
                      </div>
                    </>
                  )}
                  {turnover != 0 && (
                    <>
                      {!emptype && (
                        <>
                          <div className="col-md-4 col-lg-2 d-flex align-items-center">
                            <label className="fs-14 mb-0 gTextPrimary fw-500"></label>
                          </div>
                          <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto"></div>
                        </>
                      )}{" "}
                      <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                        <label className="fs-14 mb-0 gTextPrimary fw-500">
                          Turnover
                        </label>
                      </div>
                      <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                        {turnover ? turnover : "N/A"}
                      </div>
                    </>
                  )}
                </div>
              }
              <div className="row align-items-center pr-lg-5 mt-3">
                <div className="col-md-4 col-lg-2 d-flex align-items-center">
                  <label className="fs-14 mb-0 gTextPrimary fw-500">
                    Sector
                  </label>
                </div>
                <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                  <div className="select">
                    {/* {sectorList.map(res => {
                      if (res.SectorCode == sector) {
                        return res.SectorDesc;
                      }
                    })} */}
                    {sector}
                    {/* {sectorList.map(res => {
                      if (res.sectorCode == sector) {
                        return res.sectorName;
                      }
                    })} */}
                  </div>
                </div>
                {networth != 0 && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Networth
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      {networth ? networth : "N/A"}
                    </div>
                  </>
                )}
              </div>{" "}
              <div className="row align-items-center pr-lg-5 mt-3">
                <div className="col-md-4 col-lg-2 d-flex align-items-center">
                  <label className="fs-14 mb-0 gTextPrimary fw-500">
                    Industry
                  </label>
                </div>
                <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                  <div className="select">
                    {/* {industryList.map(res => {
                      if (res.IndustryCode == industry) {
                        return res.IndustryDesc;
                      }
                    })} */}

                    {industryList.map(res => {
                      if (res.industry_id == industry) {
                        return res.industry_desc;
                      }
                    })}
                  </div>
                </div>
                {ebitda != 0 && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        EBITDA
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      {ebitda ? ebitda : "N/A"}
                    </div>
                  </>
                )}
              </div>{" "}
              <div className="row align-items-center pr-lg-5 mt-3">
                <div className="col-md-4 col-lg-2 d-flex align-items-center">
                  <label className="fs-14 mb-0 gTextPrimary fw-500">
                    Sub-Industry
                  </label>
                </div>
                <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                  <div className="select">
                    {/* {subindustry} */}
                    {subindustryList &&
                      subindustryList.map(res => {
                        if (res.subSectorCode == subindustry) {
                          return res.subSectorDesc;
                        }
                      })}
                  </div>
                </div>
              </div>{" "}
              <div className="row align-items-center pr-lg-5 mt-3">
                {profile && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Profile
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                      <div className="select">
                        {profileList.map(res => {
                          if (res.profile_id == profile) {
                            return res.profile_desc;
                          }
                        })}
                      </div>
                    </div>
                  </>
                )}
                {selectedEntity == 8 && (
                  <React.Fragment>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        LLPIN
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                      {llpin}
                    </div>
                  </React.Fragment>
                )}

                {cin && (
                  <React.Fragment>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Cin
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">{cin}</div>
                  </React.Fragment>
                )}

                {/* {selectedEntity == 9 && ( */}
                {typeOfEntity == "Society" && (
                  <React.Fragment>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Society Registration Number
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      {registrationNumber}
                    </div>
                  </React.Fragment>
                )}
                {/* {selectedEntity == 10 && ( */}
                {typeOfEntity == "TRUSTS" && (
                  <React.Fragment>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Trust Registration Number
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      {registrationNumber}
                    </div>
                  </React.Fragment>
                )}
                {empname && (
                  <React.Fragment>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Employer Name
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      {empname}
                    </div>
                  </React.Fragment>
                )}
              </div>
              <div className="row align-items-center pr-lg-5 mt-3">
                {designation && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Designation
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                      <div className="select">
                        {/* {subindustryList.map(res => {
                      if (res.value == subIndustry) {
                        return res.label;
                      }
                    })} */}
                        {designation}
                      </div>
                    </div>
                  </>
                )}
                {department && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Department
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      {department}
                    </div>
                  </>
                )}
              </div>
              <div className="row align-items-center pr-lg-5 mt-3">
                {segment && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Segment
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
                      <div className="select">
                        {/* {subindustryList.map(res => {
                      if (res.value == subIndustry) {
                        return res.label;
                      }
                    })} */}
                        {segment}
                      </div>
                    </div>
                  </>
                )}
                {(emiObligation || emiObligation == 0) && (
                  <>
                    <div className="col-md-4 col-lg-2 d-flex align-items-center ">
                      <label className="fs-14 mb-0 gTextPrimary fw-500">
                        Emi Obligation
                      </label>
                    </div>
                    <div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      <div className="select">
                        {/* {subindustryList.map(res => {
                      if (res.value == subIndustry) {
                        return res.label;
                      }
                    })} */}
                        {emiObligation}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="row justify-content-end mt-4 mx-0">
                {!saveForm && ProfessionalFormStatus && (
                  <button
                    disabled=""
                    className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3"
                  >
                    Cancel
                  </button>
                )}
                {/* <button
                  disabled={!ProfessionalFormStatus}
                  class={`btn btn-secondary btn-rounded ls-1 py-1 px-5 cursor-pointer fs-16  ${!saveForm &&
                    ProfessionalFormStatus &&
                    "btn-green"}`}
                  onClick={this.SaveForm}
                >
                  {saveForm
                    ? "Edit"
                    : professionalFormLoading
                    ? "Saving..."
                    : "Save"}
                </button> */}
              </div>
            </div>
          )}

          <hr className="bg_lightblue border-0 h-1px" />
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(ProfessionalDetail);
