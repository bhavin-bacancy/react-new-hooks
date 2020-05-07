import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";


//get all Promoter Detail by lead code
export const getPromoterDetail = (leadCode) => {
	return post(
		`${API_URL}/growth-source/promoter/getpromoterdetailsbyLeadcode?leadcode=${leadCode}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getPromoterDetail", res);
		return res;
	});
};

//Add promoter basic details
export const addBasicDetails = (bodyObj = {}) => {
	return post(
		API_URL + "/growth-source/promoter/addpromoterBasicDetails",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("addBasicDetails", res);
		return res;
	});
};

//Add promoter government details
export const addGovernmentDetails = (bodyObj = {}) => {
	return post(
		API_URL + "/growth-source/promoter/addpromoterGovermentDetails",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("addGovernmentDetails", res);
		return res;
	});
};

//Add promoter contact details
export const addContactDetails = (bodyObj = {}) => {
	return post(
		API_URL + "/growth-source/promoter/addpromoterContactDetails",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("addContactDetails", res);
		return res;
	});
};

//Add promoter personal details
export const addPersonalDetails = (bodyObj = {}) => {
	return post(
		API_URL + "/growth-source/promoter/addpromoterPersonalDetails",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("addPersonalDetails", res);
		return res;
	});
};

//Add promoter professional details
export const addProfessionalDetails = (bodyObj = {}) => {
	return post(
		API_URL + "/growth-source/promoter/addpromoterProfessionalDetails",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("addProfessionalDetails", res);
		return res;
	});
};
