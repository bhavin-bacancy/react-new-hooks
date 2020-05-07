import { post, get } from "../httpInterceptor";
import { API_URL } from "../Config";

// get all insurance type 
export const getAllInsuranceType = () => {
	return post(
		`${API_URL}/growth-source/insurance/getInsuranceType`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getAllInsuranceType", res);
		return res;
	});
};

//get all Insurance Detail by lead code
export const getInsuranceDetail = (leadCode) => {
	return post(
		`${API_URL}/growth-source/insurance/getInsuranceByLeadCode?leadcode=${leadCode}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getInsuranceDetail", res);
		return res;
	});
};

// get insurance provider by type
export const getInsuranceProviderByType = (insuranceType) => {
	return post(
		`${API_URL}/growth-source/insurance/getInsuranceProviderByType?insuranceType=${insuranceType}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getInsuranceProviderByType", res);
		return res;
	});
};

//get Insurance link collateral
export const getAllCollateralCodeAndTypeByLeadCode = (leadCode) => {
	return post(
		`${API_URL}/growth-source/collateral/getAllCollateralCodeAndTypeByLeadCode?leadCode=${leadCode}`,
		{},
		false,
		false,
		true
	).then(res => {
		console.log("getAllCollateralCodeAndTypeByLeadCode", res);
		return res;
	});
};

//Add insurance details
export const addInsurance = (bodyObj = {}) => {
	return post(
		API_URL + "/growth-source/insurance/addInsurance",
		bodyObj,
		false,
		false,
		true
	).then(res => {
		console.log("addInsurance", res);
		return res;
	});
};