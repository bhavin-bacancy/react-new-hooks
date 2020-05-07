import { post, awspost, get } from "../httpInterceptor";
import { API_URL } from "../Config";

const CORS_URL = "https://cors-anywhere.herokuapp.com/";

export const getApplicantbyLoan = loanNumber => {
	return post(
		`/growth-source/dde/getApplicantsByLoanNumber?loanNumber=${loanNumber}`
	).then(res => {
		console.log("getApplicantbyLoan", res);
		return res;
	});
};

export const getWrappedGstPanDetails = objBody => {
	return post(
		"/growth-source/api/getWrappedGstPanDetails",
		objBody,
		false
	).then(res => {
		console.log("getWrappedGstPanDetails", res);
		return res;
	});
};

export const checkDdeSmsStatus = (ddeType, sendSmsData) => {
	return post(
		`/growth-source/dde/checkDdeSmsStatus?ddeType=${ddeType}`,
		sendSmsData
	).then(res => {
		console.log("checkDdeSmsStatus", res);
		return res;
	});
};

export const smsVerifications = objBody => {
	return post(`/growth-source/api/getGSTTransactionDetails`, objBody).then(
		res => {
			console.log("smsVerifications", res);
			return res;
		}
	);
};

//ITR Upload
export const itrdocuments = objBody => {
	return post(`/growth-source/api/getITROCR`, objBody).then(res => {
		console.log("itrdocuments", res);
		return res;
	});
};

export const saveITRReport = objBody => {
	return post(`/growth-source/api/saveITRReport`, objBody).then(res => {
		console.log("saveITRReport", res);
		return res;
	});
};

export const awsAPI = objBody => {
	return awspost(
		`${CORS_URL}https://enk9ulgqz5.execute-api.ap-south-1.amazonaws.com/test/itr-report`,
		objBody,
		false,
		false,
		true
	).then(res => {
		console.log("awsAPI", res);
		return res;
	});
};



export const uploadBankStatement = objBody => {
	return post(`/growth-source/dde/uploadBankStatementHC`, objBody).then(res => {
		console.log("uploadBankStatement", res);
		return res;
	});
};

export const uploadFinancialStatement = objBody => {
	return post(`/growth-source/dde/uploadFinancialStatement`, objBody).then(res => {
		console.log("uploadFinancialStatement", res);
		return res;
	});
};

// get all Bank Names
export const getAllBankName = () => {
	return post(
		`${API_URL}/growth-source/perfios/getInstitutionList?institutionType=bank`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getAllBankName", res);
		return res;
	});
};

// get all Finanacial year
export const getAllFinanacialYear = () => {
	return post(
		`${API_URL}/growth-source/dde/getFinancialYears`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getAllFinanacialYear", res);
		return res;
	});
};

//Bank Details

export const sendLinkForBankDetails = (objBody = {}) => {
	return post(`${API_URL}/growth-source/perfios/generatePerfiosLinkHC`, objBody, false,
		false,
		true).then(
			res => {
				console.log("sendLinkForBankDetails", res);
				return res;
			}
		);
};

export const deleteBankSection = (objBody = {}) => {
	return post(`${API_URL}/growth-source/dde/deleteDocument`, objBody, false,
		false,
		true).then(
			res => {
				console.log("deleteBankSection", res);
				return res;
			}
		);
};

export const deleteFinancialSection = (objBody = {}) => {
	return post(`${API_URL}/growth-source/dde/deleteFsaFiles`, objBody, false,
		false,
		true).then(
			res => {
				console.log("deleteFinancialSection", res);
				return res;
			}
		);
};

export const sendDdeLinkSms = (ddeType, gstLink, sendSmsData) => {
	return post(
		`${API_URL}/growth-source/dde/sendDdeLinkSms?ddeType=${ddeType}&url=${gstLink}`,
		sendSmsData, false,
		false,
		true
	).then(res => {
		console.log("sendDdeLinkSms", res);
		return res;
	});
};

export const postGstOtp = (objBody = {}) => {
	return post(
		`https://enk9ulgqz5.execute-api.ap-south-1.amazonaws.com/test/gst-otp`,
		objBody,
		false,
		false,
		true
	).then(res => {
		console.log("postGstOtp", res);
		return res;
	});
};
export const postRequestGstOtp = (objBody) => {

	return awspost(
		`${CORS_URL}http://enk9ulgqz5.execute-api.ap-south-1.amazonaws.com/test/gst-otp`,
		objBody,
		false,
		false,
		true
	).then(res => {
		console.log("postRequestGstOtp", res);
		return res;
	});

}

export const postValidateOtp = (objBody) => {

	return awspost(
		`${CORS_URL}https://enk9ulgqz5.execute-api.ap-south-1.amazonaws.com/test/gst-otp/validateotp`,
		objBody,
		false,
		false,
		true
	).then(res => {
		console.log("postRequestGstOtp", res);
		return res;
	});

}

export const postSmsVerification=(objBody,url)=>{
  return post(`/growth-source/api/sendGstOtpLinkSms?otpType=GSTOTP&url=${url}`,objBody,false,false,false).then(res=>{
    console.log("postSmsVerification",res)
    return res
  })
}