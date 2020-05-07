import React from "react";
import { Select, Input, TextArea } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../../Utility/Helper";
import {
  getAllCity,
  postAdditionalDetail,
  postAddCommunicationAddress,
  getCityAndStateByPincode
} from "../../../Utility/Services/QDE";
import { te, ts } from "../../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";
import { postAddCoCommunicationDetail } from "../../../Utility/Services/CoApplicant";
const initForm = {
  commAddressline1: "",
  commAddressline2: "",
  commState: "",
  commCity: "",
  commPincode: "",
  errors: {
    commAddressline1: null,
    commAddressline2: null,
    commState: null,
    commCity: null,
    commPincode: null
  }
};
class CommunicationAddress extends React.Component {
  constructor() {
    super();
    this.state = {
      currentAddressOpen: false,
      cityList: [],
      form: cloneDeep(initForm),
      saveForm: false,
      communicationDetailLoading: false,
      pincodeLoading: false,
      pincodeDetail: "",
      sameAsCurrentAddress: false
    };
  }
  currentAddressOpen = () => {
    let { currentAddressOpen } = this.state;
    this.setState({ currentAddressOpen: !currentAddressOpen });
  };
  onInputChange = (name, value, error = undefined) => {
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
  getCity = stateId => {
    let stateName = "";
    let { stateList } = this.props;
    stateList.filter(res => {
      if (res.stateId == stateId) {
        stateName = res.stateName;
      }
    });
    getAllCity(stateName).then(res => {
      if (res.error) return;
      this.setState({ cityList: res.data.data });
    });
  };
  SaveCoForm = () => {
    let { saveForm, form, pincodeDetail } = this.state;
    let { match } = this.props;
    let { params } = match;
    if (!saveForm) {
      let obj = cloneDeep(form);
      delete obj.errors;
      obj.leadCode = params.leadcode;
      obj.mobileNumber = params.mobileno;
      obj.commaddflag = true;
      obj.commCity = pincodeDetail.city_cd;
      obj.commState = pincodeDetail.state_cd;
      obj.custcode = params.custcode;
      obj.defaultbranch = localStorage.getItem("employeeId");
      this.setState({ communicationDetailLoading: true });
      postAddCoCommunicationDetail(obj).then(res => {
        if (res.error) {
          this.setState({
            saveForm: saveForm,
            communicationDetailLoading: false
          });
          return;
        }
        if (res.data.error) {
          te(res.data.message);
          this.setState({
            saveForm: saveForm,
            communicationDetailLoading: false
          });
        } else {
          ts(res.data.message);
          this.setState(
            {
              saveForm: !saveForm,
              communicationDetailLoading: false
            },
            () => {
              this.props.GetLeadDetail();
            }
          );
        }
      });
    } else {
      this.setState({ saveForm: !saveForm });
    }
  };
  SaveForm = () => {
    let { saveForm, form, pincodeDetail } = this.state;
    let { match, leadDetail } = this.props;
    let { params } = match;
    if (!saveForm) {
      let obj = cloneDeep(form);
      delete obj.errors;
      obj.leadCode = params.leadcode;
      obj.mobileNumber = params.mobileno;
      obj.commaddflag = true;
      obj.commCity = pincodeDetail.city_cd;
			obj.commState = pincodeDetail.state_cd;
			obj.mainapplicant=  true;
			obj.custcode= ""
      obj.defaultbranch = localStorage.getItem("employeeId");
      this.setState({ communicationDetailLoading: true });
      postAddCommunicationAddress(obj).then(res => {
        if (res.error) {
          this.setState({
            saveForm: saveForm,
            communicationDetailLoading: false
          });
          return;
        }
        if (res.data.error) {
          te(res.data.message);
          this.setState({
            saveForm: saveForm,
            communicationDetailLoading: false
          });
        } else {
          ts(res.data.message);
          this.setState(
            {
              saveForm: !saveForm,
              communicationDetailLoading: false
            },
            () => {
              //this.props.GetLeadDetail()
            }
          );
        }
      });
    } else {
      this.setState({ saveForm: !saveForm });
    }
  };
  componentDidUpdate(preProps) {
    if (preProps.leadDetail != this.props.leadDetail) {
      this.FormUpdate();
    }
  }
  componentDidMount() {
    this.FormUpdate();
  }
  FormUpdate = (formStatus = false) => {
    let { leadDetail } = this.props;
    let { form } = this.state;
    Object.keys(form).map(res => {
      if (leadDetail[res]) {
        form[res] = leadDetail[res];
      }
    });
    if (leadDetail.commPincode) {
      this.GetCityStateByPincode(leadDetail.commPincode);
    }
    if (formStatus) {
      leadDetail.commaddflag = false;
    }
    this.setState({ form, saveForm: leadDetail.commaddflag ? true : false });
  };
  GetCityStateByPincode = pincode => {
    let { form } = this.state;
    this.setState({ pincodeLoading: true });
    getCityAndStateByPincode(pincode).then(res => {
      if (res.error) {
        this.setState({ pincodeLoading: false });
        return;
      }
      if (res.data.error == false) {
        this.getCity(res.data.data.state_cd);
        this.setState({
          pincodeLoading: false,
          form: {
            ...form,
            commCity: res.data.data[0].city_nm,
            commState: res.data.data[0].state_nm
          },
          pincodeDetail: res.data.data[0]
        });
      } else {
        if (form.commPincode.length == 6) {
          form = {
            ...form,
            commCity: "",
            commState: "",
            errors: {
              ...form.errors,
              commPincode: "Please enter valid pincode"
            }
          };
        } else {
          form = {
            ...form,
            commCity: "",
            commState: "",
            errors: { ...form.errors }
          };
        }
        this.setState({
          pincodeLoading: false,
          form: form
        });
      }
    });
  };
  SameAsCurrentAddress = () => {
    let { sameAsCurrentAddress, form } = this.state;
    // let obj = getFormDetails(sameAsCurrentAddress, this.onInputValidate);
    this.setState({ sameAsCurrentAddress: !sameAsCurrentAddress }, () => {
      if (this.state.sameAsCurrentAddress) {
        this.CurrentAddressCopyIntoCommunication();
      } else {
        this.FormUpdate(true);
      }
    });
  };
  CurrentAddressCopyIntoCommunication = () => {
    let { leadDetail } = this.props;
    let { form } = this.state;
    let {
      addressline1,
      addressline2,
      state,
      city,
      pincode,
      addressFlag,
      leadCode
    } = leadDetail;

    this.setState(
      {
        form: {
          ...form,
          commAddressline1: addressline1,
          commAddressline2: addressline2,
          commPincode: pincode,
          leadCode: leadCode,
          errors:initForm.errors
        }
      },
      () => {
        this.GetCityStateByPincode(pincode);
      }
    );
  };
  render() {
    let {
      currentAddressOpen,
      form,
      cityList,
      saveForm,
      communicationDetailLoading,
      pincodeLoading,
      sameAsCurrentAddress
    } = this.state;
    let { stateList, leadDetail } = this.props;
    let {
      commAddressline1,
      commAddressline2,
      commPincode,
      commCity,
      commState,
      errors
    } = form;
    let CurrentAddressFormStatus = false;
    if (commAddressline1 && commPincode && commCity && commState) {
      CurrentAddressFormStatus = true;
    }
    return (
      <React.Fragment>
        <div class="row align-items-center mb-4">
        <div className="addressdetaillblock">
          <div class="pr-3" onClick={this.currentAddressOpen}>
            <label class="mb-0 fw-700 text-primary2 colorGreen">
              {currentAddressOpen ? "-" : "+"} Communication Address
            </label>
          </div>
          <div class="flex-grow-1">
            <hr class="bg_lightblue" />
          </div>
          </div>
        </div>
        {currentAddressOpen && (
          <div class="row">
          <div class="col-sm-12">
            <div className="ml-4">
            <div class="row">
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500">Address</label>
              </div>
              <div class="col-md-8 col-lg-8 mt-2 mt-lg-0">
                {!saveForm ? (
                  <>
                    {/* <Input
                      title="Address Line 1"
                      className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 mb-3"
                      placeholder="Apartment no./ wing/ Building name"
                      name="commAddressline1"
                      value={commAddressline1}
                      onChangeFunc={this.onInputChange}
                      error={errors.commAddressline1}
                      validationFunc={this.onInputValidate}
                      isReq={true}
                      reqType="address"
                      maxLength="100"
                    /> */}

                    <div className="d-flex align-items-start">
                      <TextArea
                        title="Address Line 1"
                        className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-4 mb-3"
                        placeholder="Apartment no./ wing/ Building name"
                        name="commAddressline1"
                        value={commAddressline1}
                        onChangeFunc={this.onInputChange}
                        error={errors.commAddressline1}
                        validationFunc={this.onInputValidate}
                        isReq={true}
                        reqType="address"
                        maxLength="100"
                        disabled={sameAsCurrentAddress}
                      />
                      {/* <label className="main styleGreen text-primary pl-4 ml-2 mt-2 w-100"> */}
                        <label className="main styleGreen text-primary pl-4 ml-2 mt-2 w-50 h-100">
                        <input
                          type="checkbox"
                          name="customer"
                          value="customer"
                          onChange={this.SameAsCurrentAddress}
                          checked={this.state.sameAsCurrentAddress}
                        />
                        <span className="geekmark"></span>
                        <span className="checkboxText">
                          Same as current address
                        </span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>{commAddressline1}, </>
                )}
              </div>
            </div>
            <div className="row">
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500"></label>
              </div>
              <div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
                <div className="d-flex">
                  {!saveForm ? (
                    <TextArea
                      title="Address Line 2"
                      className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                      placeholder="Address line 2"
                      name="commAddressline2"
                      value={commAddressline2}
                      onChangeFunc={this.onInputChange}
                      // error={errors.commAddressline2}
                      validationFunc={this.onInputValidate}
                      // isReq={true}
                      reqType="address"
                      maxLength="100"
                      disabled={sameAsCurrentAddress}
                    />
                  ) : (
                    commAddressline2
                  )}
                </div>
              </div>
            </div>
            <div class="row mt-3 align-items-center">
              <div class="col-md-4 col-lg-2 d-flex align-items-center">
                <label class="fs-14 mb-0 gTextPrimary fw-500">Pincode</label>
              </div>
              <div class="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
                {!saveForm ? (
                  <Input
                    title="Pincode"
                    className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                    placeholder="Type pincode"
                    name="commPincode"
                    value={commPincode}
                    onChangeFunc={this.onInputChange}
                    loading={pincodeLoading}
                    error={errors.commPincode}
                    validationFunc={(name, error) => {
                      this.onInputValidate(name, error);
                      this.GetCityStateByPincode(commPincode);
                    }}
                    maxLength="6"
                    minLength="6"
                    reqType="number"
                    isReq={true}
                    disabled={sameAsCurrentAddress}
                  />
                ) : (
                  commPincode
                )}
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-4 col-lg-2 d-flex align-items-center">
                <label class="fs-14 mb-0 gTextPrimary fw-500">City</label>
              </div>
              <div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
                <div class="select">
                  {!saveForm ? (
                    <Input
                      title="City"
                      className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                      value={commCity}
                      disabled={true}
                    />
                  ) : (
                    // cityList.map(res => {
                    //   if (res.cityId == commCity) return res.cityName;
                    // })
                    commCity
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4 col-lg-2 d-flex align-items-center">
                <label className="fs-14 mb-0 gTextPrimary fw-500">State</label>
              </div>
              <div className="col-md-8 col-lg-3  mt-2 mt-lg-0">
                <div class="select">
                  {!saveForm ? (
                    <Input
                      title="State"
                      className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                      value={commState}
                      disabled={true}
                    />
                  ) : (
                    commState
                  )}
                </div>
              </div>
            </div>
            </div>
            <div class="row justify-content-end mt-3 pr-0 mt-lg-0">
            <div className="col-sm-12 text-right">
              {!saveForm && leadDetail.commaddflag && (
                <button
                  disabled=""
                  class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                  onClick={this.props.GetLeadDetail}
                >
                  Cancel
                </button>
              )}
              <button
                disabled={
                  !CurrentAddressFormStatus || communicationDetailLoading
                }
                class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${CurrentAddressFormStatus &&
                  "btn-green"}`}
                onClick={e => {
                  if (this.props.selectedEntity == 1) {
                    this.SaveCoForm(e);
                  } else {
                    this.SaveForm(e);
                  }
                }}
              >
                {saveForm
                  ? "Edit"
                  : `${communicationDetailLoading ? "Saving..." : "Save"}`}
              </button>
            </div>
          </div>
          </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(CommunicationAddress);
