import React from "react";
import { File } from "../../../Component/Input";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {
  getApplicantbyLoan,
  getWrappedGstPanDetails,
  sendDdeLinkSms,
  checkDdeSmsStatus,
  postGstOtp,
  postSmsVerification
} from "../../../Utility/Services/Documents";
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";
import moment from "moment";
import { cloneDeep } from "lodash";
import CoApplicant from "./CoApplicant";
import { withRouter } from "react-router-dom";
import { te, ts } from "../../../Utility/ReduxToaster";
import { FrontendURL } from "../../../Utility/Config";

class GSTverification extends React.Component {
  constructor() {
    super();
    this.state = {
      GSTOpen: false,
      error: null,
      loanNumber: "GS100LAP010816",
      ddeType: "gst",
      isLoaded: false,
      items: [],
      loanData: "",
      panNumber: "",
      // mainapplicantData: '',
      sendSmsData: "",
      status: "",
      smsDateTime: "",
      displayData: "",
      title: "Send",
      gstData: [],
      checkData: [],
      checkValue: true,
      dateOfBirth: null,
      loader: false,
			dataSendLink: "",
      verifying: true
    };
  }
  handleCheckChange = changeEvent => {
    let { checkData } = this.state;
    if (changeEvent.target.checked) {
      this.setState({ checkData: checkData.push(changeEvent.target.value) });
    } else {
      checkData.splice(checkData.indexOf(changeEvent.target.value), 1);
      this.setState({ checkData: checkData });
    }
  };

  changeTitle = () => {
    this.setState({ title: "Resend" });
  };

  GSTOpen = () => {
    let { GSTOpen } = this.state;
    this.setState({ GSTOpen: !GSTOpen });
  };

  getApplicantbyLoan = () => {
    //don't remove comments
    let { match, data } = this.props;
    let { params } = match;
    let { loanNumber, panNumber, dateOfBirth, mobileNumber } = this.state;

    getApplicantbyLoan(params.refrencenumber).then(res => {
      const sendsms = res.data && cloneDeep(res.data.data);
      delete sendsms.coApplicantList;
      let panNumber = "";
      if (data && data.type) {
      }
      let dataSend = {
        mobileNumber: res.data.data.mobileNumber,
        leadCode: res.data.data.leadCode,
        // customerName: res.data.data.customerName,
        cif: res.data.data.cif
      };
      let obj = {
        panNumber: data.panNumber,
        dateOfBirth: moment(data.dateOfBirth).format("YYYY-MM-DD"),
				mobileNumber: data.mobileNumber,
      };
      this.setState({
        // loanData: res.data.data,
        // mainapplicantData: obj,
        sendSmsData: sendsms,
        dataSendLink: dataSend
        //displayData: obj
      });
      getWrappedGstPanDetails(obj).then(res => {
        if (res.data && res.data.error == false) {
          console.log("inside here");
          this.setState({
            verifying: false
          });
        }
        const displayData = res.data && res.data.data;
        const exp = res.data && res.data.data.documentUploadGstDetailsDTO;
        this.setState({
          loading: false,
          gstData: exp,
          displayData: displayData,
          verifying: false
        });
        return;
      });
    });
  };

  sendDdeLinkSms = verificationType => {
    let { ddeType, dataSendLink, displayData } = this.state;

    let smsDde = {
			...dataSendLink,
			mainapplicant: this.props.data.mainapplicant,
      cif: this.props.data.cif,
      customerName: this.props.data && this.props.data.customerName,
      emailid: this.props.data.emailid,
      mobileNumber: this.props.data.mobileNumber
    };
    let { match } = this.props;
    let { params } = match;

    if (verificationType === "login") {
      // `http://${window.location.hostname}/smsverification/${params.refrencenumber}`
      sendDdeLinkSms(
        ddeType,
        `${FrontendURL}/smsVerification/${params.refrencenumber}/${this.props.data.mobileNumber}/${this.props.data.panNumber}/${this.props.data.mainapplicant}`,
        smsDde
      ).then(res => {
        if (res.data.smsError == "true") {
					te(res.data.smsMessage);
				} else {
					ts(res.data.smsMessage);
				}
				if (res.data.emailError == "true") {
					te(res.data.emailMessage);
				} else {
					ts(res.data.emailMessage);
				}
        // this.setState({
        //     smsData: res.data,
        // });
        // checkDdeSmsStatus(ddeType, sendSmsData).then(res => {
        //     this.setState({
        //         // smsDateTime: res.data.data.notification.timestamp,
        //         status: res.data.message,
        //     });
        // })
      });
    } else if (verificationType === "otp") {
      // write code to sent otp api
    }
  };

  componentDidUpdate(preProps) {
    const { data, appData } = this.props;
    const { displayData } = this.state;
    if (preProps.data != data) {
      this.setState(
        {
          displayData: {
            panNumber: data.panNumber,
            dateOfBirth: data.dateOfBirth,
            mobileNumber: data.mobileNumber
          }
        },
        () => {
          this.getApplicantbyLoan();
        }
      );
    }
  }

