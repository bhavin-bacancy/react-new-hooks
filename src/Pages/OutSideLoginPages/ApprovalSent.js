import React from "react";

export default class Approval extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <React.Fragment>
          <section class="py-4 position-relative bg_l-secondary ">
            <br />
            <div className="section-blu">
            <div className="container text-ligh fs-18">
           Welcome {this.props.match.params.name}
            </div>
            <div class="container pb-5 bg-white">
              
              <div class="row justify-content-center align-items-start ">
                <div class="text-primary text-center text-center align-center container mt-5">
                  <span class="fa fa-check text-blue fs-50 mb-3"></span>
                </div>
                <div class="col-md-11 consent-conversion text-primary text-center mt-1">
                  Consent Approval Sent
                </div>
                <div class="text-primary text-center text-center align-center container mt-5 text-green">
                  Kindly assist the Growth Source executive to update your
                  profile
                </div>
              </div>
             
            </div>
            <br/>
            </div>
          </section>
        </React.Fragment>
      </div>
    );
  }
}
