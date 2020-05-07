import { post, get } from "../httpInterceptor";

export const postAddCollateralDetail = (obj, url = "") => {
  return post(
    `/growth-source/collateral/createOrUpdateCollateral`,
    obj,
    false
  ).then(res => {
    console.log("postAddCollateralDetail", res);
    return res;
  });
};

export const postGetCollateralDetail = (leadCode = "") => {
  return post(
    `/growth-source/collateral/getAllCollateralByLeadCode?leadCode=${
      leadCode ? leadCode : ""
    }`,
    {},
    false
  ).then(res => {
    console.log("postGetCollateralDetail", res);
    return res;
  });
};

export const postGetTypeOfCollateral = (obj = {}) => {
  return post(
    `/growth-source/collateral/getCollateralTypeList`,
    obj,
    false
  ).then(res => {
    console.log("postGetTypeOfCollateral", res);
    return res;
  });
};
export const postGetUsageByCollateral = (collateral = "") => {
  return post(
    `/growth-source/collateral/getUsageListByCollateralType?collateralType=${collateral}`,
    {},
    false
  ).then(res => {
    console.log("postGetUsageByCollateral", res);
    return res;
  });
};
export const postGetOwnerName = (leadCode = "") => {
  return post(
    `/growth-source/user/getAllCifNameByLeadCode?leadCode=${leadCode}`,
    {},
    false
  ).then(res => {
    console.log("postGetUsageByCollateral", res);
    return res;
  });
};

export const postGetCollateralDetailAndCoapplicant = (
  leadCode = "",
	mobileNumber = "",
	mainapplicant
) => {
  return post(
    `/growth-source/LogCLDisb/getCheckListByLeadCode?leadCode=${leadCode}&mobileNumber=${mobileNumber}&mainapplicant=${mainapplicant}`
  ).then(res => {
    console.log("postGetCollateralDetailAndCoapplicant",res)
    return res;
  });
};
export const postAddCollateralDocument=(objBody={})=>{
  return post(`/growth-source//LogCLDisb/uploadCLDisbDoc`,objBody,false,false).then(res=>{
    console.log("postAddCollateralDocument",res)
    return res
  })
}
export const postDeleteCollateralDocument=(objBody={})=>{
  return post(`/growth-source/LogCLDisb/deleteCLDisbDoc`,objBody,false,false).then(res=>{
    console.log("postDeleteCollateralDocument",res)
    return res
  })
}
