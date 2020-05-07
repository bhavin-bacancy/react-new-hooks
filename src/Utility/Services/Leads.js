import { post, get } from "../httpInterceptor";
import { API_URL } from '../Config';

export const postCreateLeads = (objBody = {}) => {
  return post("/growth-source/lead/addLead", objBody, false).then(res => {
    console.log("postCreateLeads", res);
    return res;
  });
};
export const postProductList = () => {
  return post("/growth-source/common/getproductlist", {}).then(res => {
    console.log("getProductList", res);
    return res;
  });
};

//RM API
export const postLeadList = employeeId => {
    return post( `/growth-source/lead/getLeadListByEmployeeId?employeeId=${employeeId}`).then(res => {
    console.log("postLeadList", res);
    return res;
  });
};

export const getLeadsByLeadid = id => {
  return post(`/growth-source/lead/getLeadDetails?LeadCode=${id}`).then(res => {
    console.log(res);
    return res;
  });
};

export const postDuplicateEmailMobile = (obj = {}) => {
  return post(`/growth-source/lead/dedupeCheck`, obj).then(res => {
    console.log(res);
    return res;
  });
};

export const postProspectList = employeeId => {
  return post(
    API_URL +  `/growth-source/customer/getlistcaseByEmployeeId?employeeId=${employeeId}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postProspectList", res);
    return res;
  });
};

//Lead Count old : API_URL+"/growth-source/customer/countleadprospect",
export const postLeadCount = employeeId => {
  return post(
    API_URL+ `/growth-source/lead/getLeadCountById?employeeId=${employeeId}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postLeadCount", res);
    return res;
  });
};

// For Prospects
export const postProspectCount = employeeId => {
  return post(
    API_URL+`/growth-source/customer/getProspectCountById?employeeId=${employeeId}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postLeadCount", res);
    return res;
  });
};