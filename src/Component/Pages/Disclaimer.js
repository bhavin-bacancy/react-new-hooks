import React, { Component } from "react";
import Footer from "./Footer";

export class Disclaimer extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="wrapper" className="disclaimer-page">
          <div className="container">
            <div>
              <h3
                className="text-center mt-3 mb-2"
                style={{ color: "#111", fontWeight: 400, fontSize: "28px" }}
              >
                Disclaimer
              </h3>
              <span class="section-divider"></span>
            </div>
            <section className="section text-justify mt-4">
              <p>
                By visiting the site <b>https://loans.growthsourceft.com</b>,
                you agree to be bound by the disclaimer and the terms and
                conditions as stated herein below. User understand agrees and
                that undertakes that User is free to not accept not to accept
                these Disclaimers and in such an event, User is advised to not
                use or access this Website in any manner. Useand/ or access of
                this Website by the User in any manner shall constitute an
                irrevocable acceptance and be bound by of the following terms
                and conditions:
              </p>
              <ul>
                <li>
                  The materials and/or information available or obtained
                  at/through the Website is/are not guaranteed or warranted in
                  terms of completeness, correctness, accuracy, reliability or
                  otherwise howsoever by Growth Source Financial Technologies
                  Private Limited(“GSFTPL”) or its directors or employees.
                </li>
                <li>
                  Placing any reliance on this Website or any material available
                  through this Website, is at the sole risk of the User. Users
                  should seek professional advice before acting on the basis of
                  the information contained in the Website. The decision with
                  respect to any financial product or opportunity or nature or
                  suitability or choice or the viability of any product or
                  service shall always be sole responsibility and decision of
                  User.
                </li>
                <li>
                  GSFTPL does not endorse any advertisers on the Website or the
                  web pages therein. You are advised to verify the veracity of
                  all information on your own before placing any reliance on the
                  same. The linked sites present links available on the Website
                  are not under our control and we are not responsible for the
                  contents of any linked site or any link contained in a linked
                  site including micro site, or any changes or updates to such
                  sites. We are providing these links to you only as a
                  convenience, and the inclusion of any link does not imply
                  endorsement by us of such site.
                </li>
                <li>
                  In no event shall GSFTPL or any of its agents or any other
                  party involved in creating, producing, or delivering this
                  Website shall be liable for any direct, indirect, punitive,
                  incidental, special, consequential damages (including lost
                  revenues or profits, loss of business or loss of data) or any
                  damages whatsoever connected with the use or performance of
                  the Website, with the delay or inability to use the Website or
                  related services, the provision or failure to provide
                  services, or for any information, products, services and
                  related graphics obtained through the Website, or otherwise
                  arising out of the use of the Website, whether based on
                  contract, tort, negligence, strict liability or otherwise.  
                </li>
                <li>
                  Any person who is accessing or has accessed any information or
                  data from this Website acknowledges and agrees that all
                  proprietary rights, statutory or otherwise, and the
                  information received by such person shall remain the exclusive
                  property of GSFTPL. Unless otherwise provided or agreed by
                  GSFTPL in writing any reproduction, distribution or
                  transmission or modification, for consideration or otherwise,
                  of any such information contained in this Website is strictly
                  prohibited and would constitute a breach of the intellectual
                  property and other applicable laws.
                </li>
                <li>
                  This Website is not to be and should not be construed as
                  purporting to offer or an invitation to offer. Further, this
                  Website is not to be and should not be construed as purporting
                  to offer or inviting to offer any information or services to
                  residents of countries where GSFTPL is not licensed or
                  authorized to perform its business activities.
                </li>
                <li>
                  GSFTPL does not offer any services to any person through this
                  Website. Access to any information on or through this Website
                  is provided only on 'as is where is basis'
                </li>
              </ul>
            </section>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Disclaimer;
