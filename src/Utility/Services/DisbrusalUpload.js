import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

export const GetDisbrisalDetail = (leadcode, mobileno) => {
  return post(
    `/growth-source/Disbursement/getDisbursementByLeadCode?leadCode=${leadcode}&mobileNumber=${mobileno}&mainapplicant=true`,
    {},
    false
  ).then(res => {
    console.log("GetDisbrisalDetail", res);
    return res;
  });
};

export const UpdatingDisbursementDocFlag = (leadcode, mobileno, disbursmentDocFlag) => {
  return post(
    `/growth-source/Disbursement/updatingDisbursementDocFlag?leadCode=${leadcode}&mobileNumber=${mobileno}&mainapplicant=true&disbursmentDocFlag=${disbursmentDocFlag}`,
    {},
    false
  ).then(res => {
    console.log("UpdatingDisbursementDocFlag", res);
    return res;
  });
};

export const postAddDisbrisalDetail = (objBody = {}) => {
  return post(
    `/growth-source/Disbursement/uploadDisbDoc`,
    objBody,
    false
  ).then(res => {
    console.log("postAddDisbrisalDetail", res);
    return res;
  });
};
export const postDisbrusalDocumentDelete = (objBody) => {
  return post(
    `/growth-source/Disbursement/deleteDisbDoc`,
    objBody,
    false
  ).then(res => {
    console.log("postDisbrusalDocumentDelete", res);
    return res;
  });
}