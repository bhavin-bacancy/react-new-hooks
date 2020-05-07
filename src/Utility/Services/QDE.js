import { post, get, awspost } from "../httpInterceptor";
import { API_URL } from "../Config";

export const postSalution = () => {
  return post(
    API_URL + "/growth-source/common/getsubcatlst?categoryid=6",
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postSaution", res);
    return res;
  });
};
export const postEntity = () => {
  return post(
    API_URL + "/growth-source/common/getsubcatlst?categoryid=2",
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postEntity", res);
    return res;
  });
};
export const postGender = () => {
  return post(
    API_URL + "/growth-source/common/getsubcatlst?categoryid=5",
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postGender", res);
    return res;
  });
};
export const postPanName = (objBody = {}) => {
  return post(
    "https://enk9ulgqz5.execute-api.ap-south-1.amazonaws.com/test/pan",
    objBody,
    false
  ).then(res => {
    console.log("posPanName", res);
    return res;
  });
};
export const getAllCity = stateName => {
  return get(`/growth-source/common/getCity?state=${stateName}`).then(res => {
    console.log("getAllCity", res);
    return res;
  });
};
export const getAllState = () => {
  return get("/growth-source/common/getAllStates").then(res => {
    console.log("getAllState", res);
    return res;
  });
};
//Additional details
export const postAdditionalDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addadditionaldetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAdditionalDetail", res);
    return res;
  });
};

//Extra section
export const postExtraDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addextrasdetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postExtraDetail", res);
    return res;
  });
};
//Lead Detail
export const postLeadDetail = (leadCode, mobilenumber) => {
  return post(
    `${API_URL}/growth-source/customer/getCustomerByUniqueId?leadcode=${leadCode}&mobilenumber=${mobilenumber}&mainapplicant=true`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postExtraDetail", res);
    return res;
  });
};

//Loan Deatil
export const postAddLoanDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addloandetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddLoanDetail", res);
    return res;
  });
};

//Professional Detail
export const postAddProfessionalDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addprofessionalprofile",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postProfessionalDetail", res);
    return res;
  });
};

export const postCreateUpdateCustomer = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/createupdateCustomer",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCreateUpdateCustomer", res);
    return res;
  });
};
//Create Loan
export const postCreateLoan = objBody => {
  return post(
    API_URL + "/growth-source/loan/createLoan",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postCreateLoan", res);
    return res;
  });
};

//Verify Pan
export const postPanGstVerify = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/wrapper/wrapperApi",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postPanGstVerify", res);
    return res;
  });
};
//Adhar Detail
export const postAddAdharDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addadhardetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddAdharDetail", res);
    return res;
  });
};
//Adhar file upload
export const postUploadAdharFile = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/uploadDoc",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postUploadAdharFile", res);
    return res;
  });
};
export const postLoanDetailAsProductDetail = id => {
  return post(
    `${API_URL}/growth-source/common/getloandtlsbyprdid?productId=${id}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("postLoanDetailAsProductDetail", res);
    return res;
  });
};
export const postAddPanDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addpangstdetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddPanDetail", res);
    return res;
  });
};
//Add current address
export const postAddCurrentAddress = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addcurrentaddress",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCurrentAddress", res);
    return res;
  });
};
//Add communication address
export const postAddCommunicationAddress = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addcommaddress",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCommunicationAddress", res);
    return res;
  });
};

export const postAddAlternateContactDetail = (objBody = {}) => {
  return post(
    API_URL + "/growth-source/customer/addaltcontactdetails",
    objBody,
    false,
    false,
    true
  ).then(res => {
    console.log("postAddAlternateContactDetail", res);
    return res;
  });
};

//cinNumber 
export const getCinbyMobile = (leadCode, mobilenumber) => {
  return post(
    `${API_URL}/growth-source/customer/getcinbyleadmobilenumber?leadcode=${leadCode}&mobilenumber=${mobilenumber}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("getCinbyMobile", res);
    return res;
  });
};

//Get City and state witj pincode
export const getCityAndStateByPincode = pincode => {
  return get(
    `/growth-source/common/getAddressByPinCode?pincode=${pincode}`
  ).then(res => {
    console.log("getCityAndStateByPincode", res);
    return res;
  });
};

// export const getAddressByGstNumber = gstNumber => {
//   return get(
//     `https://cors-anywhere.herokuapp.com/https://enk9ulgqz5.execute-api.ap-south-1.amazonaws.com/test/gst-api?gstNumber=${gstNumber}`,
//     false,
//     null,
//     true,
//     {
//       "Content-Type": "application/json; charset=utf-8",
//       "x-api-key": "growth12345678910111"
//     }
//   ).then(res => {
//     console.log("getAddressByGstNumber", res);
//     return JSON.parse(res);
//   });
// };
//Industry List
export const getIndustryList = (objBody = {}) => {
  return get("/growth-source/common/getIndustryList", objBody, false).then(
    res => {
      console.log("getIndustryList", res);
      return res;
    }
  );
};

//Sector List
export const getSectorList = (objBody = {}) => {
  return get("/growth-source/common/getSectorList", objBody, false).then(
    res => {
      console.log("getSectorList", res);
      return res;
    }
  );
};

//Subsector List
export const getSubsectorList = sectorCode => {
  return get(
    `/growth-source/common/getSubSectorList?sectorCode=${sectorCode}`
  ).then(res => {
    console.log("getSubsectorList", res);
    return res;
  });
};

//Profile List
export const getProfileList = subCatType => {
  return get(
    `/growth-source/common/getProfileList?subCatType=${subCatType}`
  ).then(res => {
    console.log("getProfileList", res);
    return res;
  });
};

export const getLeadDetail = leadcode => {
  return post(
    `${API_URL}/growth-source/profile/getProfileDetails?leadCode=${leadcode}`,
    {},
    false,
    false,
    true
  ).then(res => {
    console.log("getLeadDetail", res);
    return res;
  });
};

export const getAddressByGstNumber = (gstNumber = "") => {
  return post(
    API_URL + "/growth-source/api/getGSTAddressDetails",
    {
      gstNumber: gstNumber
    },
    false,
    false,
    true
  ).then(res => {
    console.log("postAddCommunicationAddress", res);
    return res;
  });
};
export const postAddTanDetail = (objBody = {}) => {
  return post(
    `/growth-source/customer/addTanDetails`,
    objBody,
    false,
    false,
    false
  ).then(res => {
    console.log("postAddTanDetail", res);
    return res;
  });
};

export const postDeleteTanDetail = (objBody = {}) => {
  return post(
    `/growth-source/customer/deleteTanDetails`,
    objBody,
    false,
    false,
    false
  ).then(res => {
    console.log("postDeleteTanDetail", res);
    return res;
  });
};

export const postTanDocUpload = (objBody = {}) => {
  return post(
    `/growth-source/customer/uploadTanDoc`,
    objBody,
    false,
    false
  ).then(res => {
    console.log(`postTanDocUpload`, res);
    return res
  });
};
export const postTanNameByTanNumber=(objBody={})=>{
  return post(`/growth-source/thirdPartyApi2/getTanNameById`,objBody,false,false).then(res=>{
    console.log("postTanNameByTanNumber",res);
    return res
  })
}

export const postGetSegmentList=(objBody={})=>{
  return post(`/growth-source/common/getSegmentlist`,objBody,false,false).then(res=>{
    console.log("postGetSegmentList",res);
    return res
  })
}