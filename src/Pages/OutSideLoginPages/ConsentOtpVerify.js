import React from "react";
import { cloneDeep } from "lodash";
import { getLeadsByLeadid } from "../../Utility/Services/Leads";
import OtpInput from "react-otp-input";
import { postVerifyOtp } from "../../Utility/Services/Otp";
import { getFormDetails } from "../../Utility/Helper";
import { te, ts } from "../../Utility/ReduxToaster";
import { public_url } from "../../Utility/Constant";
import {
  postCoapplicantDetailByCustomerCode,
  postCoApplicantOtpVerify
} from "../../Utility/Services/CoApplicant";
const formInit = {
  term1: "",
  term2: "",
  errors: {
    term1: null,
    term2: null
  }
};
export default class ConsentOtpVerifyByUrl extends React.Component {
  constructor() {
    super();
    this.state = { form: cloneDeep(formInit) };
  }
  componentDidMount() {
    let { history } = this.props;
    if (
      history.location.pathname.startsWith(
        public_url.consent_co_otp_verify_by_url
      )
    ) {
      this.postCoapplicantDetailByCustomerCode();
    } else {
      this.GetLeadDetail();
    }
  }
  HandleOtp = (name, otp1) => {
    let { otp } = this.state;

    this.setState({ [name]: otp1 });
  };

