import React from "react";
import { Input, Select, Checkbox } from "../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../Utility/Helper";
import { te, ts } from "../Utility/ReduxToaster";
import {
  postCreateLeads,
  getProductList,
  postProductList,
  getLeadsByLeadid,
  postDuplicateEmailMobile
} from "../Utility/Services/Leads";
import { Link } from "react-router-dom";
import { public_url } from "../Utility/Constant";
import { CreateConstent } from "../Utility/Services/CreateConstent";
import Pagination from "react-js-pagination";
import { FrontendURL } from "../Utility/Config";
const detailForm = {
  ipaddress: "",
  updatedBy: "",
  productId: "",
  emailId: "",
  mobileNo: "",
  updatedDate: "",
  customerName: "",
  leadCode: "",
  createdDate: "",
  createdBy: "",
  consentType: "",
  id: "",
  salesManagerCode: "",
  consentConfirmed: "",
  status: "",
  // term1: "",
  // term2: "",
  errors: {
    // term1: null,
    // term2: null,
    customerName: false,
    mobileNo: false,
    emailId: false,
    productId: false
  }
};
export default class ConcentConversion extends React.Component {
  constructor() {
    super();
    this.state = {
      form: cloneDeep(detailForm),
      productList: [],
      editMode: false,
      loadingEdit: false,
      sendType: 1
    };
  }
  GetLeadDetail = () => {
    let { match } = this.props;
    let { params } = match;
    getLeadsByLeadid(params.leadcode).then(res => {
      if (res.error) return;
      console.log("Details Form", detailForm.errors);
      this.setState({
        form: {
          ...res.data.data,
          errors: cloneDeep(detailForm.errors)
        }
      });
    });
  };
  componentDidMount() {
    this.GetLeadDetail();
    this.ProductList();
  }
  ProductList = () => {
    postProductList().then(res => {
      if (res.error) {
        return;
      }
      this.setState({ productList: res.data.data });
    });
  };
  handleChange(event) {
    const { name, value } = event.target;
    const { user } = this.state;
    this.setState({
      user: {
        ...user,
        [name]: value
      }
    });
  }
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
  HandleSUbmit = e => {
    e.preventDefault();
    const { form, loading } = this.state;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    if (obj) {
      obj.updatedDate = new Date(obj.updatedDate).getUTCMilliseconds();
      obj.createdDate = new Date(obj.createdDate).getUTCMilliseconds();
      this.setState({ loadingEdit: true });
      let objForm = cloneDeep(obj);
      delete objForm.term1;
      delete objForm.term2;

      this.setState({ loadingEdit: true });
      objForm.prospectstatus = "NO";
      postCreateLeads(objForm).then(res => {
        if (res.error) {
          this.setState({ loadingEdit: false });
          return;
        }
        if (res.data.error == false) {
          ts(res.data.message);
          this.setState({ loadingEdit: false });
          this.editMode();
        } else if (res.data.error == true) {
          this.GetLeadDetail();
          te(res.data.message);
          this.setState({ loadingEdit: false });
        }
      });
    }
  };
  CreateConstent = () => {
    const { form, loading } = this.state;
    let { match } = this.props;
    let { params } = match;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    let {
      ipaddress,
      productId,
      leadCode,
      emailId,
      mobileNo,
      customerName,
      id,
      salesManagerCode,
      status,
      prospectstatus,
      api_token
    } = this.state.form;
    let objForm = {
      ipaddress,
      productId,
      leadCode,
      emailId,
      mobileNo,
      customerName,
      id,
      salesManagerCode,
      status
    };

    this.setState({ loadingConstent: true });
    objForm.prospectstatus = "NO";
    console.log(objForm);
    //return
    CreateConstent(
      objForm,
      this.state.sendType == 1
        ? `${FrontendURL}${public_url.consent_otp_verify_by_url}/${match.params.leadcode}`
        : ""
    ).then(res => {
      if (res.error) {
        this.setState({ loadingConstent: false });
        return;
      }
      if (res.data.error == "false") {
        ts(res.data.message);
        localStorage.setItem("otpData", JSON.stringify(res.data.data));
        if (this.state.sendType == 1) {
          this.props.history.push(
            `${public_url.consent_waiting}/${params.leadcode}`
          );
        } else {
          this.props.history.push(
            `${public_url.otp_verify}/${params.leadcode}`
          );
        }

        this.setState({ loadingConstent: false });
      } else if (res.data.error == "true") {
        te(res.data.message);
        this.setState({ loadingConstent: false });
      }
    });
  };
  editMode = () => {
    let { form, editMode } = this.state;
    let { errors } = form;
    if (editMode) {
      form = {
        ...form,
        // term1: "",
        // term2: "",
        errors: {
          ...errors
          // term1: null, term2: null
        }
      };
    } else {
      delete errors.term1;
      delete errors.term2;
      form = {
        ...form,
        // term1: "", term2: "",
        errors: { ...errors }
      };
    }
    this.setState({ editMode: !editMode, form: form });
  };
  render() {
    let {
      customerName,
      mobileNo,
      emailId,
      productId,
      errors
    } = this.state.form;
    let { productList, editMode, loadingConstent } = this.state;
    let { match } = this.props;
    let { params } = match;

    return (
      <React.Fragment>
        <section class="py-4 position-relative bg_l-secondary ">
          <div className="container  ">
            <div class="d-flex justify-content-start align-items-center">
              <div className="breadcrums">
                <ul>
                  <li className="mr-1" class="active">
                    <Link to={public_url.lead_list}>Leads</Link>
                  </li>
                  <li className="mr-1">
                    <a href="#">Consent Pending</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div class="container pb-5 bg-white">
            <div class="row justify-content-center align-items-start ">
              <div class="col-md-1 pl-0">
                <p class="mb-0 px-2 py-4 bg_d-primary text-white fs-14 text-center">
                  {" "}
                  {params.leadcode}{" "}
                </p>
              </div>
              <div class="col-md-11 consent-conversion">
                <form class="p-3 form_style-1 " onSubmit={this.HandleSUbmit}>
                  <div class="row">
                    <div class="col-md-8">
                      <div class="form-group row">
                        <label
                          for="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Customer Name
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <Input
                            className="form-control form-control-md fs-12"
                            id="colFormLabelSm"
                            placeholder="Type Name"
                            name="customerName"
                            value={customerName}
                            title="Customer Name"
                            isReq={true}
                            onChangeFunc={this.onInputChange}
                            error={errors.customerName}
                            validationFunc={this.onInputValidate}
                            disabled={!editMode}
                            maxLength="100"
                            reqType="onlyAlphbate"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          for="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Mobile
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <Input
                            className="form-control form-control-md fs-12"
                            id="colFormLabelSm"
                            placeholder="Type Mobile Number"
                            name="mobileNo"
                            value={mobileNo}
                            title="Mobile Number"
                            isReq={true}
                            onChangeFunc={(name, value, error) => {
                              let regex = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
                              if (value.match(regex) == null)
                                this.onInputChange(name, value, error);
                            }}
                            error={errors.mobileNo}
                            validationFunc={this.onInputValidate}
                            disabled={!editMode}
                            reqType="mobile10"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          for="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Email Address
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <Input
                            className="form-control form-control-md fs-12"
                            id="colFormLabelSm"
                            placeholder="Type Email Address"
                            name="emailId"
                            value={emailId}
                            title="Email Address"
                            isReq={true}
                            onChangeFunc={this.onInputChange}
                            error={errors.emailId}
                            validationFunc={this.onInputValidate}
                            disabled={!editMode}
                            reqType="email"
                            maxLength="255"
                          />
                        </div>
                      </div>
                      <div class="form-group row">
                        <label
                          for="colFormLabelSm"
                          class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                        >
                          Product
                        </label>
                        <div class="col-sm-12 col-lg-8 col-xl-9">
                          <div class="select create-lead-form-select">
                            <Select
                              className="w-100 fs-12"
                              options={productList}
                              value={productId}
                              title="Select Product"
                              name="productId"
                              onChangeFunc={this.onInputChange}
                              error={errors.productId}
                              isReq={true}
                              isMulti={true}
                              labelKey="productcategory"
                              valueKey="productId"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {editMode ? (
                      <div class="col-md-4 ">
                        <div class="d-flex justify-content-end mt-4 w-100">
                          <button
                            href="#"
                            class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green "
                          >
                            Save
                          </button>
                        </div>
                        <div class="d-flex justify-content-end mt-4 w-100">
                          <button
                            href="#"
                            class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green "
                            onClick={() => {
                              this.editMode();
                              this.GetLeadDetail();
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div class="col-md-4 ">
                        <div class="d-flex justify-content-end mt-4 w-100">
                          <input
                            type="button"
                            class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-light-blue"
                            value="Edit"
                            onClick={this.editMode}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
            <div className={`${editMode ? "disable-consent-conversion" : ""}`}>
              {/*<div class="row justify-content-center py-3 ">
                 <div class="">
                  <div className="mb-4">
                    <div className="d-flex col-md-8 ml-5 pl-5 ">
                      <label class="main text-primary ">
                        <input
                          type="checkbox"
                          onChange={e => {
                            this.onInputChange(
                              e.target.name,
                              e.target.checked ? "term1" : "",
                              !e.target.checked
                            );
                          }}
                          name="term1"
                          value={this.state.form.term1}
                          checked={this.state.form.term1}
                        />
                        <span class="geekmark"></span>
                      </label>
                      <p className="mb-0 text-primary">
                        {" "}
                        I, {customerName}, agree to the{" "}
                        <span className="text-green">Terms & Conditions</span>{" "}
                        attached herewith.
                      </p>
                    </div>
                    {errors.term1 && (
                      <span className="reqEstric  ml-5 pl-5 checkbox-error consent-conversion-checbox-error">
                        Please select this
                      </span>
                    )}
                  </div>

                  <div className="d-flex col-md-8 ml-5 pl-5">
                    <label class="main text-primary ">
                      <input
                        type="checkbox"
                        onChange={e => {
                          console.log(e.target.checked);
                          this.onInputChange(
                            e.target.name,
                            e.target.checked ? "term2" : "",
                            !e.target.checked
                          );
                        }}
                        checked={this.state.form.term2}
                        name="term2"
                        value={this.state.form.term2}
                      />
                      <span class="geekmark"></span>
                      <br />
                    </label>
                    <p className="mb-0 text-primary">
                      I, {customerName}, agree to consent Growth Source for
                      collecting my Aadhaar/ Driving licence and
                      <span> storing and using the same for KYC purpose.</span>
                    </p>
                    <br />
                  </div>
                  {errors.term2 && (
                    <span className="reqEstric  ml-5 pl-5 checkbox-error consent-conversion-checbox-error">
                      Please select this
                    </span>
                  )}
                </div> 
              </div>
              */}
              <div class="row justify-content-center pb-5">
                <div class="c_radiobtn w-50 d-flex ">
                  <div className="mr-4">
                    <input
                      type="radio"
                      id="test2"
                      name="radio-group"
                      onClick={() => {
                        this.setState({ sendType: 1 });
                      }}
                      checked={this.state.sendType == 1 && true}
                    />
                    <label for="test2">Send link to customer</label>
                  </div>
                  <div className="">
                    <input
                      type="radio"
                      id="test3"
                      name="radio-group"
                      onClick={() => {
                        this.setState({ sendType: 2 });
                      }}
                      checked={this.state.sendType == 2 && true}
                    />
                    <label for="test3">OTP</label>
                  </div>
                </div>
              </div>
              <div class="row justify-content-center w-100">
                <Link to={public_url.lead_list}>
                  <button class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16  mr-3">
                    Cancel
                  </button>
                </Link>
                <button
                  onClick={this.CreateConstent}
                  class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16"
                  disabled={editMode}
                >
                  {loadingConstent ? "Loading..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
