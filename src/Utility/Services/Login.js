import { post } from "../httpInterceptor";

export const postLogin = (objBody = {}) => {
  return post(
    "/growth-source/authentication/authenticate",
    objBody,
    false
  ).then(res => {
    console.log("postLogin", res);
    return res;
  });
};
export const postGetUserDetail = employeeId => {
  return post(
    `/growth-source/user/getUserByEmployeeId?employeeId=${employeeId}`
  ).then(res => {
    console.log("postGetUserDetail", res);
    return res;
  });
};
