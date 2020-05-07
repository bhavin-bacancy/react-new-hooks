import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

export const CreateCoapplicant = (objBody = {}) => {
  return post(
    "/growth-source/coapplicant/addbasicdetails",
    objBody,
    false
  ).then(res => {
    console.log("CreateCoapplicant", res);
    return res;
  });
};
export const postCoApplicantCreateConsent = (objBody = {}, otpUrl) => {
  let url =
    API_URL +
    `/growth-source/coapplicant/createConsent?url=${otpUrl ? otpUrl : ""}`;
  return post(url, objBody, false, false, true).then(res => {
    console.log("postCoApplicantCreateConsent", res);
    return res;
  });
};

export const postCoApplicantCheckSms = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/checkSmsStatus",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCoApplicantCheckSms", res);
    return res;
  });
};
export const postCoapplicantDetailByCustomerCode = customerCode => {
  return post(
    `${API_URL}/growth-source/coapplicant/getbasicdetailsByUniqueId?custcode=${customerCode}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postCoapplicantDetailByCustomerCode", res);
    return res;
  });
};

export const postCoApplicantOtpVerify = (objBody = {}) => {
  return post(
    `${API_URL}/growth-source/coapplicant/verifyConsent`,
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCoApplicantOtpVerify", res);
    return res;
  });
};

//Co applicant current address
export const postCoApplicantCurrentAddress = (objBody = {}) => {
  return post(
    `${API_URL}/growth-source/coapplicant/addcurrentaddress`,
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCoApplicantCurrentAddress", res);
    return res;
  });
};
//Get Copplicant detail
export const postCoApplicantDetailDetail = leadcode => {
  return post(
    `${API_URL}/growth-source/customer/getApplicantsByLeadCode?leadCode=${leadcode}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postCoApplicantDetailDetail", res);
    return res;
  });
};
export const postAddCoPanDetail = (objBody = {}) => {
  return post(
    `${API_URL}/growth-source/coapplicant/addpangstdetails`,
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCoPanDetail", res);
    return res;
  });
};

export const postAddCoCommunicationDetail = (objBody = {}) => {
  return post(
    `${API_URL}/growth-source/coapplicant/addcommaddress`,
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCommunicationDetail", res);
    return res;
  });
};
export const postAddCoAlternativeDetail = objBody => {
  return post(
    `${API_URL}/growth-source/coapplicant/addaltcontactdetails`,
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCommunicationDetail", res);
    return res;
  });
};
export const postAddPanGstAdetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/addpangstdetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddPanGstAdetail", res);
    return res;
  });
};

export const postCoAddAdharDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/addadhardetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCoAddAdharDetail", res);
    return res;
  });
};

//Professional
export const postAddPersonalDetail=(objBody = {})=>{
  return post("/growth-source/coapplicant/addpersonaldetails",objBody,false,false).then(res=>{
    console.log("postAddPersonalDetail",res)
    return res
  })
}
export const postAddCoProfessionalDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/addprofessionalprofile",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCoProfessionalDetail", res);
    return res;
  });
};
//Extra
export const postAddCoExtraDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/addextrasdetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCoExtraDetail", res);
    return res;
  });
};

// TAN Details
export const postAddCoTanDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/addCoApplicantTanDetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCoTanDetail", res);
    return res;
  });
};

//create update customer
export const postCoCreateCustomer = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/createupdateCoapplicant",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCoCreateCustomer", res);
    return res;
  });
};

export const addCoapplicantIndNonIndDetails = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/coapplicant/addCoapplicantIndNonIndDetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("addCoapplicantIndNonIndDetails", res);
    return res;
  });
};