  componentDidMount() {
    this.getApplicantbyLoan();
  }
  // GstOtpVerification = () => {
  //   postGstOtp({ username: this.props.data.customerName,gstin:"" }).then(res => {});
  // };
  // SendOtpUrl=()=>{
  //   postSmsVerification({
  //     "mobileNumber": this.state.dataSendLink.mobileNumber,
  //     "leadCode": this.state.dataSendLink.leadCode,
  //     "customerName":this.state.displayData.registeredName,
  //     "cif": this.state.dataSendLink.cif,
  //     "emailid":this.state.sendSmsData.emailid
  // },`${FrontendURL}${public_url.gst_otp_verification}/${this.state.loanNumber}/${this.state.dataSendLink.leadCode}`).then(res=>{
  //     if(res.error)
  //     return
  //     if(res.data.error)
  //     {
  //       te(res.data.message)
  //     }else
  //     {
  //       ts(res.data.message)
  //     }
  //   })
  //  }
  render() {
    let { params } = this.props.match;
    let {
      GSTOpen,
      error,
      gstData,
      displayData,
      smsDateTime,
      verifying
    } = this.state;
    let { sendData, data } = this.props;
    const columns = [
      {
        Header: "GSTIN",
        accessor: "gstin",
        headerClassName: "tableHeader text-left pl-3 fw-700",
        className: "tableCell d-flex align-items-center text-left pl-3 fw-700"
      },
      {
        Header: "Registered Address",
        accessor: "registeredAddress",
        headerClassName: "tableHeader text-left pl-3 fw-700",
        className: "tableCell d-flex align-items-center text-left pl-3 fw-700"
      },
      {
        Header: "Status",
        accessor: "status",
        headerClassName: "tableHeader text-left pl-3 fw-700",
        className: "tableCell d-flex align-items-center text-left pl-3 fw-700"
      },
  
      {
        accessor: "send",
        headerClassName: "tableHeader text-left pl-3 fw-700",
        className: "tableCell d-flex align-items-center text-left pl-3 fw-700",
        Cell: row => {
          return (
            <div
              onClick={() => {
                this.sendDdeLinkSms("login");
                this.changeTitle();
              }}
            >
              Verify via credentials
            </div>
          );
        }
      },
      // {
      //   accessor: "otp",
      //   headerClassName: "tableHeader text-left pl-3 fw-700",
      //   className: "tableCell d-flex align-items-center text-left pl-3 fw-700",
      //   Cell: row => {
      //     return (
      //       <div
      //       onClick={() => {
      //         //this.props.history.push(`${public_url.gst_otp_verification}/${params.refrencenumber}/${params.leadcode}`)
      //         this.SendOtpUrl()
      //         }}
      //       >
            
      //         Verify via Otp
      //       </div>
      //     );
      //   }
      // }
    ];

    return (
      <React.Fragment>
        <div className="p-3">
          <div className="gAccordion__title" onClick={this.GSTOpen}>
            <label className="mb-0 fw-700 text-primary2 colorGreen">
              {GSTOpen ? "-" : "+"} GST verification
            </label>
          </div>
          {GSTOpen && (
            <React.Fragment>
              {verifying === true ? (
                <h4 className="text-center mt-5">
                  <i className="fa fa-spinner fa-spin mr-2" />
                  Fetching data...
                </h4>
              ) : (
                <div>
                  <div className="col-md-6 col-lg-2 d-flex align-items-center mt-3">
                    <label className="fs-14 mb-0 fw-500">
                      <span className="text-primary"> PAN : </span>
                      {displayData.panNumber}
                    </label>
                  </div>
                  <div className="col-md-6 col-sm-4 col-xs-12">
                    <label className="fs-14 mb-0  fw-500">
                      <span className="text-primary"> PAN Name: </span>
                      {displayData.registeredName}
                    </label>
                  </div>
									<div className="col-md-6 col-sm-4 col-xs-12">
                    <label className="fs-14 mb-0  fw-500">
                      <span className="text-primary"> Firm Name: </span>
                      {data && data.firmName ? data.firmName : " - " }
                    </label>
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <label className="fs-14 mb-0  fw-500">
                      <span className="text-primary"> Mobile Number : </span>
                      {displayData.mobileNumber}
                    </label>
                  </div>
                  {gstData == undefined ? (
                    <>
                      <div className="col-md-4 d-flex align-items-center">
                        <label className="fs-14 mb-0  fw-500">
                          <span className="text-primary text-nowrap">
                            Link:{" "}
                            <a
                              // onClick={() => window.open("/smsverification", "_blank")}
                              onClick={() => {
                                this.sendDdeLinkSms("login");
                              }}
                            >
                             Verify via credentials
                            </a>
                          </span>
                        </label>
                      </div>
                      {/* <div className="col-md-4 d-flex align-items-center">
                        <label className="fs-14 mb-0  fw-500">
                          <span className="text-primary text-nowrap">
                            Link:{" "}
                            <a
                              // onClick={() => window.open("/smsverification", "_blank")}
                              onClick={() => {
                                this.SendOtpUrl()
                             // this.props.history.push(`${public_url.gst_otp_verification}/${params.refrencenumber}/${params.leadcode}`)
                              }}
                            >
                             Verify via OTP
                            </a>
                          </span>
                        </label>
                      </div> */}
                      {/* <div className="col-md-4 d-flex align-items-center">
                        <label className="fs-14 mb-0  fw-500">
                          <span className="text-primary text-nowrap">
                            OTP Based Verification:{" "}
                            <a
                              // onClick={() => window.open("/smsverification", "_blank")}
                              onClick={() => {
                                this.sendDdeLinkSms("otp");
                              }}
                            >
                              Click here for Verification
                            </a>
                          </span>
                        </label>
                      </div> */}
                    </>
                  ) : (
                    ""
                  )}
                  <div className=" w-100 p-4">
                    {gstData == undefined ? (
                      ""
                    ) : (
                      <ReactTable
                        data={gstData}
                        columns={columns}
                        defaultPageSize={10}
                        showPagination={false}
                        minRows={5}
                      />
                    )}
                  </div>
                  {/* <CoApplicant sendData={sendData} /> */}
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(GSTverification);
