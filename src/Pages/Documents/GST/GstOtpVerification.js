import React from "react";
import { Input } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import {
  getApplicantbyLoan,
  smsVerifications,
  postRequestGstOtp,
  postValidateOtp,
  postSmsVerification
} from "../../../Utility/Services/Documents";
import OtpInput from "react-otp-input";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { te, ts } from "../../../Utility/ReduxToaster";
import { getFormDetails } from "../../../Utility/Helper";
import { public_url } from "../../../Utility/Constant";

const inItForm = {
 gstnumber:"",
 username:"",
 errors:{gstnumber:null,username:null}
};

class GstOtpVerification extends React.Component {
  constructor() {
    super();
    this.state = {
    form:cloneDeep(inItForm),
    loading:false,
    otpShow:false,
    otp:"",
    requestId:""
    };
  }
ValidateOtp=()=>{
  postValidateOtp({
    "requestId":this.state.requestId,
    "otp":this.state.otp
  })
}
 
RequestOtp=()=>{
  this.setState({loading:true})
  postRequestGstOtp({
    "username":this.state.form.username,
    "gstin":this.state.form.gstnumber
  }).then(res=>{
     if(res.error)
     {return}
     if( res.data.returnCode==200)
     {
      this.setState({otpShow:true,requestId:res.data.requestId})
     }else
     {
      this.setState({otpShow:false})
     }
     this.setState({loading:false})

  })
}
  

  onInputChange = (name, value, error = undefined) => {
    console.log(error);
    const { form } = this.state;
    form[name] = value;
    if (error !== undefined) {
      let { errors } = form;
      errors[name] = error;
    }
    this.setState({ form });
  };

  // handle validation
  onInputValidate = (name, error) => {
    let { errors } = this.state.form;
    errors[name] = error;
    this.setState({
      form: { ...this.state.form, errors: errors }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, loanNumber, dataInSendSms } = this.state;
    let { syncLogin } = this.props;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    if (obj) {
      this.RequestOtp()
    }
  };

  render() {
    let { form,loading,otpShow} = this.state;
    let { gstnumber,username,errors } = form;
    return (
      <React.Fragment>
        <div className="gAccordion">
          <div className="gAccordion__body justify-content-center">
            <div className="row align-items-center mb-4">
              <div className="flex-grow-1">
                <>
                  <hr className="bg_lightblue" />
                  <div className=" text-primary fw-700 fs-18">
                    Reference ID &nbsp;&nbsp; ( {this.props.match.params.loannumber} )
                  </div>
                  <div className=" text-primary fw-700 fs-18">
                    GST Verification
                  </div>
                </>
              </div>
            </div>
            {
              <div className="ml-2 ml-md-4">
                   <div className="row mt-3 align-items-center ml-5">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center ml-5">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                      Gst number
                    </label>
                  </div>
                  <div className="col-12 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
                    <Input
                      title="Gst Number"
                      className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                      placeholder="Type gst number"
                      name="gstnumber"
                      value={gstnumber}
                      onChangeFunc={this.onInputChange}
                      error={errors.gstnumber}
                      validationFunc={this.onInputValidate}
                      isReq={true}
                    />
                   
                  </div>
                </div>
                <div className="row mt-3 align-items-center ml-5">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center ml-5">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                   User Name
                    </label>
                  </div>
                  <div className="col-12 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
                    <Input
                      title="User Name"
                      className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                      placeholder="Type User name"
                      name="username"
                      value={username}
                      onChangeFunc={this.onInputChange}
                      error={errors.username}
                      validationFunc={this.onInputValidate}
                      isReq={true}
                    />
                   
                  </div>
                </div>
                {otpShow&&<div className="row mt-3 align-items-center ml-5">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center ml-5">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                      OTP
                    </label>
                  </div>
                  <div className="col-12 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
                   
                    <OtpInput
                      onChange={otp => {
                      
                       this.setState({otp:otp})
                      }}
                      numInputs={6}
                      separator={<span>-</span>}
                      value={this.state.otp}
                      //isInputNum={true}
                    />
                  </div>
                </div>}

                <div className="row mr-5">
                  <div className="col-md-4 col-lg-2"></div>
                  <div className="col-12 col-md-5">
                  <button
                      type="submit"
                      className="btn-green btn px-5 py-2 text-primary rounded-pill fs-12 mt-3 mr-3"
                      disabled={loading}
                      onClick={this.handleSubmit}
                    >
                      {loading ? "Please wait..." : "Get Otp"}
                    </button>
                  {otpShow&&  <button
                      type="submit"
                      className="btn-green btn px-5 py-2 text-primary rounded-pill fs-12 mt-3"
                      disabled={!this.state.otp||loading}
                      onClick={this.ValidateOtp}
                    >
                      {loading ? "Please wait..." : "Validate Otp"}
                    </button>}
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(GstOtpVerification);
