import React, { Component } from "react";
import Footer from "./Footer";

export class Copyright_policy extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          <div className="container">
            <section className="copyright-page section mt-4">
              <div>
                <h3
                  className="text-center mt-3 mb-3"
                  style={{ color: "#111", fontWeight: 400, fontSize: "28px" }}
                >
                  Copyright Policy
                </h3>
                <span class="section-divider"></span>
              </div>
              <p>
                All materials published by the Growth Source Financial
                Technologies Private Limited [GSFTPL] (including, but not
                limited to news articles, blogs, photographs, images,
                illustrations, audio clips and video clips) are protected by
                copyright, and owned or controlled by GSFTPL or the party
                credited as the provider of the content.
              </p>
            </section>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Copyright_policy;