  CoVerifyOtp = () => {
    let { mobileNo, mobileNumber } = this.state.form;
    let { match } = this.props;
    let { otp } = this.state;
    let objj = getFormDetails(this.state.form, this.onInputValidate);
    if (!objj) {
      te("Please enter required information");
      return false;
    }
    if (!otp) {
      te("Please enter otp");
      return;
    }
    this.setState({ VerifyOtpLoading: true });
    let obj = JSON.parse(localStorage.getItem("otpData"));
    // obj.otp = otp;

    postCoApplicantOtpVerify({
      otp: this.state.otp,
      leadCode: match.params.custcode,
      mobileNumber: this.state.form.mobileNumber,
      consentType: "SMS",
      consentConfirmed: "Customer"
    }).then(res => {
      if (res.error) {
        this.setState({ VerifyOtpLoading: false });
        return;
      }
      if (res.data.error == "false") {
        ts(res.data.message);
        this.setState({ VerifyOtpLoading: false });
        this.props.history.push(
          `${public_url.otp_approval}${this.state.form.custname}`
        );
      } else if (res.data.error == "true") {
        te(res.data.message);
        this.setState({ VerifyOtpLoading: false, otp: "" });
      }
    });
  };
  postCoapplicantDetailByCustomerCode = () => {
    let { match } = this.props;
    let { form } = this.state;
    postCoapplicantDetailByCustomerCode(match.params.custcode).then(res => {
      if (res.error) {
        return;
      }
      if (!res.data.error) {
        this.setState({ form: { ...form, ...res.data.data } });
        // this.CheckSms();
      } else {
        te(res.data.message);
      }
    });
  };
  VerifyOtp = () => {
    let { mobileNumber, mobileNo, leadCode } = this.state.form;
    let { otp } = this.state;
    let objj = getFormDetails(this.state.form, this.onInputValidate);
    if (!objj) {
      te("Please enter required information");
      return false;
    }

    if (!otp) {
      te("Please enter otp");
      return;
    }
    this.setState({ VerifyOtpLoading: true });
    // let obj = JSON.parse(localStorage.getItem("otpData"));
    // obj.otp = otp;
    // obj.consentType = "SMS";
    // obj.consentConfirmed = "Customer";
    postVerifyOtp({
      otp: otp,
      leadCode: leadCode,
      mobileNumber: mobileNo,
      consentType: "SMS",
      consentConfirmed: "Customer"
    }).then(res => {
      if (res.error) {
        this.setState({ VerifyOtpLoading: false });
        return;
      }
      if (res.data.error == "false") {
        ts(res.data.message);
        this.setState({ VerifyOtpLoading: false });
        this.props.history.push(
          `${public_url.otp_approval}${this.state.form.customerName}`
        );
      } else if (res.data.error == "true") {
        te(res.data.message);

        this.setState({ VerifyOtpLoading: false, otp: "" });
      }
    });
  };
  onInputChange = (name, value, error = undefined) => {
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
  GetLeadDetail = () => {
    let { match } = this.props;
    let { params } = match;
    getLeadsByLeadid(params.leadcode).then(res => {
      if (res.error) return;
      this.setState({
        form: {
          ...res.data.data,
          errors: this.state.form.errors
        }
      });
    });
  };
  render() {
    let { VerifyOtpLoading, otp } = this.state;
    let { customerName, custname, errors } = this.state.form;
    let { history } = this.props;
    return (
      <>
        <section className="bg_d-primary py-4">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <h4 className="text-l-priamry">
                  Welcome {customerName||custname ? custname||customerName : ""}!{}
                </h4>
              </div>
            </div>
          </div>
        </section>
        <section class="py-4 position-relative bg_l-primary">
          <div class="container pb-5 bg-white">
            <div class="row justify-content-center align-items-start ">
              <div class="col-md-11 consent-conversion">
                <div className="container text-success fs-28 text-center m-3">
                  Term and Condition
                </div>
                <div className="container text-primary trmscdtn-height">
                  Customer Consent for Terms & Conditions: I/We hereby declare
                  that the aforesaid information provided by me / us and
                  documents submitted along with the Application to Growth
                  Source Financial Technologies Private Limited (GSFTPL) are
                  true, correct and accurate and I/We have not withheld any
                  material information. I/We further agree that any
                  false/misleading information given by me/ us, or suppression
                  of any material fact will render my/our application liable for
                  rejection and or closure and further action. I/We confirm that
                  GSFTPL is not required to return documents supplied by me/us.
                  I/We hereby declare that I/We hereby declare that I/we are
                  competent and not under any legal impediment to avail facility
                  / Loans from GSFTPL as requested and I/We agree that the above
                  statement shall form the basis of any arrangement to a loan.
                  I/We confirm that there are no bankruptcy or winding-up
                  proceedings instituted against me/us and I/We are not
                  undischarged bankrupt(s) (or, in the case of a company, that
                  we have not been wound-up) and that none of my/our credit
                  facilities/loans with any financial institution has turned
                  bad/irregular or is under default. I/we have carefully read
                  and understood /was explained in English/the vernacular
                  language understood by me/us, the terms and conditions of this
                  Application. I/we hereby irrevocably irrevocably agree to be
                  bound by all the terms and conditions governing the
                  above-mentioned facilities. I/we have carefully read/ been
                  explained the charges for loan application. I/ we understand
                  that Loan Processing Charges, initial money deposit or any
                  charges collected for processing the application paid by me/s
                  is not refundable. I/we agree that charges can vary depending
                  on the transaction and will be informed during the processing
                  of application. I/ we understand collected charges may include
                  payouts/ payments maid to third party vendors/ agencies
                  associated with GSFT. I/We have read, understand and
                  acknowledge and agree that GSFTPL may refer my/our name to a
                  recognized credit or referencing agency/ies and/or make such
                  references and enquiries  to me/us, friends, relatives,
                  employer (past or present) business associates to verify the
                  details as GSFTPL may consider necessary. I/We understand and
                  agree that the sanction of the loan or any other facilities
                  shall be at the sole discretion of GSFTPL, which reserves its
                  right to reject this. Application without assigning any
                  reason. I/We also understand the continuation of the account
                  is at the sole discretion of GSFTPL. I/We certify that I/we
                  am/are a citizen of India / entity resident in India. I/ We
                  confirm that I am /we are not a non-resident / non-resident
                  controlled entity. I/We understand that as a pre-condition,
                  relating to grant of the loans/advances/ other non-fund based
                  credit facilities to me /us, Growth Source Financial
                  Technologies Private Limited. (“GSFTPL”), requires my/our
                  consent for the disclosure by GSFTPL of, information and data
                  relating to me/us, of the disclosure by GSFTPL of, information
                  and data relating to me/us, of the credit facility availed of
                  /to be availed, by me, obligations assumed/to be assumed, by
                  me/us, in relation there to and default, if any, committed by
                  me/us, in discharge thereof. Accordingly, I/we hereby consent
                  to GSFTPL, its officers, employees, advisers and agents
                  disclosing information relating to me/us and my/ our account
                  (s) and /or dealing relationship(s) with it, including but not
                  limited to personal details, details of my/our
                  credit facilities, products, transactions, defaults (if any
                  committed by me/us, in discharge thereof). Accordingly, I/we
                  hereby consent to GSFTPL, its officers, employees, advisers
                  and agents disclosing information relating to me/us and my/our
                  credit facilities, products, transactions, defaults (if any
                  committed by me/us), payments history, any security taken,
                  transactions undertaken and balances and position with GSFTPL,
                  to • The holding company of GSFTPL, any of its subsidiaries or
                  subsidiaries of its holding Company, affiliates,
                  representative and branch offices in any jurisdiction (the
                  “permitted Parties”) • Professional advisers, service
                  providers or independent contractors to or agents of the
                  Permitted parties such as debt collection agencies, data
                  processing firms (including for this application) who are
                  under a duty of confidentiality (whether located outside or
                  inside of India) to the Permitted Parties • Any actual or
                  potential participant or sub-participant in relation to any of
                  the GSFTPL’s right and/or obligations under any agreement
                  between us, or assignee, novate or transferee (or any agent or
                  advisor of any of the foregoing); • The affiliates of the
                  Company, Credit Bureau, Credit Rating agencies, Banks,
                  Financial Institutions, Non-banking Financial Institutions,
                  insurer or insurance broker of, or direct or indirect provider
                  of credit protection to any permitted party, Data Bank or any
                  governmental or regulatory authorities/ bodies/departments for
                  the purpose of complying with legal and/ or regulatory
                  requirements, • Any court or tribunal or regulatory,
                  governmental or quasigovernmental authority with jurisdictions
                  over the Permitted Parties • A merchant, card issuer or a
                  member of a card association (for instance, visa or
                  masterCard) where the disclosure is in connection with use of
                  a card; • Any dealer of a foreign exchange, authorized person
                  or any security provider: • Anyone GSFTPL or RBI considers
                  necessary in its discretion in order to provide me/us with
                  services or otherwise as authorized by RBI I/we declare that
                  the information and data furnished by me/us to GSFTPL are true
                  and correct I/we have signed the application form after filing
                  in all details myself. If EMI is applicable to a
                  loan/facility, the EMI date/payments would depend upon the
                  date of disbursement. I/we undertake that  the credit facility
                  will be used for the purpose it is granted by GSFTPL/declared
                  by me/us at the time of availing the credit facility and not
                  for any speculative, antisocial  or any purpose not permitted
                  by law. I/we understand that this requirement is in line with
                  the RBI regulations. I/we understand that if it is found by
                  GSFTPL at a later date that the facility granted to me /us is
                  being used for any other purpose than the purpose for which it
                  was granted, then GSFTPL will have the right to recall the
                  facility at any time. I/we also agree to provide to GSFTPL
                  such further documents may be required from time to time to
                  comply with the right to recall the facility at any time. I/we
                  also agree to provide to GSFTPL such further documents as may
                  be requirements of the Reserve Bank of India and GSFTPL. I/we
                  hereby certify that GSFTPL may be itself or through authorized
                  persons that the you may consider appropriate (such as
                  authority or credit reference agency, lawyers, agencies,
                  bureau etc.) collect and verify any/ all information given,
                  check credit references, employment details and obtain credit
                  reports to determine my credit worthiness in connection with
                  this Loan request or in case GSFTPL requires to conduct
                  additional/further checks in order to assess my eligibility
                  for further loans in the future and ongoing review. GSFTPL
                  reserves its right to send messages to me/us to inform me/us
                  of (a) changes or additions to the products, this agreement or
                  the Fee Schedule,(b) violations of this Agreement, or (d) for
                  marketing and other matter related to the Products or this
                  Agreement or (d) for marketing and other purposes. Nothing in
                  this provision shall require or obligate GSFTPL to send any
                  notice if no notice is required or mandated elsewhere in this
                  Agreement. At any time by informing customer care unit through
                  phone or email, although I will continue to receive
                  transactional messages from us. Subject to applicable law,
                  I/we agree that GSFTPL may, but are not obligated to, monitor
                  or record any of my telephone conversations and chat texts
                  with GSFTPL for quality control purposes, for purposes of
                  training and GSFTPL protection. Subject to applicable law,
                  I/we further agree that any account user or anyone else GSFTPL
                  authorize to use my/our account consents to such monitoring or
                  recording as well. I/we acknowledge that does not guarantee
                  that recordings of any particular telephone calls will be
                  retained or are capable of being retrieved. By entering into
                  this agreement, I/we Acknowledge that GSFTPL may contact me/us
                  via telephone (Either by a live person, Automatic dialer,
                  Pre-recorded Message or a combination of the foregoing) to
                  Discuss the products and I/we consent to such contact.
                  Further, I/we consent to receive such phone calls on all the
                  telephone /mobile numbers provided by me /us or entered on the
                  site.
                </div>
                <div className="container">
                  <div class="ml-0 ml-lg-5">
                    <div className="my-4">
                      <div className="d-flex col-md-8 ml-0 pl-0 ml-lg-5 pl-lg-5">
                        <label class="main text-primary ">
                          <input
                            type="checkbox"
                            onChange={e => {
                              this.onInputChange(
                                e.target.name,
                                e.target.checked ? "term1" : "",
                                !e.target.checked
                              );
                            }}
                            name="term1"
                            value={this.state.form.term1}
                            checked={this.state.form.term1}
                          />
                          <span class="geekmark"></span>
                        </label>
                        <p className="mb-0 text-primary">
                          {" "}
                          I, {customerName}, agree to the{" "}
                          <span className="text-green">Terms & Conditions</span>{" "}
                          attached herewith.
                        </p>
                      </div>
                      {errors.term1 && (
                        <span className="reqEstric  ml-5 pl-5 checkbox-error consent-conversion-checbox-error">
                          Please select this
                        </span>
                      )}
                    </div>

                    <div className="d-flex col-md-8 ml-0 pl-0 ml-lg-5 pl-lg-5">
                      <label class="main text-primary ">
                        <input
                          type="checkbox"
                          onChange={e => {
                            this.onInputChange(
                              e.target.name,
                              e.target.checked ? "term2" : "",
                              !e.target.checked
                            );
                          }}
                          checked={this.state.form.term2}
                          name="term2"
                          value={this.state.form.term2}
                        />
                        <span class="geekmark"></span>
                        <br />
                      </label>
                      <p className="mb-0 text-primary">
                        I, {customerName}, agree to consent Growth Source for
                        collecting my Aadhaar/ Driving licence and
                        <span>
                          {" "}
                          storing and using the same for KYC purpose.
                        </span>
                      </p>
                      <br />
                    </div>
                    {errors.term2 && (
                      <span className="reqEstric  ml-5 pl-5 checkbox-error consent-conversion-checbox-error">
                        Please select this
                      </span>
                    )}
                  </div>
                </div>
                <div class="row justify-content-center w-100 p-0 m-0">
                  <div class="">
                    <OtpInput
                      onChange={otp => {
                        console.log(otp);
                        this.HandleOtp("otp", otp);
                      }}
                      numInputs={6}
                      separator={<span>-</span>}
                      value={otp}
                      //isInputNum={true}
                    />
                  </div>
                  <div class="row justify-content-center w-100 p-0 m-0 mt-4">
                    <button
                      onClick={() => {
                        if (
                          history.location.pathname.startsWith(
                            public_url.consent_co_otp_verify_by_url
                          )
                        ) {
                          this.CoVerifyOtp();
                        } else {
                          this.VerifyOtp();
                        }
                      }}
                      class="text-center w-100px btn-l-secondary btn  py-1 text-white rounded-pill fs-12"
                    >
                      {" "}
                      {VerifyOtpLoading ? "Loading..." : "Submit"}{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
