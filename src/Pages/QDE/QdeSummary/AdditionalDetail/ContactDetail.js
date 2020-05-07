
// ContactDetails
import React from "react";
import { Select, Input } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import {
  getAllCity,
  postAdditionalDetail
} from "../../../Utility/Services/QDE";
import { te, ts } from "../../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";
const initForm = {
  emailId: "",
  ComobileNumber: "",
  errors: {
    emailId: null,
    ComobileNumber: null,
  }
};
class ContactDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      contactOpen: false,
      form: cloneDeep(initForm),
      saveForm: false,
      communicationDetailLoading: false
    };
  }
  contactOpen = () => {
    let { contactOpen } = this.state;
    this.setState({ contactOpen: !contactOpen });
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

  SaveForm = () => {
    let { saveForm, form } = this.state;
    let { match } = this.props;
    let { params } = match;
    if (!saveForm) {
      let obj = cloneDeep(form);
      delete obj.errors;
      obj.leadCode = params.leadcode;
      this.setState({ communicationDetailLoading: true });
      postAdditionalDetail(obj).then(res => {
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
          this.setState({
            saveForm: !saveForm,
            communicationDetailLoading: false
          });
        }
      });
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
    // Object.keys(form).map(res => {
    //   if (leadDetail[res]) {
    //     form[res] = leadDetail[res];
    //   }
    // });
    this.setState({ form });
  };
  render() {
    let {
      contactOpen,
      form,
      saveForm,
      communicationDetailLoading
    } = this.state;
    let {
      emailId,
      ComobileNumber,
      errors
    } = form;
    let CurrentAddressFormStatus = false;
    if (
      emailId && 
      ComobileNumber
    ) {
      CurrentAddressFormStatus = true;
    }
    return (
      <React.Fragment>
        <div class="row align-items-center mb-4">
          <div class="pr-3" onClick={this.contactOpen}>
            <label class="mb-0 fw-700 text-primary2 colorGreen">
              {contactOpen ? "-" : "+"} Contact Details
            </label>
          </div>
          <div class="flex-grow-1">
            <hr class="bg_lightblue" />
          </div>
        </div>
        {contactOpen && (
          <div class="ml-2 ml-md-4">
            <div class="row">
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500">Email Address</label>
              </div>
              <div class="col-md-8 col-lg-4 mt-2 mt-lg-0">
                  <Input
                    className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                    id="colFormLabelSm"
                    placeholder="Type Email Address"
                    name="emailId"
                    value={emailId}
                    title="Email Address"
                    isReq={true}
                    onChangeFunc={this.onInputChange}
                    error={errors.emailId}
                    validationFunc={this.onInputValidate}
                    reqType="email"
                    maxLength="255"
                />
              </div>
            </div>
            <div class="row mt-3 align-items-center">
              <div class="col-md-4 col-lg-2 d-flex align-items-center">
                <label class="fs-14 mb-0 gTextPrimary fw-500">Mobile No.</label>
              </div>
              <div class="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
                   <Input
                   title="Mobile Number"
                   className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                   placeholder="Type Mobile Number"
                   name="ComobileNumber"
                   value={ComobileNumber}
                   onChangeFunc={this.onInputChange}
                   error={errors.ComobileNumber}
                   validationFunc={this.onInputValidate}
                   maxLength="10"
                   reqType="mobile10"
                   isReq={true}
                 />
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
                  : `${communicationDetailLoading ? "Saving..." : "Save"}`}
              </button>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}
export default withRouter(ContactDetails);
