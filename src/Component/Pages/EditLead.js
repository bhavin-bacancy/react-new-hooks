import React from "react";
import { Input, Select, Checkbox } from "../Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import { te, ts } from "../../Utility/ReduxToaster";
import {
  postCreateLeads,
  getProductList,
  postProductList,
  getLeadsByLeadid,
  postDuplicateEmailMobile
} from "../../Utility/Services/Leads";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { CreateConstent } from "../../Utility/Services/CreateConstent";
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
  term1: "",
  term2: "",
  errors: {
    customerName: null,
    mobileNo: null,
    emailId: null,
    productId: null
  }
};
export default class EditLead extends React.Component {
  constructor() {
    super();
    this.state = {
      form: cloneDeep(detailForm),
      productList: [],
      editMode: true
    };
  }
  GetLeadDetail = () => {
    let { editLeadId } = this.props;
    getLeadsByLeadid(editLeadId).then(res => {
      if (res.error) return;
      this.setState({
        form: {
          ...res.data.data,
          errors: this.state.form.errors
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
      postCreateLeads(objForm).then(res => {
        if (res.error) {
          this.setState({ loading: false });
          return;
        }
        if (res.data.error == false) {
          ts(res.data.message);
          this.setState({ loadingEdit: false });
          this.props.EditLead("");
          this.props.LeadList();
        } else if (res.data.error == true) {
          te(res.data.message);
          this.GetLeadDetail();
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
      status
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
    CreateConstent(objForm).then(res => {
      if (res.error) {
        this.setState({ loadingConstent: false });
        return;
      }
      if (res.data.error == "false") {
        ts(res.data.message);
        localStorage.setItem("otpData", JSON.stringify(res.data.data));
        this.props.history.push(
          `${public_url.concent_request_sent}/${params.leadcode}`
        );
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
        term1: "",
        term2: "",
        errors: { ...errors, term1: null, term2: null }
      };
    } else {
      delete errors.term1;
      delete errors.term2;
      form = { ...form, term1: "", term2: "", errors: { ...errors } };
    }
    this.setState({ editMode: !editMode, form: form });
  };
  render() {
    let {
      customerName,
      mobileNo,
      emailId,
      productId,
      errors,
      updatedDate
    } = this.state.form;
    let { productList, editMode } = this.state;
    let { editLeadId } = this.props;

    return (
      <React.Fragment>
        <div class="row justify-content-center align-items-start bg-white mb-2 isEditable consent-conversion">
          <div class="col-md-2 pl-0 bg_d-primary">
            <p class="mb-0 px-2 py-4 bg_d-primary text-white fs-14 text-center">
              {" "}
              {editLeadId}{" "}
            </p>
          </div>
          <div class="col-md-10">
            <form class="form_style-1" onSubmit={this.HandleSUbmit}>
              <div class="row">
                <div class="col-md-8 p-3 pt-lg-4">
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
                  {/* <div class="form-group row">
                    <label
                      for="colFormLabelSm"
                      class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center"
                    >
                      Product
                    </label>
                    <div class="col-sm-12 col-lg-8 col-xl-9">
                      <div class="select create-lead-form-select">
                        <Select
                          className="w-100 fs-12 create-lead-form-select"
                          options={productList}
                          value={productId}
                          title="Product"
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
                  </div> */}
                </div>
                {editMode ? (
                  <div class="col-md-4 pr-0">
                    <div className="d-flex align-items-start h-100 justify-content-end">
                      <div class="d-flex flex-column py-3 mr-3">
                        <span class="fs-12 text-right">{updatedDate}</span>
                        {/* <span class="fs-12 text-right">12:10</span> */}
                      </div>
                      <div class="d-flex flex-column justify-content-end mt-0 h-100">
                        <button
                          href="#"
                          class="text-center w-100px btn-green btn text-primary h-50 fs-12 mb-2"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          href="#"
                          class="text-center w-100px bg_lightblue btn py-1 text-primary h-50 fs-12"
                          onClick={() => {
                            this.props.EditLead("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                      {/* <div class="d-flex justify-content-end mt-4 w-100">
                          <button
                            href="#"
                            class="text-center w-100px btn-l-secondary btn  py-1 text-white rounded-pill fs-12"
                            onClick={() => {
                              this.editMode();
                              this.GetLeadDetail();
                            }}
                          >
                            Cancel
                          </button>
                        </div> */}
                    </div>
                  </div>
                ) : (
                  <div class="col-md-4 ">
                    <div class="d-flex justify-content-end mt-4 w-100">
                      <input
                        type="button"
                        class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green"
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
      </React.Fragment>
    );
  }
}
