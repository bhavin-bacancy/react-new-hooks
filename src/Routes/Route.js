import React from "react";
import { Route } from "react-router-dom";
import { public_url } from "../Utility/Constant";
import Login from "../Pages/Login";
import Contact from "../Component/Pages/Contact";
import About from "../Component/Pages/About";
import Copyright_policy from "../Component/Pages/Copyright_policy";
import Privacy_policy from "../Component/Pages/Privacy_policy";
import Disclaimer from "../Component/Pages/Disclaimer";
import TermsCondition from "../Component/Pages/TermsCondition";
import Checklist from "../Pages/Loginchecklist/Checklist";
import Loginchecklist from "../Pages/Loginchecklist/Loginchecklist";
import CoapplicantChecklist from "../Pages/Loginchecklist/CoapplicantChecklist";
import CoapplicantChecklistview from "../Pages/Loginchecklist/CoapplicantChecklistview";
import {
  CreateLeads,
  Dashboard,
  LeadList,
  ConcentConversion,
  OtpVerify,
  ConcentRequestSent,
  ConsentWaiting,
  QDE,
  QdeSummary,
  ApplicantList,
  RefrenceNumber,
  CollateralDocumentUpload
} from "../Pages";
import PaymentMethods from "../Pages/PaymentGateway/PaymentMethods";
import ChequeConfirmation from "../Pages/PaymentGateway/ChequeConfirmation";
import PaymentCompleted from "../Pages/PaymentGateway/PaymentCompleted";
import SmsPaymentCompleted from "../Pages/PaymentGateway/SmsPaymentCompleted";
import SmsPaymentFailed from "../Pages/PaymentGateway/SmsPaymentFailed";
import PaymentRejectfrom from "../Pages/PaymentGateway/PaymentReject";
import Test from "../Pages/Test";
import Processing from "../Pages/PaymentGateway/Processing";
import CoapplicantForm from "../Pages/CoapplicantForm";
import Documents from "../Pages/Documents/index";
import CoApplicantConsentWaiting from "../Pages/CoApplicantConsentConversion/CoApplicantConsentWaiting";
import CoApplicantOtpVerify from "../Pages/CoApplicantConsentConversion/CoApplicantOtpVerify";
import SmsVerificationDesign from "../Pages/Documents/GST/SmsVerificationDesign";
import ITRUploadverfication from "../Pages/Documents/GST/ITRUploadVerfication";
import UserInfoComplete from "../Pages/Documents/UserInfoComplete";
import CoApplicantStatus from "../Pages/QDE/Status";
import OnlinePaymentByLink from "../Pages/PaymentGateway/OnlinePaymentByLink";
import ITRUploadSucessful from "../Pages/Documents/ITRUploadSucessful";
import GSTUploadSuccessfull from "../Pages/Documents/GSTUploadSuccessfull";
import { ConsentOtpVerifyByUrl } from "../Pages/OutSideLoginPages";
import Approval from "../Pages/OutSideLoginPages/ApprovalSent";
import BankStatementUploadSuccess from "../Pages/Documents/BankStatementUploadSuccess";
import { withRouter } from "react-router-dom";
import { Collateral } from "../Pages/Loginchecklist/Collateral";
import { Insurance } from "../Pages/Loginchecklist/Insurance";
import { SanctionConsent } from "../Pages/Loginchecklist/SanctionLetter/SanctionConsent";
import { SanctionOtpVerify } from "../Pages/Loginchecklist/SanctionLetter/SanctionOtpVerify";
import { SanctionPage } from "../Pages/Loginchecklist/SanctionLetter/SanctionPage";
import { Letter } from "../Pages/Loginchecklist/SanctionLetter/Letter";
import { SanctionLetter } from "../Pages/Loginchecklist/SanctionLetter/Index";
import { SanctionConsentVerify } from "../Pages/Loginchecklist/SanctionLetter/SanctionConsentVerify";
import { SanctionApproval } from "../Pages/Loginchecklist/SanctionLetter/SanctionApproval";
import { DisbursalUpload } from "../Pages/DisbursalUpload";
import { DisbursalChecklist } from "../Pages/DisbursalChecklist";
import { PromoterDetails } from "../Pages/Promoters/Index";
import { FrankingFees } from "../Pages/FrankingFees/index";
import PrequalEligibilityStatus from "../Pages/Documents/PrequalEligibilityStatus";
import { Signotary } from "../Pages/Signotary";
import GstOtpVerification from "../Pages/Documents/GST/GstOtpVerification";
class Routes extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let { location } = this.props;
    let { pathname } = location;

    if (
      !localStorage.getItem("employeeId") &&
      !pathname.startsWith(public_url.consent_co_otp_verify_by_url) &&
      !pathname.startsWith(public_url.consent_otp_verify_by_url) &&
      !window.location.pathname.startsWith(public_url.smsVerification) &&
      !window.location.pathname.startsWith(public_url.itrupload) &&
      !window.location.pathname.startsWith(public_url.payment) &&
      !window.location.pathname.startsWith(public_url.about_us) &&
      !window.location.pathname.startsWith(public_url.copyright_policy) &&
      !window.location.pathname.startsWith(public_url.privacy_policy) &&
      !window.location.pathname.startsWith(public_url.disclaimer) &&
      !window.location.pathname.startsWith(public_url.contact_us) &&
      !window.location.pathname.startsWith(public_url.term_and_condition) &&
      !window.location.pathname.startsWith(public_url.bankstmt_successfull) &&
      !window.location.pathname.startsWith(public_url.sanction) &&
      !window.location.pathname.startsWith(public_url.sanction_letter) &&
      !window.location.pathname.startsWith(public_url.sanction_consent) &&
      !window.location.pathname.startsWith(
        public_url.sanction_consent_verify
      ) &&
      !window.location.pathname.startsWith(public_url.sanction_otp_verify) &&
      !window.location.pathname.startsWith(public_url.gst_otp_verification)
    ) {
      this.props.history.push(public_url.login);
    }
  }
  render() {
    return (
      <React.Fragment>
        <Route exact path={public_url.landing_page} component={Login} />
        <Route exact path={public_url.contact_us} component={Contact} />
        <Route exact path={public_url.about_us} component={About} />
        <Route
          exact
          path={public_url.copyright_policy}
          component={Copyright_policy}
        />
        <Route
          exact
          path={public_url.privacy_policy}
          component={Privacy_policy}
        />
        <Route exact path={public_url.disclaimer} component={Disclaimer} />
        <Route
          exact
          path={public_url.term_and_condition}
          component={TermsCondition}
        />
        <Route exact path={public_url.login} component={Login} />
        <Route exact path={public_url.create_leads} component={CreateLeads} />
        <Route
          exact
          path={`${public_url.payment_methods}/:leadcode/:mobileno/:refrencenumber`}
          component={PaymentMethods}
        />
        <Route
          exact
          path={public_url.co_applicant}
          component={CoapplicantForm}
        />
        <Route
          exact
          path={`${public_url.co_applicant_detail}/:custcode/:leadcode`}
          component={CoapplicantForm}
        />
        <Route
          exact
          path={`${public_url.documents}/:leadcode/:refrencenumber`}
          component={Documents}
        />
        {/* <Route
          exact
          path={`${public_url.payment_methods}/:leadcode/:mobileno/:refrencenumber`}
          component={PaymentMethods}
        /> */}
        <Route exact path={public_url.payment_process} component={Processing} />
        <Route
          exact
          path={`${public_url.payment_confirmation}/:leadcode/:refrencenumber`}
          component={ChequeConfirmation}
        />
        <Route
          exact
          path={`${public_url.payment_completed}/:leadcode/:refrencenumber`}
          component={PaymentCompleted}
        />
        <Route
          exact
          path={`${public_url.sms_payment_completed}/:leadcode/:refrencenumber`}
          component={SmsPaymentCompleted}
        />
        <Route
          exact
          path={`${public_url.sms_payment_failed}/:leadcode/:refrencenumber`}
          component={SmsPaymentFailed}
        />
        <Route exact path={public_url.lead_list} component={LeadList} />
        <Route exact path={public_url.prospect_list} component={LeadList} />
        <Route
          exact
          path={`${public_url.lead_con}/:leadcode`}
          component={ConcentConversion}
        />
        <Route
          exact
          path={`${public_url.otp_verify}/:leadcode`}
          component={OtpVerify}
        />
        <Route
          exact
          path={`${public_url.concent_request_sent}/:leadcode`}
          component={ConcentRequestSent}
        />
        <Route
          exact
          path={`${public_url.consent_waiting}/:leadcode`}
          component={ConsentWaiting}
        />
        <Route
          exact
          path={`${public_url.update_profile}/:leadcode/:mobileno`}
          component={QDE}
        />
				<Route
          exact
          path={`${public_url.nonIndividual_applicant_profile}/:leadcode/:mobileno`}
          component={QDE}
        />
        <Route
          exact
          path={`${public_url.checklist}/:leadcode/:comobileno`}
          component={Checklist}
        />
        <Route
          exact
          path={`${public_url.co_applicant_checklist}/:leadcode/:mobileno`}
          component={CoapplicantChecklist}
        />
        <Route
          exact
          path={`${public_url.checklist_view}/:leadcode/:mobileno`}
          component={Loginchecklist}
        />
        <Route
          exact
          path={`${public_url.co_applicant_checklistview}/:leadcode/:mobileno`}
          component={CoapplicantChecklistview}
        />
        <Route
          exact
          path={`${public_url.update_profile_summary}/:leadcode/:mobileno`}
          component={QdeSummary}
        />
        <Route
          exact
          path={`${public_url.update_profile_applicant_list}/:leadcode/:mobileno`}
          component={ApplicantList}
        />
        <Route
          exact
          path={`${public_url.update_profile_refrence_number}/:leadcode/:mobileno/:refrencenumber/`}
          component={RefrenceNumber}
        />
        <Route
          exact
          path={`${public_url.update_profile_refrence_number}/:leadcode/:mobileno/:refrencenumber/:status`}
          component={RefrenceNumber}
        />
        <Route
          exact="true"
          path={`${public_url.co_applicant}/:leadcode/:mobileno/:cif`}
          component={CoapplicantForm}
        />
        <Route
          exact="true"
          path={`${public_url.co_applicant_consent_waiting}/:custcode/:leadcode`}
          component={CoApplicantConsentWaiting}
        />
        <Route
          exact
          path={`${public_url.co_applicant_otp_verify}/:custcode/:leadcode`}
          component={CoApplicantOtpVerify}
        />
        {/* <Route
          exact
          path={`${public_url.co_applicant_otp_verify}/:custcode/:leadcode`}
          component={CoApplicantOtpVerify}
        /> */}
        {/* Co-Applicant update form */}
        <Route
          exact
          path={`${public_url.co_applicant_update_profile}/:leadcode/:comobileno/:custcode`}
          component={QDE}
        />
        {/* Co-Applicant summary page */}
        <Route
          exact
          path={`${public_url.co_applicant_summary_page}/:leadcode/:comobileno/:custcode`}
          component={QdeSummary}
        />
        <Route
          exact
          path={`${public_url.smsVerification}/:refrencenumber/:comobileno/:pan/:mainapplicant`}
          component={SmsVerificationDesign}
        />
        <Route
          exact
          path={`${public_url.itrupload}/:refrencenumber/:comobileno/:mainapplicant`}
          component={ITRUploadverfication}
        />
        <Route
          exact
          path={`${public_url.userinfocom}/:refrencenumber/:leadcode/:comobileno/:type`}
          component={UserInfoComplete}
        />
        {/* Co-Applicant CRefrence page */}
        <Route
          exact
          path={`${public_url.co_applicant_reference_page}/:leadcode/:comobileno/:custcode/:refrencenumber/`}
          component={RefrenceNumber}
        />
        <Route
          exact
          path={`${public_url.co_applicant_reference_page}/:leadcode/:comobileno/:custcode/:refrencenumber/:status`}
          component={RefrenceNumber}
        />
        <Route
          exact
          path={`${public_url.co_applicant_status}/:leadcode`}
          component={CoApplicantStatus}
        />
        <Route
          exact
          path={`${public_url.payment}/:leadcode/:mobileno/:refrencenumber`}
          component={OnlinePaymentByLink}
        />
        <Route
          exact
          path={`${public_url.itr_successfull}`}
          component={ITRUploadSucessful}
        />
        <Route
          exact
          path={`${public_url.consent_otp_verify_by_url}/:leadcode`}
          component={ConsentOtpVerifyByUrl}
        />
        <Route
          exact
          path={`${public_url.consent_co_otp_verify_by_url}/:custcode/:leadcode`}
          component={ConsentOtpVerifyByUrl}
        />
        <Route
          exact
          path={`${public_url.otp_approval}:name`}
          component={Approval}
        />
        <Route
          exact
          path={`${public_url.gst_successfull}`}
          component={GSTUploadSuccessfull}
        />
        <Route
          exact
          path={`${public_url.bankstmt_successfull}`}
          component={BankStatementUploadSuccess}
        />
        {/* Collateral Detail */}
        <Route
          exact
          path={`${public_url.collateral_detail}/:leadcode`}
          component={Collateral}
        />
        {/* Insurance Details */}
        <Route
          exact
          path={`${public_url.insurance_detail}/:leadcode`}
          component={Insurance}
        />
        {/* CollateralDocumentUpload */}
        <Route
          exact
          path={`${public_url.collateral_document_upload}/:leadcode/:mobileno`}
          component={CollateralDocumentUpload}
        />
        {/* CollateralDocumentUpload */}
        <Route
          exact
          path={`${public_url.coapplicant_collateral_document_upload}/:leadcode/:mobileno`}
          component={CollateralDocumentUpload}
        />
        {/* Saction static page */}
        <Route
          exact
          path={`${public_url.sanction}/:leadcode`}
          component={SanctionLetter}
        />
        {/* Saction letter Details */}
        <Route
          exact
          path={`${public_url.sanction_letter}/:leadcode`}
          component={Letter}
        />
        {/* Saction consent Details */}
        <Route
          exact
          path={`${public_url.sanction_consent}/:leadcode`}
          component={SanctionConsent}
        />
        {/* Saction consent OTP verify */}
        <Route
          exact
          path={`${public_url.sanction_approval}/:leadcode`}
          component={SanctionApproval}
        />
        <Route
          exact
          path={`${public_url.disbrusal_upload}/:leadcode/:mobileno`}
          component={DisbursalUpload}
        />
        <Route
          exact
          path={`${public_url.disbursal_checklist}/:leadcode/:mobileno`}
          component={DisbursalChecklist}
        />

        <Route
          exact
          path={`${public_url.sanction_consent_verify}/:leadcode`}
          component={SanctionConsentVerify}
        />
        {/* Saction consent OTP verify */}
        <Route
          exact
          path={`${public_url.sanction_otp_verify}/:leadcode`}
          component={SanctionOtpVerify}
        />
        {/* Saction consent OTP verify */}
        <Route
          exact
          path={`${public_url.sanction_approval}/:leadcode`}
          component={SanctionApproval}
        />

        {/* Promoter details page */}
        <Route
          exact
          path={`${public_url.promoter_detail}/:leadcode`}
          component={PromoterDetails}
        />
        {/* franking Fees */}
        <Route
          exact
          path={`${public_url.franking_fees}/:leadcode/:loanrefnumber`}
          component={FrankingFees}
        />
        {/* Prequal Eligibility status page */}

        <Route
          exact
          path={`${public_url.prequal_eligibility}/:refrencenumber/:leadcode/:status`}
          component={PrequalEligibilityStatus}
        />
        <Route
          exact
          path={`${public_url.signtory_section}/:loannumber/:leadcode/:mobileno`}
          component={Signotary}
        />
        <Route
          exact
          path={`${public_url.gst_otp_verification}/:loannumber/:leadcode`}
          component={GstOtpVerification}
        />
      </React.Fragment>
    );
  }
}
export default withRouter(Routes);
