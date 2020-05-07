import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

export const getSignatoryDetail = loanNumber => {
  return post(
    `${API_URL}/growth-source/signatory/getSignatoryDetails?loanNumber=${loanNumber}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("getSignatoryDetail", res);
    return res;
  });
};
export const postAddSigntory = (objBody = {}) => {
  return post(
    `/growth-source/signatory/addSignatory`,
    objBody,
    false,
    false,
    false
  ).then(res => {
    console.log("postAddSigntory", res);
    return res;
  });
};

export const postGetSigantoryAll = loanNumber => {
  return post(
    `/growth-source/signatory/getDataForSignatory?loanNumber=${loanNumber}`,
    {},
    false,
    false,
    false
  ).then(res => {
    console.log("postGetSigantory", res);
    return res;
  });
};
