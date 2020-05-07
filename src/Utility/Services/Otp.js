import { post } from "../httpInterceptor";

export const postVerifyOtp = (objBody = {}) => {
  return post("/growth-source/lead/verifyConsent", objBody, false).then(res => {
    console.log("postLogin", res);
    return res;
  });
};
