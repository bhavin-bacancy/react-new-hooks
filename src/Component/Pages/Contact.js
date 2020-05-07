import React, { Component } from "react";
import Header from "./Header";
import Footer from "./Footer";

export class Contact extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          {/* <h5 className="text-center mt-5 mx-auto user-box">Contact Us</h5> */}
          <section className="page-section">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 p-2">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0480022593106!2d72.85789791485114!3d19.061626987096197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xe063fbd8c18371f5!2sGrowthSource%20Financial%20Technologies!5e0!3m2!1sen!2sin!4v1579083385992!5m2!1sen!2sin"
                    style={{
                      border: 0,
                      frameborder: 0,
                      width: 650,
                      height: 350
                    }}
                    allowfullscreen=""
                  ></iframe>
                </div>
                <div className="col-lg-4 p-2">
                  <div className="mb-4 text-center">
                    <i class="far fa-address-card fa-3x mb-1"></i>
                    <h4 className="mb-2"> Address</h4>
                    <p className="mb-0">
                      Growth Source Financial Technologies Pvt. Ltd. A Wing, 2nd
                      Floor, Fortune 2000 Building, G Block, Bandra Kurla
                      Complex, Mumbai 400 051
                    </p>
                  </div>
                  <div className="mb-4 text-center">
                    <i class="fas fa-mobile-alt fa-3x mb-1"></i>

                    <h4 className="mb-2">Contact Number</h4>
                    <a href="tel:022 6855 2818">022 6855 2818</a>
                  </div>
                  <div className="text-center">
                    <i class="fas fa-envelope-open-text fa-3x mb-1"></i>

                    <h4 className="mb-2">E-mail</h4>
                    <a href="tel:022 6855 2818">info@growthsourceft.com</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Contact;
