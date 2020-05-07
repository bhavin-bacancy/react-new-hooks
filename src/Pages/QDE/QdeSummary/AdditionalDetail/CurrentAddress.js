import React from "react";
import { Select, Input } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import {
  getAllCity,
  postAdditionalDetail
} from "../../../Utility/Services/QDE";
import { withRouter } from "react-router-dom";
import { any } from "prop-types";
import { te, ts } from "../../../Utility/ReduxToaster";
import { getFormDetails } from "../../../Utility/Helper";
const initForm = {
  addressline1: "",
  addressline2: "",
  state: "",
  city: "",
  pincode: "",
  addressFlag: true,
  leadCode: "LAP-0057",
  errors: {
    addressline1: null,
    addressline2: null,
    state: null,
    city: null,
    pincode: null
  }
};
class CurrentAddress extends React.Component {
  constructor() {
    super();
    this.state = {
      currentAddressOpen: false,
      cityList: [],
      form: cloneDeep(initForm),
      saveForm: false,
      currentDetailLoading: false
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
  SaveForm = () => {
    let { saveForm, form } = this.state;
    let { match } = this.props;
    let { params } = match;
    if (!saveForm) {
      let obj = cloneDeep(form);
      delete obj.errors;
      obj.leadCode = params.leadcode;
      this.setState({ currentDetailLoading: true });
      postAdditionalDetail(obj).then(res => {
        if (res.error) {
          this.setState({ saveForm: saveForm, currentDetailLoading: false });
          return;
        }
        if (res.data.error) {
          te(res.data.message);
          this.setState({ saveForm: saveForm, currentDetailLoading: false });
        } else {
          ts(res.data.message);
          this.setState({ saveForm: !saveForm, currentDetailLoading: false });
        }
      });
    } else {
      this.setState({ saveForm: !saveForm });
    }
  };
  render() {
    let {
      currentAddressOpen,
      form,
      cityList,
      saveForm,
      currentDetailLoading
    } = this.state;
    let { stateList } = this.props;
    let { addressline1, addressline2, pincode, city, state, errors } = form;
    let CheckForm = Object.keys(form).filter(res => {
      if (res != "errors" && !form[res]) return res;
    });
    let CurrentAddressFormStatus = false;
    if (
      !errors.addressline1 &&
      !errors.addressline2 &&
      !errors.pincode &&
      !errors.city &&
      !errors.state &&
      CheckForm.length == 0
    ) {
      CurrentAddressFormStatus = true;
    }
    return (
      <React.Fragment>
        <div class="row align-items-center mb-4">
        <div className="addressdetaillblock">
          <div class="pr-3" onClick={this.currentAddressOpen}>
            <label class="mb-0 fw-700 text-primary2 colorGreen">
              {currentAddressOpen ? "-" : "+"} Current Address
            </label>
          </div>
          <div class="flex-grow-1">
            <hr class="bg_lightblue" />
          </div>
        </div>
        </div>
        {currentAddressOpen && (
          <div class="ml-2 ml-md-4">
            <div class="row">
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500">Address</label>
              </div>
              <div class="col-md-8 col-lg-4 mt-2 mt-lg-0">
                {!saveForm ? (
                  <Input
                    title="Address Line 1"
                    className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 mb-3"
                    placeholder="Apartment no./ wing/ Building name"
                    name="addressline1"
                    value={addressline1}
                    onChangeFunc={this.onInputChange}
                    error={errors.addressline1}
                    validationFunc={this.onInputValidate}
                    isReq={true}
                    reqType="alphaNumeric"
                  />
                ) : (
                  addressline1
                )}
                {!saveForm ? (
                  <Input
                    title="Address Line 2"
                    className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                    placeholder="Address line1"
                    name="addressline2"
                    value={addressline2}
                    onChangeFunc={this.onInputChange}
                    error={errors.addressline2}
                    validationFunc={this.onInputValidate}
                    isReq={true}
                    reqType="alphaNumeric"
                  />
                ) : (
                  addressline2
                )}
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
                    name="pincode"
                    value={pincode}
                    onChangeFunc={(name, value, errors) => {
                      this.onInputChange(name, value, errors);
                    }}
                    error={errors.pincode}
                    validationFunc={this.onInputValidate}
                    maxLength="7"
                    minLength="7"
                    reqType="number"
                    isReq={true}
                  />
                ) : (
                  pincode
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
                    <Select
                      className="w-100 fs-12 create-lead-form-select"
                      options={cityList}
                      value={city}
                      title="City"
                      name="city"
                      onChangeFunc={(name, value, error) => {
                        this.onInputChange(name, value, error);
                      }}
                      isReq={true}
                      labelKey="cityName"
                      valueKey="cityId"
                      error={errors.city}
                    />
                  ) : (
                    city
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-4 col-lg-2 d-flex align-items-center">
                <label className="fs-14 mb-0 gTextPrimary fw-500">State</label>
              </div>
              <div className="col-md-8 col-lg-3 col-xl-2 mt-2 mt-lg-0">
                <div class="select">
                  {!saveForm ? (
                    <Select
                      className="w-100 fs-12 create-lead-form-select"
                      options={stateList}
                      value={state}
                      title="State"
                      name="state"
                      onChangeFunc={(name, value, error) => {
                        this.onInputChange(name, value, error);
                        this.getCity(value);
                      }}
                      isReq={true}
                      labelKey="stateName"
                      valueKey="stateId"
                      error={errors.state}
                    />
                  ) : (
                    stateList.map(res => {
                      if (res.stateId == state) return res.stateName;
                    })
                  )}
                </div>
              </div>
            </div>
            <div class="row justify-content-end mt-3 pr-0 mt-lg-0">
              {!saveForm && CurrentAddressFormStatus && (
                <button
                  disabled=""
                  class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3"
                >
                  Cancel
                </button>
              )}

              <button
                disabled={!CurrentAddressFormStatus}
                class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${!saveForm &&
                  CurrentAddressFormStatus &&
                  "btn-green"}`}
                onClick={this.SaveForm}
              >
                {saveForm
                  ? "Edit"
                  : `${currentDetailLoading ? "Saving" : "Save"}`}
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(CurrentAddress);
