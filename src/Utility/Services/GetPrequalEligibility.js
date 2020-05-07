import { post, awspost, get } from "../httpInterceptor";
const CORS_URL = "https://cors-anywhere.herokuapp.com/";

export const getprequaleligibility = (leadcode) => {
  return post(`/growth-source/loan/getprequaleligibility?leadCode=${leadcode}`).then(
    res => {
      console.log("getprequaleligibility", res);
      return res;
    }
  );
};
