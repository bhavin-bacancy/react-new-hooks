import { post, get } from "../httpInterceptor";
export const CreateConstent = (obj, url = "") => {
  return post(
    `/growth-source/lead/createConsent?url=${url ? url : ""}`,
    obj,
    false
  ).then(res => {
    console.log("postCreateConstent", res);
    return res;
  });
};
export const postCheckSms = data => {
  return post("/growth-source/lead/checkSmsStatus", data).then(res => {
    console.log(res);
    return res;
  });
};
