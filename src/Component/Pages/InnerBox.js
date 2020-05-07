import React from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { postLeadCount, postProspectCount } from "../../Utility/Services/Leads";
import { te } from "../../Utility/ReduxToaster";

export default class InnerBox extends React.Component {
  constructor() {
    super();
    this.state = { 
      leadCount: [],
      prospectCount: []
    };
  }

  componentDidMount() {
    this.LeadCount();
    this.ProspectCount();
  }

  LeadCount = () => {
    let empID = localStorage.getItem("employeeId")
    postLeadCount(empID).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        this.setState({ leadCount: res.data.leadsCount });
      }
    });
  };

  ProspectCount = () => {
    let empID = localStorage.getItem("employeeId")
    postProspectCount(empID).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        this.setState({ prospectCount: res.data.prospectCount });
      }
    });
  };

  render() {
    let { leadCount, prospectCount } = this.state;
    return (
      <React.Fragment>
        <section class="bg_d-primary px-5 pt-4 pb-5 position-relative">
          <div class="container pb-5">
            <div class="d-flex justify-content-between">
              <Link to={public_url.lead_list}>
                <h2 class="fs-20 text-white line-height-normal text-l-priamry">
                  Home
                </h2>
              </Link>
              <div className="d-flex justify-content-between py-4 align-items-center">
                {/* <Link
                to={public_url.payment_methods}
                class="btn-green btn px-4 py-1 text-primary rounded-pill fs-12 mr-2" >
                Payment
              </Link> */}
                <Link
                  to={public_url.create_leads}
                  class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green "
                >
                  Add new lead
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section class="dashboard_card px-5 pt-4 pb-2 bg_l-secondary">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-12 col-md-6 col-lg-3 mb-4 mb-xl-0">
                <div class="card active">
                  <h2 class="fs-18 fw-600">Loan Against Property</h2>
                  <div class="d-flex justify-content-between py-4 align-items-center">
                    <div class="card_circle text-center ">
                      <div>
                        <h4 class="fs-28 fw-600 text-l-primary">
                          { leadCount }
                        </h4>
                        <p class="fs-14 text-primary mb-0 fw-600">Leads</p>
                      </div>
                    </div>
                    <div class="card_oval text-center py-2">
                      <div>
                        <h4 class="fs-28 fw-600 text-white">
                          {/* {leadCount.length > 0 && leadCount[0].prospectcount} */}
                          { prospectCount }
                        </h4>
                        <p class="fs-14 mb-0 fw-600">Prospects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6 col-lg-3 mb-4 mb-xl-0">
                <div class="card ">
                  <h2 class="fs-18 text-l-priamry fw-600">Personal loan </h2>
                  <div class="d-flex justify-content-between py-4">
                    <div class="card_circle text-center ">
                      <div>
                        <h4 class="fs-28 fw-600 text-l-primary">0</h4>
                        <p class="fs-14 text-primary mb-0 fw-600">Leads</p>
                      </div>
                    </div>
                    <div class="card_oval text-center">
                      <div>
                        <h4 class="fs-28 fw-600 text-white">0</h4>
                        <p class="fs-14 text-white mb-0 fw-600">Prospects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6 col-lg-3 mb-4 mb-xl-0">
                <div class="card">
                  <h2 class="fs-18 text-l-priamry fw-600">Consumer loan </h2>
                  <div class="d-flex justify-content-between py-4">
                    <div class="card_circle text-center ">
                      <div>
                        <h4 class="fs-28 fw-600 text-l-primary">0</h4>
                        <p class="fs-14 text-primary mb-0 fw-600">Leads</p>
                      </div>
                    </div>
                    <div class="card_oval text-center">
                      <div>
                        <h4 class="fs-28 fw-600 text-white">0</h4>
                        <p class="fs-14 text-white mb-0 fw-600">Prospects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6 col-lg-3 mb-4 mb-xl-0">
                <div class="card">
                  <h2 class="fs-18 text-l-priamry fw-600">SME- unsecure </h2>
                  <div class="d-flex justify-content-between py-4">
                    <div class="card_circle text-center ">
                      <div>
                        <h4 class="fs-28 fw-600 text-l-primary">0</h4>
                        <p class="fs-14 text-primary mb-0 fw-600">Leads</p>
                      </div>
                    </div>
                    <div class="card_oval text-center">
                      <div>
                        <h4 class="fs-28 fw-600 text-white">0</h4>
                        <p class="fs-14 text-white mb-0 fw-600">Prospects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}
