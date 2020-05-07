import React, { Component } from "react";
import Footer from "./Footer";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

export class About extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="wrapper">
          <div className="container">
            <div>
              <h3
                className="text-center mt-3 mb-2"
                style={{ color: "#111", fontWeight: 400, fontSize: "28px" }}
              >
                About Us
              </h3>
              <span class="section-divider"></span>
              <p className="text-center mb-5">
                Growth Source is a well-funded new-age digital NBFC, founded by
                Peeyush Misra and Yashraj Erande in March 2019. It is led by
                seven professionals well respected in their fields and funded by
                Global and Indian institutions.
              </p>
            </div>
            <section className="section mt-4">
              <div className="row mb-5">
                <div className="col-lg-4 col-sm-6 mb-4">
                  <div
                    className="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="card-body">
                      {/* <span className="text-center">
                        <i class="fas fa-user fa-2x"></i>
                      </span> */}
                      <h4 className="card-title text-center">Peeyush Misra </h4>
                      <p className="card-text">
                        He holds a management degree from the Indian Institute
                        of Management Ahmedabad. He has a bachelor’s degree in
                        mechanical engineering. He was Partner/Managing
                        Director, Goldman Sachs 2010-2016 (Fixed Income,
                        Currencies and Commodities). During his tenure with
                        Goldman Sachs, he has headed various trading businesses
                        viz US Interest rates, Agency RMBS Trading,
                        Collateralized Mortgage Obligation Trading. Headed
                        various roles at Bear Stearns, Lehman Brothers and Tata
                        Consultancy Services.
                      </p>
                    </div>
                  </div>
                </div>
                {/* 2nd */}
                <div className="col-lg-4 col-sm-6 mb-4">
                  <div
                    className="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="card-body">
                      <h4 className="card-title text-center">Yashraj Erande</h4>
                      <p className="card-text">
                        He holds a management degree from the Indian School of
                        Business where was part of the dean’s list and won ISB’s
                        Torch Bearer award for exemplary leadership. He was
                        honoured as a distinguished alumnus (1% of the alumni
                        base) by the ISB. He has a bachelor’s degree in computer
                        engineering from Mumbai University. He has been featured
                        in The Economic Times 40 Under 40 List for India's most
                        influential Young Business Leaders in 2018. He was a
                        core member of BCG’s Financial Institutions practice
                        globally. Globally, he led BCG’s Corporate Finance and
                        Strategy practice for Financial Institutions clients
                        covering topics such as portfolio strategy, growth
                        strategy, M&A, and delivering total shareholder returns.
                      </p>
                    </div>
                  </div>
                </div>
                {/* 3rd */}
                <div className="col-lg-4 col-sm-6 mb-4">
                  <div
                    className="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div className="card-body">
                      <h4 className="card-title text-center">
                        Souvik Sengupta{" "}
                      </h4>
                      <p className="card-text">
                        He holds a management degree from the Indian Institute
                        of Social Welfare & Business Management, Kolkata. He has
                        a bachelor’s degree in Commerce. He is a seasoned
                        professional in Financial Services for over 21 years
                        working a cross section of respectable financial
                        institutions like Ge Caps , Citicorp, ICICI bank , HDFC
                        bank and Reliance Capital. He has set up highly
                        profitable business verticals like SME including MSMEs
                        for equipment working capital and project funding for
                        hospitals, hotels, education and renewable energy using
                        the cluster approach. He pioneered funding to academic
                        institutions, Micro Finance and Infrastructure
                        companies.
                      </p>
                    </div>
                  </div>
                </div>
                {/* 4th */}
                <div class="col-lg-4 col-sm-6 mb-4">
                  <div
                    class="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div class="card-body">
                      <h4 class="card-title text-center">Gurvinder Juneja</h4>
                      <p class="card-text">
                        He holds a management degree from the Indian Institute
                        of Management Ahmedabad. He has a bachelor’s degree from
                        Indian Institute of Technology, Varansi. A successful
                        corporate finance professional with over 18 years’
                        experience focused on leading strategic M&A (investments
                        and divestments), capital raise and corporate
                        restructuring at leading corporations. He has worked
                        across functional contexts and diverse stakeholders. He
                        was Group Chief Financial Officer at Religare Group. He
                        has worked with various renowned financial corporates
                        like ICICI Securities, Wipro Technologies, PWC.
                      </p>
                    </div>
                  </div>
                </div>
                {/* 5th */}
                <div class="col-lg-4 col-sm-6 mb-4">
                  <div
                    class="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div class="card-body">
                      <h4 class="card-title text-center">Abhijit Shah</h4>
                      <p class="card-text ">
                        He holds a management degree from Symbiosis Institute of
                        Management Ahmedabad. He has a bachelor’s degree from
                        VJTI, Mumbai. He is an accomplished technology leader
                        with 23+ years track record of successful strategic and
                        tactical leadership in IT industry majorly in Banking &
                        Finance domain. He is passionate about applying
                        innovative solutions that results in business value.
                        Significantly worked (Retail, SME and Corporate
                        Banking). He was Chief Technology Officer at DCB Bank.
                      </p>
                    </div>
                  </div>
                </div>
                {/* 6th */}
                <div class="col-lg-4 col-sm-6 mb-4">
                  <div
                    class="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div class="card-body">
                      <h4 class="card-title text-center">Dayakaran Sridhar</h4>
                      <p class="card-text">
                        Chartered accountant with more than 18 years of
                        experience. He is a business leader with an extremely
                        diverse set of skills across the entire consumer banking
                        spectrum straddling consumer lending, retail
                        liabilities, sales & distribution, segment management,
                        operations & technology. He was Chief Digital Officer
                        and Head Digital Strategy at AU Small Finance Bank.
                        Prior to that he was associated with Axis Bank, ICICI
                        Prudential, Citibank
                      </p>
                    </div>
                  </div>
                </div>
                {/* 7th */}
                <div class="col-lg-4 col-sm-6 mb-4">
                  <div
                    class="card about-card h-100"
                    style={{ backgroundColor: "white" }}
                  >
                    <div class="card-body">
                      <h4 class="card-title text-center">Yogendra Singh</h4>
                      <p class="card-text">
                        He holds a management degree from K. J. Somaiya
                        Institute of Management Studies & research. He has a
                        bachelor’s degree in engineering. He holds a certificate
                        degree in Quantitative Finance. He is an experienced
                        commercially focused professional with a unique
                        combination of extensive financial services knowledge
                        and in-depth machine learning, econometric and
                        statistical modelling and analytics skills, coupled with
                        strong leadership, product design and project management
                        experience. He was heading Analytics & Data science and
                        Vice President at TransUnion. Prior to that he was
                        associated with CRISIL Limited.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default About;
