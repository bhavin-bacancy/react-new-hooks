export const public_url = {
  login: "/log-in",
  create_leads: "/create-leads",
  payment_methods: "/payment_methods",
  payment_process: "/payment_process",
  payment_confirmation: "/payment_confirmation",
  // payment_completed:"/payment_completed",
  // co_applicant: "/co_applicant",
  sms_payment_completed: "/sms-payment-completed",
  sms_payment_failed: "/sms-payment-failed",
  checklist: "/login_checklist",
  co_applicant_checklist: "/co_applicant_checklist",
  checklist_view: "/checklist_view",
  co_applicant_checklistview: "/co_applicant_checklistview",
  documents: "/documents",
  smsVerification: "/smsVerification",
  itrupload: "/itrupload",
  userinfocom: "/userinfocom",
  payment_completed: "/payment_completed",
  co_applicant: "/co-applicant/consent-conversion",
  co_applicant_detail: "/co-applicant/consent-conversion-detail",
  co_applicant_consent_waiting: "/co-applicant/consent-waiting",
  co_applicant_otp_verify: "/co-applicant/otp-verify",
  co_applicant_update_profile: "/co-applicant-update-profile",
  co_applicant_summary_page: "/co-applicant-summary-page",
  co_applicant_reference_page: "/co-reference-page",
  co_applicant_status: "/co-applicant-status",
  dashboard: "/dashboard",
  lead_list: "/lead-list",
  prospect_list: "/prospect-list",
  landing_page: "/",
  concent_pending: "/concent-pending",
  lead_con: "/lead-con",
  otp_verify: "/otp-verify",
  concent_request_sent: "/concent-request-sent",
  consent_waiting: "/consent-waiting",
	update_profile: "/update-profile",
	nonIndividual_applicant_profile: "/applicant-profile-non-individual",
  update_profile_summary: "/update-profile-summary",
  update_profile_applicant_list: "/update-profile-applicant-list",
  update_profile_refrence_number: "/update-profile-refrence-number",
  payment: "/payment",
  itr_successfull: "/itr-successfull",
  gst_successfull: "/gst_successfull",
  consent_otp_verify_by_url: "/applicant/consent-otp-verify",
  consent_co_otp_verify_by_url: "/co-applicant/consent-otp-verify",
  otp_approval: "/applicant/otp-approval/",
  about_us: "/about-us",
  copyright_policy: "/copyright_policy",
  privacy_policy: "/privacy_policy",
  disclaimer: "/disclaimer",
  contact_us: "/contact-us",
  term_and_condition: "/terms-conditions",
  bankstmt_successfull: "/bankstmt-successfull",
  collateral_detail: "/collateral-detail",
  insurance_detail: "/insurance-detail",
  collateral_document_upload: "/collateral-document-upload",
  coapplicant_collateral_document_upload:
    "/co-applicant-collateral-document-upload",
  sanction: "/sanction",
  sanction_letter: "/sanction-letter",
  sanction_consent: "/sanction-consent",
  sanction_consent_verify: "/sanction-consent-verify",
  sanction_otp_verify: "/sanction-otp-verify",

  sanction_approval: "/sanction-approval",
  disbrusal_upload: "/disbrusal-upload",
  disbursal_checklist: "/disbursal-checklist",
  promoter_detail: "/promoter-detail",
  franking_fees: "/franking-fees",
  prequal_eligibility: "/prequal-eligibility",
  signtory_section:"/signatory",
  gst_otp_verification:"/gst-otp-verification"
};

export const industry = [
  { IndustryCode: "A", IndustryDesc: "Agriculture, forestry and fishing" },
  { IndustryCode: "B", IndustryDesc: "Mining and quarrying" },
  { IndustryCode: "C", IndustryDesc: "	Manufacturing" },
  {
    IndustryCode: "D",
    IndustryDesc: "Electricity, gas, steam and air conditioning suppl"
  },
  {
    IndustryCode: "E",
    IndustryDesc: "Water supply; sewerage, waste management and remed"
  },
  { IndustryCode: "F", IndustryDesc: "Construction" },
  {
    IndustryCode: "G",
    IndustryDesc: "Wholesale and retail trade; repair of motor vehicl"
  },
  { IndustryCode: "H", IndustryDesc: "Transportation and storage" },
  {
    IndustryCode: "I",
    IndustryDesc: "Accommodation and food service activities"
  },
  { IndustryCode: "J", IndustryDesc: "Information and communication" },
  { IndustryCode: "K", IndustryDesc: "Financial and insurance activities" },
  { IndustryCode: "L", IndustryDesc: "	Real estate activities" },
  {
    IndustryCode: "M",
    IndustryDesc: "Professional, scientific and technical activities"
  },
  {
    IndustryCode: "N",
    IndustryDesc: "	Administrative and support service activities"
  },
  {
    IndustryCode: "O",
    IndustryDesc: "Public administration and defence; compulsory soci"
  },
  { IndustryCode: "P", IndustryDesc: "	Education" },
  {
    IndustryCode: "Q",
    IndustryDesc: "	Human health and social work activities"
  },
  { IndustryCode: "R", IndustryDesc: "	Arts, entertainment and recreation" },
  { IndustryCode: "S", IndustryDesc: "	Other service activities" },
  {
    IndustryCode: "T",
    IndustryDesc: "	Activities of households as employers; undifferent"
  },
  {
    IndustryCode: "U",
    IndustryDesc: "	Activities of extraterritorial organizations and b"
  }
];

