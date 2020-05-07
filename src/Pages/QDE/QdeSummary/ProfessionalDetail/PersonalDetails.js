import React from "react";
import { Select, Input } from "../../../../Component/Input";
import { cloneDeep } from "lodash";
import {
  getAllCity,
  postAdditionalDetail
} from "../../../../Utility/Services/QDE";
import { withRouter } from "react-router-dom";
import { any } from "prop-types";
import { te, ts } from "../../../../Utility/ReduxToaster";
import { getFormDetails } from "../../../../Utility/Helper";
const initForm = {
  maritalstatus: "",
  mothersname: "",
  addressFlag: true,
  leadCode: "LAP-0057",
  errors: {
    mothersname: null,
    maritalstatus: null
  }
};

const maritalStatus = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" }
];
class PersonalDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      currentAddressOpen: true,
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
      // postAdditionalDetail(obj).then(res => {
      //   if (res.error) {
      //     this.setState({ saveForm: saveForm, currentDetailLoading: false });
      //     return;
      //   }
      //   if (res.data.error) {
      //     te(res.data.message);
      //     this.setState({ saveForm: saveForm, currentDetailLoading: false });
      //   } else {
      //     ts(res.data.message);
      //     this.setState({ saveForm: !saveForm, currentDetailLoading: false });
      //   }
      // }
      // );
    } else {
      this.setState({ saveForm: !saveForm });
    }
  };
  componentDidMount() {
    this.FormUpdate();
  }
  FormUpdate = () => {
    let { leadDetail } = this.props;
    let { form } = this.state;
    Object.keys(form).map(res => {
      if (leadDetail[res]) {
        form[res] = leadDetail[res];
      }
    });
    this.setState({ form });
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
    let { maritalstatus, mothersname, errors } = form;
    console.log("form of personal ", form);

    let CheckForm = Object.keys(form).filter(res => {
      if (res != "errors" && !form[res]) return res;
    });
    let formStatus = getFormDetails(form, () => {});
    let CurrentAddressFormStatus = false;
    if (!errors.maritalstatus && !errors.mothersname && CheckForm.length == 0) {
      CurrentAddressFormStatus = true;
    }
    return (
      <React.Fragment>
        <div className="gAccordion">
          <div className="gAccordion__title" onClick={this.currentAddressOpen}>
            <i class="icon">{currentAddressOpen ? "-" : "+"}</i> Personal
            Details
          </div>
          {/* <div class="row align-items-center mb-4">
          <div className="addressdetaillblock">
            <div class="pr-3" onClick={this.currentAddressOpen}>
              <label class="mb-0 fw-700 text-primary2 colorGreen">
                {currentAddressOpen ? "-" : "+"} Personal details
              </label>
            </div>
            <div class="flex-grow-1">
              <hr class="bg_lightblue" />
            </div>
          </div>
        </div> */}
          {currentAddressOpen && (
            <div class="row">
              <div class="col-sm-12">
                <div className="ml-4">
                  <div class="row mt-3 align-items-center">
                    <div class="col-md-4 col-lg-2 d-flex align-items-center">
                      <label class="fs-14 mb-0 gTextPrimary fw-500">
                        Marital Status
                      </label>
                    </div>
                    <div class="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
                      {/* {!saveForm ? (
                      <Select
                        className="w-100 fs-12 create-lead-form-select"
                        options={maritalStatus}
                        value={status}
                        title="Status"
                        name="status"
                        onChangeFunc={(name, value, error) => {
                          this.onInputChange(name, value, error);
                        }}
                        isReq={true}
                        // labelKey="cityName"
                        // valueKey="cityId"
                        error={errors.status}
                      />
                    ) : (
                      status
                    )} */}
                      {maritalstatus ? maritalstatus : "N/A"}
                    </div>
                  </div>
                  <div class="row mt-3">
                    <div class="col-md-4 col-lg-2 d-flex align-items-center">
                      <label class="fs-14 mb-0 gTextPrimary fw-500">
                        Father's Name
                      </label>
                    </div>
                    <div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
                      <div class="select">
                        {/* {!saveForm ? (
                        <Input
                          title="Father's Name"
                          className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                          placeholder="Type Father's Name"
                          name="mothersname"
                          value={mothersname}
                          onChangeFunc={this.onInputChange}
                          error={errors.mothersname}
                          validationFunc={this.onInputValidate}
                          isReq={true}
                        />
                      ) : (
                        mothersname
                      )} */}
                        {mothersname ? mothersname : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div class="row justify-content-end mt-3 pr-0 mt-lg-0">
                <div className="col-sm-12 text-right">
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
              </div> */}
              </div>
            </div>
          )}
          <hr class="bg_lightblue border-0 h-1px" />
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(PersonalDetails);
