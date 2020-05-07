import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Routes from "./Routes/Route";
import { Header, Footer } from "./Component/Pages";
import { postGetUserDetail } from "./Utility/Services/Login";
import { syncLogin } from "./Redux/Action/Login";
import { connect } from "react-redux";
import { public_url } from "./Utility/Constant";
import { Redirect } from "react-router-dom";

class App extends React.Component {
  componentDidMount() {
    // localStorage.setItem("employeeId", "fdsghdfjksg445454fdgdfg");
    // localStorage.setItem("id",1)
    this.GetUserDetail();
  }
  GetUserDetail() {
    if (localStorage.getItem("employeeId")) {
      postGetUserDetail(localStorage.getItem("employeeId")).then(res => {
        if (res.error) return;
        this.props.syncLogin({ data: res.data.data.user });
      });
    } else {
     
      if (
        window.location.pathname != public_url.login 
       
      )
      {

      }
       // window.location.pathname = public_url.login;
    }
  }
  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          <BrowserRouter>
            <Header />
            <Switch>
              <Routes />
            </Switch>
          </BrowserRouter>
          {/* <Footer /> */}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(state => state, { syncLogin })(App);
