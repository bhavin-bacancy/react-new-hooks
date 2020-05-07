import React from "react";
import { Input, Select } from "../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../Utility/Helper";
import { te, ts } from "../Utility/ReduxToaster";
import {
  postCreateLeads,
  getProductList,
  postProductList,
  postDuplicateEmailMobile
} from "../Utility/Services/Leads";
import { Link } from "react-router-dom";
import { public_url } from "../Utility/Constant";
const detailForm = {
  createdBy: "",
  updatedBy: "",
  customerName: "",
  mobileNo: "",
  salesManagerCode: "",
  emailId: "",
  productId: "",
  consentType: "N/A",
  status: "Consent Pending",
  errors: {
    customerName: null,
    mobileNo: null,
    emailId: null,
    productId: null
  }
};
export default class CreateLeads extends React.Component {
  constructor() {
    super();
    this.state = {
      form: cloneDeep(detailForm),
      loading: false,
      productList: []
    };
  }
  ProductList = () => {
    postProductList().then(res => {
      if (res.error) {
        return;
      }
      this.setState({ productList: res.data.data });
    });
  };
  componentDidMount() {
    this.ProductList();
  }
  OnSubmit = e => {
    e.preventDefault();
    const { form, loading } = this.state;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    obj.createdBy = obj.updatedBy = obj.salesManagerCode = localStorage.getItem(
      "employeeId"
    );
    if (obj) {
      this.setState({ loading: true });
      let objForm = cloneDeep(obj);
      postDuplicateEmailMobile(objForm).then(res => {
        if (res.error) {
          this.setState({ loading: false });
          return;
        }
        objForm.prospectstatus = "NO";
        if (!res.data.error) {
          postCreateLeads(objForm).then(res => {
            if (res.error) {
              this.setState({ loading: false });
              return;
            }
            if (res.data.error == false) {
              this.setState({ loading: false, form: cloneDeep(detailForm) });
              this.props.history.push(public_url.lead_list);
              ts(res.data.message);
            } else if (res.data.error == true) {
              this.setState({ loading: false });
              te(res.data.message);
            }
          });
        } else {
          te(res.data.message);
          this.setState({ loading: false, form: cloneDeep(detailForm) });
        }
      });
    }
    this.setState({ loading: true });
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
  render() {
    let {
      customerName,
      mobileNo,
      salesManagerCode,
      emailId,
      productId,
      errors
    } = this.state.form;
    let { productList, loading } = this.state;
    return (
      <React.Fragment>
        <section class="bg_d-primary p-5 create-lead-form">
          <div class="container-fluid">
            <div class="d-flex justify-content-between">
              <Link to={public_url.lead_list}>
                <h2 class="fs-20 text-white line-height-normal">
                  Home
                </h2>
              </Link>
              <a
                href="Javascript:Void(0)"
                class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16"
              >
                Add new lead
              </a>
            </div>
          </div>
        </section>
        <section class="py-4 position-relative bg_l-secondary ">
          <div class="container pb-5">
            <div class="row ">
              <div class="col-md-12  text-center ">
                <div class="mb-4">
                  <h3 class="text-green fw-700 fs-18">Welcome to</h3>
                  <h3 class="text-primary fw-700 fs-18">Growth Source</h3>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-md-12 col-lg-8">
                <div class="bg-white">
                  <form
                    class="p-5 form_style-1"
                    onSubmit={this.OnSubmit}
                    autoComplete="off"
                  >
                    <div class="form-group row align-items-start">
                      <label
                        for="colFormLabelSm"
                        class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Customer Name
                      </label>
                      <div class="col-sm-12 col-lg-8 col-xl-9 create-lead-form">
                        <Input
                          className="form-control form-control-md fs-12 "
                          id="colFormLabelSm"
                          placeholder="Type Name"
                          name="customerName"
                          value={customerName}
                          title="Customer Name"
                          isReq={true}
                          onChangeFunc={this.onInputChange}
                          error={errors.customerName}
                          validationFunc={this.onInputValidate}
                          maxLength="100"
                          reqType="onlyAlphbate"
                        />
                      </div>
                    </div>
                    <div class="form-group row align-items-start">
                      <label
                        for="colFormLabelSm"
                        class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Mobile
                      </label>
                      <div class="col-sm-12 col-lg-8 col-xl-9 create-lead-form">
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
                          reqType="mobile10"
                        />
                      </div>
                    </div>
                    <div class="form-group row align-items-start">
                      <label
                        for="colFormLabelSm"
                        class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Email Address
                      </label>
                      <div class="col-sm-12 col-lg-8 col-xl-9 create-lead-form">
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
                          reqType="email"
                          maxLength="255"
                        />
                      </div>
                    </div>
                    <div class="form-group row align-items-start">
                      <label
                        for="colFormLabelSm"
                        class="col-sm-12 col-lg-4 col-xl-3 text-primary mb-0 d-flex align-items-center mt-1"
                      >
                        Product
                      </label>
                      <div class="col-sm-12 col-lg-8 col-xl-9 create-lead-form">
                        <div class="select">
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
                          />
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-end mt-4">
                      <button
                        href="Javascript:void(0)"
                        class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
