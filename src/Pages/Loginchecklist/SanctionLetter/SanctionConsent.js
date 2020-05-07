import React, { useState, useEffect } from "react";
import { public_url } from "../../../Utility/Constant";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";
import { cloneDeep } from "lodash";
import Modal from "react-responsive-modal";
import {
  getSanctionDetail,
  postCreateOtp
} from "../../../Utility/Services/Sanction";
import { ts, te } from "../../../Utility/ReduxToaster";
import { FrontendURL } from "../../../Utility/Config";

const initForm = {
  term: "",
  sendType: "2",
  errors: {
    term: null
  }
};

export const SanctionConsent = props => {
  const [state, setState] = useState({
    form: cloneDeep(initForm),
    isResend: false,
    openModal: false
  });

  const [data, setData] = useState({
    sanctionDetail: {}
  });

  let { sanctionDetail } = data;

  useEffect(() => {
    getSanctionDetails();
  }, [!sanctionDetail]);

  const getSanctionDetails = () => {
    let { match } = props;
    getSanctionDetail(match.params.leadcode).then(res => {
      if (res.error) return;
      setData({ sanctionDetail: res.data });
    });
  };

  let { openModal } = state;
  const ModalOpen = () => {
    setState({ ...state, openModal: !openModal });
  };

  let { form, isResend } = state;
  let { term, errors, sendType } = form;

  const onVerifyLink = () => {
    let { match } = props;
    getSanctionDetail(match.params.leadcode).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error == "false") {
        if (res.data.data.status == "Consent Approved") {
          ts("Consent has been Approved Successfully");
          props.history.push(
            `${public_url.co_applicant_status}/${props.match.params.leadcode}`
          );
        } else {
          
          te("Consent has not been Approved by the Customer");
        }
      } else if (res.data.error == "true") {
        te(res.data.message);
      }
    });
  };

  const onInputChange = (name, value, error = undefined) => {
    const { form } = state;
    form[name] = value;
    if (error !== undefined) {
      let { errors } = form;
      errors[name] = error;
    }
    setState({ form });
  };

  const onTypeChanged = e => {
    if (e.currentTarget.value == "1") {
      onCreateLink();
    }
    setState({
      ...state,
      isResend: true,
      form: { ...state.form, sendType: e.currentTarget.value }
    });
  };

  const onCreateLink = () => {
    let { sanctionDetail } = data;
    if (sanctionDetail && sanctionDetail.data) {
      let obj = {
        createdDate: null,
        updatedDate: null,
        createdBy: null,
        updatedBy: null,
        ipaddress: null,
        leadCode: sanctionDetail.data.leadCode,
        customerName: sanctionDetail.data.customerName,
        mobileNo: sanctionDetail.data.mobileNo,
        salesManagerCode: null,
        emailId: sanctionDetail.data.emailId,
        productId: null,
        consentType: null,
        consentConfirmed: null,
        otp: null,
        status: sanctionDetail.data.status,
        prospectstatus: null,
        messageId: null,
        loannumber: sanctionDetail.data.loannumber,
        id: null
      };
      postCreateOtp(
        obj,
        `${FrontendURL}${public_url.sanction_consent_verify}/${props.match.params.leadcode}`
      ).then(res => {
        if (res.error) {
          return;
        }
        if (res.data.error == "false") {
          ts("SMS and Email have been sent Successfully");
        } else if (res.data.error == "true") {
          te(res.data.message);
          setState({ ...state, otp: "" });
        }
      });
    }
  };

  const onCreateOTP = () => {
    let { sanctionDetail } = data;
    if (sanctionDetail && sanctionDetail.data) {
      let obj = {
        createdDate: null,
        updatedDate: null,
        createdBy: null,
        updatedBy: null,
        ipaddress: null,
        leadCode: sanctionDetail.data.leadCode,
        customerName: sanctionDetail.data.customerName,
        mobileNo: sanctionDetail.data.mobileNo,
        salesManagerCode: null,
        emailId: sanctionDetail.data.emailId,
        productId: null,
        consentType: null,
        consentConfirmed: null,
        otp: null,
        status: sanctionDetail.data.status,
        prospectstatus: null,
        messageId: null,
        loannumber: sanctionDetail.data.loannumber,
        id: null
      };
      postCreateOtp(obj).then(res => {
        if (res.error) {
          return;
        }
        if (res.data.error == "false") {
          ts("SMS have been sent Successfully");
          props.history.push(
            `${public_url.sanction_otp_verify}/${props.match.params.leadcode}`
          );
        } else if (res.data.error == "true") {
          te(res.data.message);
          setState({ ...state, otp: "" });
        }
      });
    }
  };

  let { location } = props;

  return (
    <>
      <div className="backToDashboard py-3">
        <div className="container-fluid">
          <Link to={public_url.lead_list}>Back to Dashboard</Link>
        </div>
      </div>
      <BreadCrumbs {...props} sanctionDetail={sanctionDetail} />
      <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
        <div className="container">
          <div class="d-flex justify-content-start align-items-center">
            <section class="py-4 position-relative bg_l-secondary w-100 ">
              <div class="pb-5 bg-white">
                <div className="row">
                  <div className="col-lg-6 mt-3 ">
                    <span className="font-weight-bold text-primary ml-3 mt-3">
                      {" "}
                      {sanctionDetail &&
                        sanctionDetail.applicant &&
                        sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}{" "}
                    </span>
                    <span className="text-primary ml-3 mt-3">
                      {" "}
                      ({" "}
                      {sanctionDetail &&
                        sanctionDetail.applicant &&
                        sanctionDetail.applicant.typeOfEntity}{" "}
                      )
                    </span>
                  </div>
                </div>
                <div className="mt-3 mb-3">
                  <span className="text-primary ml-3 mt-3">
                    Sanction Letter
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-primary ml-3 mt-3">
                    Declaration from Customer
                  </span>
                </div>

                <div className="mb-5 mt-5 mx-5 px-5">
                  <div className="d-flex justify-content-center ">
                    <label class="main text-primary ">
                      <input
                        type="checkbox"
                        onChange={e => {
                          onInputChange(
                            e.target.name,
                            e.target.checked ? "term" : "",
                            !e.target.checked
                          );
                        }}
                        name="term"
                        value={term}
                        checked={term}
                      />
                      <span class="geekmark"></span>
                    </label>
                    <p className="mb-0 text-primary lh-25">
                      {" "}
                      I{" "}
                      {sanctionDetail &&
                        sanctionDetail.applicant &&
												sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}
                      , am the sole signatory of buissness by the name{" "}
                      {sanctionDetail &&
                        sanctionDetail.applicant &&
                        sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}
                      . I agree to the{" "}
                      <span className="text-green">Terms & Conditions</span>{" "}
                      attached herewith.
                    </p>
                  </div>
                  {errors.term && (
                    <span className="reqEstric ml-15 mt-2">
                      Please select agreement
                    </span>
                  )}
                </div>
                <div class="row justify-content-center pb-5">
                  <div class="c_radiobtn w-50 d-flex justify-content-around">
                    <div>
                      <input
                        type="radio"
                        id="link"
                        name="radio-group"
                        value={"1"}
                        onChange={onTypeChanged}
                        checked={sendType == "1"}
                      />
                      <label htmlFor="link">Send link to customer</label>
                    </div>
                    <div className="">
                      <input
                        type="radio"
                        id="otp"
                        name="radio-group"
                        value={"2"}
                        onChange={onTypeChanged}
                        checked={sendType == "2"}
                      />
                      <label htmlFor="otp">OTP</label>
                    </div>
                  </div>
                </div>

                <div className="row mt-5">
                  <div className="col-sm-12">
                    <div className="text-right">
                      <Link
                        to={`${public_url.sanction_letter}/${props.match.params.leadcode}`}
                      >
                        <button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
                          Cancel
                        </button>
                      </Link>
                      {isResend && (
                        <button
                          onClick={onCreateLink}
                          className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                        >
                          Resend
                        </button>
                      )}
                      {sendType == "1" ? (
                        // <Link to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}>
                        <button
                          disabled={!term}
                          onClick={onVerifyLink}
                          className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-5 ${term &&
                            "btn-green"}`}
                        >
                          Next
                        </button>
                      ) : (
                        // </Link>
                        <button
                          onClick={onCreateOTP}
                          disabled={!term}
                          className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-5 ${term &&
                            "btn-green"}`}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Modal open={state.openModal} onClose={ModalOpen} center>
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle text-center">
            Terms & Conditions
          </h5>
        </div>
        <div class="modal-body">
          I/We hereby declare that the aforesaid information provided by me / us
          and documents submitted along with the Application to Growth Source
          Financial Technologies Private Limited (GSFTPL) are true, correct and
          accurate and I/We have not withheld any material information. I/We
          further agree that any false/misleading information given by me/ us,
          or suppression of any material fact will render my/our application
          liable for rejection and or closure and further action.
          <br></br>
          I/We hereby declare that I/We hereby declare that I/we are competent
          and not under any legal impediment to avail facility / Loans from
          GSFTPL as requested and I/We agree that the above statement shall form
          the basis of any arrangement to a loan. I/We confirm that there are no
          bankruptcy or winding-up proceedings instituted against me/us and I/We
          are not undischarged bankrupt(s) (or, in the case of a company, that
          we have not been wound-up) and that none of my/our credit
          facilities/loans with any financial institution has turned
          bad/irregular or is under default.
          <br></br>
          I/we have carefully read and understood /was explained in English/the
          vernacular language understood by me/us, the terms and conditions of
          this Application. I/we hereby irrevocably agree to be bound by all the
          terms and conditions governing the above-mentioned facilities.
          <br></br>
          I/we have carefully read/ been explained the charges for loan
          application. I/ we understand that Loan Processing Charges, initial
          money deposit or any charges collected for processing the application
          paid by me/s is not refundable. I/we agree that charges may vary
          depending on the transaction and will be informed during the
          processing of application. I/ we understand collected charges may
          include payouts/ payments made to third party vendors/ agencies
          associated with GSFTPL.
          <br></br>
          GSFTPL assures you that the information made available to us will be
          kept in strict confidentiality and we will use the information only to
          help us to service your account better, to provide you with products
          and services that you may have requested, and to inform you about
          other products and services that may be of interest to you. GSFTPL
          shall protect the personal details received from you with the same
          degree of care, to prevent the unauthorized use of the information as
          we protect our own confidential information of a like nature.
          <br></br>
          I/We have read, understand and acknowledge and agree that GSFTPL may
          refer my/our name to a recognized credit or referencing agency/ies
          and/or make such references and enquiries to me/us, friends,
          relatives, employer (past or present) business associates to verify
          the details as GSFTPL may consider necessary. I/We understand and
          agree that the sanction of the loan or any other facilities shall be
          at the sole discretion of GSFTPL, which reserves its right to reject
          this. Application without assigning any reason. I/We also understand
          the continuation of the account is at the sole discretion of GSFTPL.
          <br></br>
          I/We certify that I/we am/are a citizen of India / entity resident in
          India. I/ We confirm that I am /we are not a non-resident /
          non-resident-controlled entity. I/We understand that as a
          pre-condition, relating to grant of the loans/advances/ other non-fund
          based credit facilities to me /us, “GSFTPL”, requires my/our consent
          for the disclosure by GSFTPL of, information and data relating to
          me/us, of the disclosure by GSFTPL of, information and data relating
          to me/us, of the credit facility availed of /to be availed, by me,
          obligations assumed/to be assumed, by me/us, in relation there to and
          default, if any, committed by me/us, in discharge thereof.
          Accordingly, I/we hereby consent to GSFTPL, its officers, employees,
          advisers and agents disclosing information relating to me/us and my/
          our account (s) and /or dealing relationship(s) with it, including but
          not limited to personal details, details of my/our credit facilities,
          products, transactions, defaults (if any committed by me/us, in
          discharge thereof).
          <div className="mt-3">
            Accordingly, I/we hereby consent to GSFTPL, its officers, employees,
            advisers and agents disclosing information relating to me/us and
            my/our credit facilities, products, transactions, defaults (if any
            committed by me/us), payments history, any security taken,
            transactions undertaken and balances and position with GSFTPL, to
            <ul className="mt-2 mb-2">
              <li>
                <b>I)</b> The holding company of GSFTPL, any of its subsidiaries
                or subsidiaries of its holding Company, affiliates,
                representative and branch offices in any jurisdiction (the
                “permitted Parties”)
              </li>
              <li className="mt-2">
                <b>II)</b> Professional advisers, service providers or
                independent contractors to or agents of the Permitted parties
                such as debt collection agencies, data processing firms
                (including for this application) who are under a duty of
                confidentiality (whether located outside or inside of India) to
                the Permitted Parties
              </li>
              <li className="mt-2">
                <b>III)</b> Any actual or potential participant or
                sub-participant in relation to any of the GSFTPL’s right and/or
                obligations under any agreement between us, or assignee, novate
                or transferee (or any agent or advisor of any of the foregoing);
              </li>
              <li className="mt-2">
                <b>IV)</b> The affiliates of the Company, Credit Bureau, Credit
                Rating agencies, Banks, Financial Institutions, Non-banking
                Financial Institutions, insurer or insurance broker of, or
                direct or indirect provider of credit protection to any
                permitted party, Data Bank or any governmental or regulatory
                authorities/ bodies/departments for the purpose of complying
                with legal and/ or regulatory requirements,
              </li>
              <li className="mt-2">
                <b>V)</b> Any court or tribunal or regulatory, governmental or
                quasigovernmental authority with jurisdictions over the
                Permitted Parties
              </li>
              <li className="mt-2">
                <b>VI)</b> A merchant, card issuer or a member of a card
                association (for instance, visa/ mastercard etc.) where the
                disclosure is in connection with use of a card;
              </li>
              <li className="mt-2">
                <b>VII)</b> Any dealer of a foreign exchange, authorized person
                or any security provider:
              </li>
              <li className="mt-2">
                <b>VIII)</b> Anyone GSFTPL or RBI considers necessary in its
                discretion in order to provide me/us with services or otherwise
                as authorized by RBI
              </li>
            </ul>
            I/we declare that the information and data furnished by me/us to
            GSFTPL are true and correct I/we have signed the application form
            after filing in all details myself. If EMI is applicable to a
            loan/facility, the EMI date/payments would depend upon the date of
            disbursement. I/we undertake that the credit facility will be used
            for the purpose it is granted by GSFTPL/declared by me/us at the
            time of availing the credit facility and not for any speculative,
            antisocial or any purpose not permitted by law. I/we understand that
            this requirement is in line with the RBI regulations. I/we
            understand that if it is found by GSFTPL at a later date that the
            facility granted to me /us is being used for any other purpose than
            the purpose for which it was granted, then GSFTPL will have the
            right to recall the facility at any time. I/we also agree to provide
            to GSFTPL such further documents may be required from time to time
            to comply with the right to recall the facility at any time. I/we
            also agree to provide to GSFTPL such further documents as may be
            requirements of the Reserve Bank of India and GSFTPL.
            <br></br>
            I/we hereby certify that GSFTPL may be itself or through authorized
            persons that the you may consider appropriate (such as authority or
            credit reference agency, lawyers, agencies, bureau etc.) collect and
            verify any/ all information given, check credit references,
            employment details and obtain credit reports to determine my credit
            worthiness in connection with this Loan request or in case GSFTPL
            requires to conduct additional/further checks in order to assess my
            eligibility for further loans in the future and ongoing review.
            <br></br>
            GSFTPL reserves its right to send mails/messages to me/us to inform
            me/us of (a) changes or additions to the products, this agreement or
            the Fee Schedule,(b) violations of this Agreement, or (d) for
            marketing and other matter related to the Products or this Agreement
            or (d) for marketing and other purposes. Nothing in this provision
            shall require or obligate GSFTPL to send any notice if no notice is
            required or mandated elsewhere in this Agreement. At any time by
            informing customer care unit through phone or email, although I will
            continue to receive transactional messages from us.
            <br></br>
            Subject to applicable law, I/we agree that GSFTPL may, but are not
            obligated to, monitor or record any of my telephone conversations
            and chat texts with GSFTPL for quality control purposes, for
            purposes of training and GSFTPL protection. Subject to applicable
            law, I/we further agree that any account user or anyone else GSFTPL
            authorize to use my/our account consents to such monitoring or
            recording as well. I/we acknowledge that does not guarantee that
            recordings of any particular telephone calls will be retained or are
            capable of being retrieved.
            <br></br>
            By entering into this agreement, I/we Acknowledge that GSFTPL may
            contact me/us via telephone (Either by a live person, Automatic
            dialer, Pre-recorded Message or a combination of the foregoing) to
            Discuss the products and I/we consent to such contact. Further, I/we
            consent to receive such phone calls on all the telephone /mobile
            numbers provided by me /us or entered on the site.
          </div>
        </div>
      </Modal>
    </>
  );
};
