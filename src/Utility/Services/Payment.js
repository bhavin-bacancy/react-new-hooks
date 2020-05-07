import { post, get } from "../httpInterceptor";

export const postPaymentGateway = (objBody = {}) => {
    return post("/growth-source/payment/checkPaymentSmsStatus", objBody, false).then(res => {
      console.log("postPaymentGateway", res);
      return res;
    });
};

export const postLinktoCustomer = (smsData, url) => {
  // /growth-source/payment/sendPaynimoLink
    // return post(`/growth-source/payment/sendPaymentLinkSms?url=${url}`, smsData).then(res => {
      return post(`/growth-source/payment/sendPaynimoLink`, smsData).then(res => {
      console.log("postLinktoCustomer", res);
      return res;
    });
};

export const postConsumerData = (objBody = {}) => {
    return post("/growth-source/payment/getConsumerData", objBody, false).then(res => {
      console.log("postConsumerData", res);
      return res;
    });
};

export const postBankBranchIfsc = ifsc => {
  return post(`/growth-source/payment/getBankBranchByIfsc?ifsc=${ifsc}`).then(res => {
    console.log("postBankBranchIfsc", res);
    return res;
  });
};

export const postDepositePayment = (objBody = {}) => {
  return post("/growth-source/payment/addDepositPayment", objBody, false).then(res => {
    console.log("postConsumerData", res);
    return res;
  });
};

export const postGetAmount = (objBody = {}) => {
  return post("/growth-source/payment/getDepositAmountWithGst", objBody, false).then(res => {
    console.log("postGetAmount", res);
    return res;
  });
};

export const postResPaymentGateway = (objBody = {}) => {
  return post("/growth-source/payment/saveOnlinePaymentResponse", objBody, false).then(res => {
    console.log("postResPaymentGateway", res);
    return res;
  });
};

export const getBankList = (objBody = {}) => {
  return post("/growth-source/common/getBanklist", objBody, false).then(res => {
    console.log("getBankList", res);
    return res;
  });
};

export const postPullTxn = (objBody) => {
  return post("/growth-source/payment/pullTxnPaynimo", objBody, false).then(res => {
    console.log("postPullTxn", res);
    return res;
  });
};

export const postPaymentLinkFlag = (objBody = {}) => {
  return post("/growth-source/payment/getPaymentLinkFlag", objBody, false).then(res => {
    console.log("postPaymentLinkFlag", res);
    return res;
   });
};
// http://13.126.20.61:8080/growth-source/payment/getPaymentLinkFlag