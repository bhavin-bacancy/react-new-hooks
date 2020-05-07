import React from "react";
import InnerBox from "./InnerBox";
import { public_url } from "../../Utility/Constant";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { syncLogout } from "../../Redux/Action/Login";
class Header extends React.Component {
  constructor() {
    super();
  }

  render() {
    let pathName = window.location.pathname;
    let showBox = false;
    let { isLogin, data } = this.props.login;
    if (
      window.location.pathname.startsWith(public_url.prospect_list) ||
      window.location.pathname.startsWith(public_url.lead_list) ||
      window.location.pathname.startsWith(public_url.lead_con) ||
      window.location.pathname.startsWith(public_url.lead_con) ||
      window.location.pathname.startsWith(public_url.otp_verify) ||
      window.location.pathname.startsWith(public_url.concent_request_sent)
    ) {
      showBox = true;
    }
    console.log("this.props", this.props.location.pathname);

    return (
      <React.Fragment>
        <header>
          <div className="top_header bg_l-primary d-flex justify-content-end">
            <div className="container-fluid">
              <div className={ `d-flex align-items-center justify-content-end ${this.props.location.pathname !==  '/bankstmt-successfull' ? 'py-2' : 'p-3'}`}>
                {isLogin &&
                  this.props.location.pathname !== "/bankstmt-successfull" && (
                    <React.Fragment>
                      <a
                        href="#"
                        className="text-white fw-100 textGreenHover mr-3"
                        onClick={() => {
                          this.props.syncLogout();
                          window.location.pathname = public_url.login;
                        }}
                      >
                        <i className="fa-lg fa fa-sign-out mr-1"></i> Logout
                      </a>
                      {/* <a
                      href="#"
                      className="btn-white btn px-4 py-1 text-primary rounded-pill fs-12 mr-3"
                    >
                      <i className="fa-lg fa fa-user"></i> {data.employeeName}
                    </a> */}
                    </React.Fragment>
                  )}
                {this.props.location.pathname !== "/bankstmt-successfull" && (
                  <a href="#" className="text-white textGreenHover fw-100">
                    <i className="fa-lg fa fa-mobile mr-1"></i> Download App
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="header py-3 ">
            <div className="container-fluid">
              <div className="d-flex align-items-center justify-content-between">
                <img
                  src="/images/logo.png"
                  onClick={() => {
                    if (isLogin) this.props.history.push(public_url.lead_list);
                  }}
                />
                {window.location.pathname != public_url.login && (
                  <div className="">
                    <h3 className="text-primary fw-700 fs-18">Welcome RM</h3>
                    <h3 className="text-green fw-700 fs-18">
                      {isLogin ? data && data.employeeName : "DevP"}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {isLogin && showBox && <InnerBox />}
      </React.Fragment>
    );
  }
}
export default connect(state => state, { syncLogout })(withRouter(Header));
