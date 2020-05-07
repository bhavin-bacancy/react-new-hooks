import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

//get all Sanction Detail by lead code
export const getSanctionDetail = (leadCode) => {
	return post(
		`${API_URL}/growth-source/loan/getPathByLeadCode?leadCode=${leadCode}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getSanctionDetail", res);
		return res;
	});
};

//get all Sanction Detail by lead code for status
export const getSanctionStatus = (leadCode) => {
	return post(
		`${API_URL}/growth-source/loan/getSanctionByLeadCode?leadCode=${leadCode}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getSanctionStatus", res);
		return res;
	});
};

//Post OTP for sanction letter
export const postOtpDetails = (bodyObj) => {
	return post(
		API_URL + "/growth-source/loan/verifyConsentLoan",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("postOtpDetails", res);
		return res;
	});
};

//Post API for create OTP sanction letter
export const postCreateOtp = (bodyObj, url = "") => {
	return post(
		`${API_URL}/growth-source/loan/createConsentLoan?url=${url ? url : ""}`,
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("postCreateOtp", res);
		return res;
	});
};

//Post API for credit file status.
export const fetchCreditStatus = (leadCode) => {
	return post(
		`${API_URL}/growth-source/signatory/getcreditfilestatus?leadcode=${leadCode}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("fetchCreditStatus.....", res);
		return res;
	});
};