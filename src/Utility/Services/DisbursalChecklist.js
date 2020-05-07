import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

export const getDisbursalCheckList = (leadCode, mobileNumber) => {
  return post(
    `${API_URL}/growth-source/Disbursement/getDisbursementByLeadCode?leadCode=${leadCode}&mobileNumber=${mobileNumber}&mainapplicant=true`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("getDisbursalCheckList", res);
    return res;
  });
};
export const postSaveChecklist=(objBody={})=>{
  return post(`${API_URL}/growth-source/Disbursement/createOrUpdateDisbursementList`,objBody,false,false,true).then(res=>{
    console.log("postSaveChecklist",res)
    return res
  })
}