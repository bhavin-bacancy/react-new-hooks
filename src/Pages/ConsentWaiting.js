import React from "react";
import { cloneDeep } from "lodash";
import { getLeadsByLeadid, postProductList } from "../Utility/Services/Leads";
import { Link } from "react-router-dom";
import { public_url } from "../Utility/Constant";
import { postCheckSms } from "../Utility/Services/CreateConstent";
import { ts, te } from "../Utility/ReduxToaster";
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
    term1: null,
    term2: null,
    customerName: null,
    mobileNo: null,
    emailId: null,
    productId: null
  }
};
export default class ConsentWaiting extends React.Component {
  constructor() {
    super();
    this.state = {
      form: cloneDeep(detailForm),
      productList: [],
      loading: false,
      fail: false,
      verified: false
    };
  }
  componentDidMount() {
    this.GetLeadDetail();
    this.ProductList();
  }
  GetLeadDetail = () => {
    let { match } = this.props;
    let { params } = match;
    let { loading } = this.state;
    getLeadsByLeadid(params.leadcode).then(res => {
      if (res.error) return;
      if (loading)
        if (res.data.data.status == "Consent Approved") {
          ts("Successful verified");
        } else {
          te("Please verify OTP to proceed");
        }
      this.setState({
        loading: false,
        form: {
          ...res.data.data,
          errors: this.state.form.errors
        },
        verified: res.data.data.status == "Consent Approved" ? true : false
      });
      //this.CheckSms(res.data.data);
    });
  };
  CheckConsentVerified = () => {
    this.setState({ loading: true }, () => {
      this.GetLeadDetail();
    });
  };
  CheckSms = data => {
    this.setState({ loading: true });
    let { otp, customerCode, mobileNumber } = JSON.parse(
      localStorage.getItem("otpData")
    );
    postCheckSms({
      customerName: data.customerName,
      mobileNo: data.mobileNo,
      salesManagerCode: data.salesManagerCode,
      emailId: data.emailId,
      id: data.id,
      leadCode: data.leadCode
    }).then(res => {
      if (res.error) {
        this.setState({ loading: false });
        return;
      }
      if (res.data.error == "false") {
        this.setState({
          loading: false,
          fail: false
        });
      } else {
        this.setState({ loading: false, fail: true });
      }
    });
  };
  ProductList = () => {
    postProductList().then(res => {
      if (res.error) {
        return;
      }
      this.setState({ productList: res.data.data });
    });
  };
  render() {
    let { form, productList, loading, fail, verified } = this.state;
    let { customerName, mobileNo, emailId, productId } = form;
    let { match } = this.props;
    let { params } = match;
    let productName = "";
    productList.map(res => {
      if (res.productId == productId) {
        productName = res.productcategory;
      }
    });
    return (
      <React.Fragment>
        <section className="bg_l-secondary pt-4">
          <div className="container  ">
            <div class="d-flex justify-content-start align-items-center">
              <div className="breadcrums">
                <ul>
                  <li className="mr-1" class="active">
                    <Link to={`${public_url.lead_list}`}>Leads</Link>
                  </li>
                  <li className="mr-1" class="active">
                    <Link to={`${public_url.lead_con}/${params.leadcode}`}>
                      Consent Conversion
                    </Link>
                  </li>
                  <li className="mr-1">
                    <a href="#">Consent Request Sent</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section class="py-4 position-relative bg_l-secondary ">
          <div class="container pb-5 bg-white text-center text-md-left">
            <div class="row justify-content-center align-items-center py-3">
              <div class="col-md-2 pl-0">
                <p class="mb-0 px-2 py-2 text-primary fs-14 fw-700 text-center">
                  {" "}
                  {params.leadcode}{" "}
                </p>
              </div>
              <div class="col-md-10 ">
                <div class="row justify-content-start">
                  <p class="col-lg-3 col-md-4 mb-0 text-primary">
                    Customer Name:
                  </p>
                  <span className="col-lg-9 col-md-8 text-primary pl-0 fw-700 word-break-all">
                    {customerName}
                  </span>
                </div>
              </div>
            </div>
            <div className="row justify-content-center align-items-start bg_lightblue1">
              <div class="col-md-2 pl-0"></div>
              <div class="col-md-10 pt-3 py-2">
                <div class="row justify-content-start">
                  <p class="col-lg-3 col-md-4 text-primary mb-0">
                    Mobile Number:
                  </p>
                  <span className="col-lg-9 col-md-8 text-primary mb-3 pl-0">
                    {mobileNo}
                  </span>
                </div>
                <div class="row justify-content-start">
                  <p class="col-lg-3 col-md-4 text-primary mb-0">
                    Email Address:
                  </p>
                  <span className="col-lg-9 col-md-8 text-primary mb-3 pl-0 word-break-all">
                    {emailId}
                  </span>
                </div>
                <div class="row justify-content-start">
                  <p class="col-lg-3 col-md-4 text-primary mb-0">Product:</p>
                  <span className="col-lg-9 col-md-8 text-primary mb-3 pl-0">
                    {productName}
                  </span>
                </div>
              </div>
            </div>
            {!fail ? (
              <div class="row justify-content-center py-5">
                <div class="">
                  <div class="text-primary text-center">
                    <span class="fa fa-check text-blue fs-50 mb-3"></span>
                  </div>
                  <div class="text-primary fs-18">
                    {loading
                      ? "Consent waiting for approval..."
                      : "Consent request sent"}{" "}
                  </div>
                </div>
              </div>
            ) : (
              <div class="row justify-content-center py-5">
                <div class="">
                  <div class="text-primary text-center">
                    <span class="fa fa-reply text-blue fs-50 mb-3"></span>
                  </div>
                  <div class="text-primary fs-18">Please Retry...</div>
                </div>
              </div>
            )}
            {fail ? (
              <div class="row justify-content-center w-100 p-0 m-0">
                <Link to={`${public_url.lead_con}/${params.leadcode}`}>
                  <button
                    class={`text-center w-100px ${
                      loading ? "btn-secondary" : "btn-green"
                    }   btn  py-1 text-trimary rounded-pill fs-12`}
                    disabled={loading}
                  >
                    {" "}
                    Back{" "}
                  </button>
                </Link>
              </div>
            ) : (
              <div class="row justify-content-center w-100 p-0 m-0">
                {verified ? (
                  <Link
                    to={`${public_url.update_profile}/${params.leadcode}/${form.mobileNo}`}
                  >
                    <button
                      class={`text-center w-100px ${
                        loading ? "btn-secondary" : "btn-green"
                      }   btn  py-1 text-trimary rounded-pill fs-12`}
                      disabled={loading}
                    >
                      {" "}
                      Next{" "}
                    </button>
                  </Link>
                ) : (
                  <button
                    onClick={this.CheckConsentVerified}
                    class={`text-center w-100px ${
                      loading ? "btn-secondary" : "btn-green"
                    }   btn  py-1 text-trimary rounded-pill fs-12`}
                    disabled={loading}
                  >
                    {" "}
                    Verify{" "}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </React.Fragment>
    );
  }
}
