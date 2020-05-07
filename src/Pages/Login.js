import React from "react";
import { Input } from "../Component/Input";
import Footer from "../Component/Pages/Footer";
import { getFormDetails } from "../Utility/Helper";
import { te, ts } from "../Utility/ReduxToaster";
import { cloneDeep } from "lodash";
import { postLogin } from "../Utility/Services/Login";
import { syncLogin } from "../Redux/Action/Login";
import { public_url } from "../Utility/Constant";
import { connect } from "react-redux";

const loginForm = {
  username: "",
  password: "",
  errors: {
    username: null,
    password: null
  }
};
class Login extends React.Component {
  constructor() {
    super();
    this.state = { form: cloneDeep(loginForm), loading: false };
  }
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
    const { form } = this.state;
    let { syncLogin } = this.props;
    let obj = getFormDetails(form, this.onInputValidate);
    if (!obj) {
      te("Please enter required information");
      return false;
    }
    if (obj) {
      this.setState({ loading: true });
      postLogin(obj).then(res => {
        if (res.error) {
          this.setState({ loading: false });
          return;
        }
        if (res.data.error == "true") {
          this.setState({ loading: false });
          te(res.data.message);
        } else if (res.data.error == "false") {
          syncLogin(res.data);
          this.props.history.push(public_url.lead_list);
          ts(res.data.message);
        }
        this.setState({ loading: false });
      });
    }
  };
  componentDidMount() {
    if (localStorage.getItem("employeeId")) {
      this.props.history.push(public_url.lead_list);
    }
  }
  render() {
    let { form, loading } = this.state;
    let { username, password, errors } = form;
    return (
      <React.Fragment>
        <section class="my-3 login_sec position-relative">
          <div class="container">
            <div class="row ">
              <div class="col-md-12 col-lg-4  text-center py-5 px-5">
                <div class="mb-5">
                  <h3 class="text-green fs-18 fw-100">Welcome to</h3>
                  <h3 class="text-primary fw-700 fs-18">Growth Source</h3>
                </div>
                <form class="login text-left" onSubmit={this.handleSubmit}>
                  <div class="form-group mb-4 hide-input-title">
                    <Input
                      className="form-control "
                      placeholder="Username"
                      id="inputEmail4"
                      name="username"
                      value={username}
                      title="Username"
                      isReq={true}
                      onChangeFunc={this.onInputChange}
                      error={errors.username}
                      validationFunc={this.onInputValidate}
                    />
                  </div>
                  <div class="form-group hide-input-title">
                    <Input
                      className="form-control"
                      placeholder="Password"
                      id="inputEmail4"
                      name="password"
                      value={password}
                      title="Password"
                      isReq={true}
                      type="password"
                      onChangeFunc={(name, value, error) => {
                        this.onInputChange(name, value, error);
                        this.onInputValidate(name, error);
                      }}
                      error={errors.password}
                      validationFunc={this.onInputValidate}
                    />
                  </div>
                  {/* <div class="form-group">

                    <a href="#" class="text-green">
                      {" "}
                      Forgot Password ?{" "}
                    </a>
                  </div> */}
                  <button
                    type="submit"
                    class="btn btn-primary fw-100 text-white w-100 mt-5"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>
              <div class="col-md-1 d-lg-block d-none">
                <div class="border-c"></div>
              </div>
              <div class="col-md-12 col-lg-7 py-5">
                <div class="row align-items-center">
                  <div class="col-md-4 text-left">
                    <img src="images/i.png" />
                  </div>
                  <div class="col-md-7 pr-5 pl-0">
                    <h3 class="text-green fs-18 mb-2 montserat">
                      Loan Against Property
                    </h3>
                    <p className="fs-14 text-secondary l-h-15">
                      Avail Growth Source Loan Against Property (LAP) for your
                      business. Mortgage your residential, commercial &
                      Industrial property and enjoy comfortable EMIs with tenure
                      of up to 15 year. LAP can be availed for general business
                      purpose like working capital, Asset acquisition, Balance
                      transfer of existing loans etc.
                    </p>
                    <p className="fs-14 text-secondary l-h-15">
                      Salient features
                      <ul className="login-ul">
                        <li>Attractive Loan to Value</li>
                        <li>Quick Processing & Sanction</li>
                        <li>Flexible tenure</li>
                      </ul>
                    </p>
                  </div>
                </div>
                <div class="row flex-row-reverse align-items-center pl-5">
                  <div class="col-md-4 text-left">
                    <img src="images/i.png" />
                  </div>
                  <div class="col-md-7 pr-0">
                    <h3 class="text-green fs-18 mb-2 montserat">
                      {" "}
                      Business Loans{" "}
                    </h3>
                    <p className="fs-14 text-secondary l-h-15">
                      Avail Growth Source Business Loan (BL) to expand your
                      business. Benefit from Growth Source’s flexible unsecured
                      facility to fund your business in different phase and to
                      take your business to greater heights.
                    </p>
                    <p className="fs-14 text-secondary l-h-15">
                      Salient features
                      <ul className="login-ul">
                        <li>No Security required for Loan</li>
                        <li>Quick Processing & Sanction</li>
                        <li>Flexible tenure</li>
                      </ul>
                    </p>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col-md-4 text-left">
                    <img src="images/i.png" />
                  </div>
                  <div class="col-md-7 pr-5 pl-0">
                    <h3 class="text-green fs-18 mb-2 montserat">
                      {" "}
                      Consumer Loan{" "}
                    </h3>
                    <p className="fs-14 text-secondary l-h-15">
                      Loan against property is nothing but a loan which you
                      avail by keeping your commercial/residential property as a
                      collateral.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </React.Fragment>
    );
  }
}
export default connect(state => state, { syncLogin })(Login);
