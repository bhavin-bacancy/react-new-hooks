import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

export const postCheckListByLeadCode = (leadCode, mobileNumber, mainapplicant) => {
  return post(
    `${API_URL}/growth-source/customer/getCheckListByLeadCode?leadCode=${leadCode}&mobileNumber=${mobileNumber}&mainapplicant=${mainapplicant}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postchecklistdetails", res);
    return res;
  });
};

// http://192.168.0.110:8080/growth-source/customer/createOrUpdateChecklist

export const postcreateOrUpdateChecklist = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/createOrUpdateChecklist",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("createOrUpdateChecklist", res);
    return res;
  });
};

// http://localhost:8080/growth-source/frankingdetails/getStampDutyList
export const getStampDutyList = () => {
  return post("/growth-source/frankingdetails/getStampDutyList", {}).then(
    res => {
      console.log("getStampDutyList", res);
      return res;
    }
  );
};

// http://localhost:8080/growth-source/frankingdetails/updateFrankingFeeDataByLeadCode

export const updateFrankingFeeDataByLeadCode = (objBody = {}) => {
  return post(
    "/growth-source/frankingdetails/updateFrankingFeeDataByLeadCode",
    objBody,
    false
  ).then(res => {
    console.log("updateFrankingFeeDataByLeadCode", res);
    return res;
  });
};

// http://localhost:8080/growth-source/frankingdetails/getFrankingFeeDataByLeadCode

export const getFrankingFeeDataByLeadCode = (objBody = {}) => {
  return post(
    "/growth-source/frankingdetails/getFrankingFeeDataByLeadCode",
    objBody,
    false
  ).then(res => {
    console.log("getFrankingFeeDataByLeadCode", res);
    return res;
  });
};

// http://localhost:8080/growth-source/frankingdetails/getFrankingFeeAmountByLeadCode

export const getFrankingFeeAmountByLeadCode = (objBody = {}) => {
  return post(
    "/growth-source/frankingdetails/getFrankingFeeAmountByLeadCode",
    objBody,
    false
  ).then(res => {
    console.log("getFrankingFeeAmountByLeadCode", res);
    return res;
  });
};