export const sector = [
  { SectorCode: "1", SectorDesc: "	MANUFACTURING" },
  { SectorCode: "10", SectorDesc: "	GOVT" },
  { SectorCode: " 11", SectorDesc: "SHIPPING" },
  { SectorCode: "12", SectorDesc: "POWER" },
  { SectorCode: " 13", SectorDesc: "FILM" },
  { SectorCode: "15", SectorDesc: "PHARMA" },
  { SectorCode: "16", SectorDesc: "HOSP" },
  { SectorCode: "17", SectorDesc: "OTHERS" },
  { SectorCode: "2", SectorDesc: "SERVICE" },
  { SectorCode: "3", SectorDesc: "TRADING" },
  { SectorCode: "4", SectorDesc: "	IT INDUSTRY" },
  { SectorCode: "5", SectorDesc: "RETAIL" },
  { SectorCode: "6", SectorDesc: "AUTOMOBILES" },
  { SectorCode: "7", SectorDesc: "BANKING" },
  { SectorCode: "8", SectorDesc: "INSURNC" },
  { SectorCode: "9", SectorDesc: "EDUINS" },
  { SectorCode: "MED", SectorDesc: "medical" }
];
export const loadPurpose = [
  { id: "A01", label: "AGRICULTURE" },
  { id: "A03", label: "PERSONAL" },
  { id: "A04", label: "WORKING CAPITAL" },
  { id: "A05", label: "AQUISITION" },
  { id: "A06", label: "OTHERS" },
  { id: "A11", label: "NEW FROM COMBINATION FROM ABOVE" },
  { id: "A13", label: "PURCHASE OF INDUSTRIAL PROPERTY" },
  { id: "A14", label: "PURCHASE OF WAREHOUSE" },
  { id: "A16", label: "new for purchase of new land for new unit" },
  { id: "A17", label: "new for renovation of existing unit" },
  { id: "A18", label: "new for working capital gap" },
  { id: "A19", label: "new for capacity expansion" },
  { id: " A20", label: "BT" },
  { id: "A21", label: " BT+Topup (Combination of BT + Topup Purpose)" },
  { id: "A22", label: "BT + Topup ( Topup for working capital)" },
  { id: "A23", label: "BT + Topup ( Topup for renovation of existing unit" },
  { id: "A24", label: "BT + Topup (Topup for purchsse of land)" },
  { id: "A25", label: "	BT + Topup (Topup for capacity expansion)" },
  { id: "A26", label: "Onward lending" },
  { id: " BLTRS", label: "Balance Transfer" },
  { id: " BUSLOAN", label: "Business Loan" },
  { id: "EDL", label: "Educational Loan" },
  { id: "LAEP", label: "Loan Against Existing Property" },
  { id: "LAPLOT", label: "Loan Against Plot" },
  { id: " LOANCON", label: "Loan Consolidation" },
  { id: "LRD", label: "Lease Rental Discounting" },
  { id: "POCP", label: "Purchase of Commercial Property" },
  { id: "PORPPUR", label: "Property Purchase" }
];
export const tenure = [
  { id: 1, label: 1 },
  { id: 2, label: 2 }
];
export const subIndustry = [
  { label: "Information Technology", value: "it" },
  { label: "Banking", value: "bk" }
];
export const profile = [
  { label: "Software Developer", value: "SD" },
  { label: "Clerk", value: "ck" }
];
export const CommonFileType = [
  { label: "PDF", value: ".pdf", type: "" },
  { label: "JPG", value: ".jpg", type: "image" },
  { label: "PNG", value: ".png", type: "image" },
  { label: "JPEG", value: ".jpeg", type: "image" }
];