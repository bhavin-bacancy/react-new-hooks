import React, { useState, useEffect } from "react";
import { Select, Input } from "../../../Component/Input";
import { getFormDetails } from "../../../Utility/Helper";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { cloneDeep } from "lodash";
import { public_url } from "../../../Utility/Constant";
import { Link } from "react-router-dom";
import moment from "moment";
import { ts, te } from "../../../Utility/ReduxToaster";
import { getAllInsuranceType, getInsuranceProviderByType, getAllCollateralCodeAndTypeByLeadCode, addInsurance } from "../../../Utility/Services/Insurance"

const initForm = {
	typeOfInsurance: "",
	policyNumber: "",
	insuranceProvider: "",
	linkCollateral: "",
	sumAssured: "",
	expiryDate: "",
	insuranceCode: "",
	loanNumber: "",
	errors: {
		policyNumber: null,
		typeOfInsurance: null,
		insuranceProvider: null,
		linkCollateral: null,
		sumAssured: null,
		expiryDate: null
	}
};

export const InsuranceDetails = (props) => {
	const [state, setState] = useState({
		form: cloneDeep(initForm),
		insuranceType: "Existing",
		saveForm: false,
		loading: false,
		typeOption: [],
		providerOption: [],
		isCollateralDisable: "",
		selectedInsurance: "",
		insuranceSelectedResponse: ""
	});
	let { match } = props;
	let { params } = match;

	const [collateralState, collateralUpdate] = useState({ collateralOption: [] })
	let { collateralOption } = collateralState

	useEffect(() => {
		getInsuranceType();
	}, [props.insuranceDetail]);

	const getInsuranceType = () => {
		getAllInsuranceType().then(res => {
			if (res.error) return;
			setState({
				...state, typeOption: res.data.data,
			});
		});
	}

	const getLinkCollateral = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode
		getAllCollateralCodeAndTypeByLeadCode(leadCode).then(res => {
			if (res.error) return;
			collateralUpdate({ collateralOption: res.data.data });
		});
	}

	const GetInsuranceProvider = (typeOfInsurance) => {
		getInsuranceProviderByType(typeOfInsurance ? typeOfInsurance : "").then(res => {
			if (res.error) return;
			setState({ ...state, providerOption: res.data.data });
		});
	}

	const getInsuranceProvider = () => {
		let { form } = state;
		let { typeOfInsurance } = form;
		typeOfInsurance &&
			getInsuranceProviderByType(typeOfInsurance ? typeOfInsurance : "").then(res => {
				if (res.error) return;
				setState({ ...state, providerOption: res.data.data });
			});
	}

	let { form, insuranceType, saveForm, loading, typeOption, providerOption, isCollateralDisable } = state;
	let { errors, typeOfInsurance, policyNumber, insuranceProvider, linkCollateral, sumAssured, expiryDate, loanNumber, id } = form;

	let { insuranceDetail } = props;

	const onInputChange = (name, value, error = undefined) => {
		let { form, isCollateralDisable } = state;
		form[name] = value;
		if (name === "typeOfInsurance") {
			if (value) {
				if (['Life Insurance', 'Life Credit Insurance', 'Non Life Credit Insurance'].includes(value)) {
					if (error !== undefined) {
						let { errors } = form;
						errors[name] = error;
					}
					delete form.linkCollateral
					delete form.errors.linkCollateral
					form = { ...form }
					state.isCollateralDisable = true
					getInsuranceProvider();
					getLinkCollateral();
				}
				else {
					form.linkCollateral = ""
					form.errors.linkCollateral = null
					form = { ...form }
					state.isCollateralDisable = false
				}
				getInsuranceProvider();
				getLinkCollateral();
			}
			else {
				form['insuranceProvider'] = ""
			}
		}

		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		setState({ ...state, form });
	};

	const onTypeChanged = (e) => {
		setState({
			...state, form: { ...state.form },
			insuranceType: e.currentTarget.value
		});
	};

	const AddAnotherInsurance = () => {
		setState({
			...state,
			form: cloneDeep(initForm),
			insuranceType: "Existing", saveForm: false,
			loading: false,
			isCollateralDisable: true,
			selectedInsurance: ""
		})
	}

	const onInputValidate = (name, error) => {
		let { errors } = state.form;
		errors[name] = error;
		setState({ ...state, form: { ...state.form, errors: errors } });
	};

	let insuranceDetailFormStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (res != "errors" && res != "insuranceCode" && res != "loanNumber" && !form[res]) return res;
	});
	let formStatus = getFormDetails(form, () => { });

	if (CheckForm.length == 0 && formStatus) {
		insuranceDetailFormStatus = true;
	}

	const onAddInsuranceDetail = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode
		setState({ ...state, loading: true });
		let objForm = cloneDeep(form);
		let date = new Date(expiryDate).getTime();
		delete objForm.errors;
		objForm.expiryDate = date;
		objForm.linkCollateral = linkCollateral ? linkCollateral : null;
		objForm.leadCode = leadCode;
		objForm.loanNumber = loanNumber;
		objForm.createdDate = new Date();
		objForm.updatedDate = new Date();
		objForm.createdBy = localStorage.getItem("employeeId");
		objForm.updatedBy = localStorage.getItem("employeeId");
		objForm.ipaddress = null;
		addInsurance(objForm).then(res => {
			if (res.error) {
				return;
			}
			if (res.data.error) {
				te(res.data.message);
			} else {
				ts(res.data.message)
				props.getInsuranceDetails();
				setState({ ...state, loading: false, saveForm: true })
				onInsuranceClick(res.data.data)
			}
		});
	};

	const onInsuranceClick = response => {
		if (!response) {
			props.history.push(`${public_url.co_applicant_status}/${props.match.params.leadcode}`);
		}
		if (response.id) {
			form.id = response.id;
			state.selectedInsurance = response.id;
			state.insuranceSelectedResponse = response
			state.saveForm = true
			setState({
				...state
			});
		}

		Object.keys(form).map(res => {
			if (response[res]) {
				if (res == "typeOfInsurance") {
					GetInsuranceProvider(response[res])
					if (['Life Insurance', 'Life Credit Insurance', 'Non Life Credit Insurance'].includes(response.typeOfInsurance)) {
						delete form.linkCollateral
						delete form.errors.linkCollateral
						state.isCollateralDisable = true
						getLinkCollateral();
					}
					else {
						form.linkCollateral = response.linkCollateral
						form.errors.linkCollateral = null
						state.isCollateralDisable = false
					}
					getLinkCollateral();
				}
				form[res] = response[res];
			}
		});
		setState({
			...state
		});
	};

	const settings = {
		focusOnSelect: true,
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 1,
		speed: 500
	};

	return (
		<>
			<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div class="d-flex justify-content-start align-items-center">
						<section class="py-4 position-relative bg_l-secondary w-100 ">
							<div class="pb-5 bg-white">
								<div className="row">
									<div className="col-lg-12 mt-3 ">
										<span className="font-weight-bold text-primary ml-5 mt-3">
											{" "}
											{insuranceDetail && insuranceDetail.applicant && insuranceDetail.applicant.firmName ? insuranceDetail.applicant.firmName : insuranceDetail.applicant && insuranceDetail.applicant.customerName}{" "}
										</span>
										<span className="text-primary ml-3 mt-3">
											{" "}
											( {insuranceDetail && insuranceDetail.applicant && insuranceDetail.applicant.typeOfEntity} )
										</span>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-8 mt-3 ml-3 ">
										<div className="ml-4">
											<Slider {...settings}>
												{
													insuranceDetail.data && insuranceDetail.data.map((val, index) => (
														<div key={index} className="pl-2 pr-2">
															<button onClick={() => onInsuranceClick(val)} className={`btn btn-secondary d-flex justify-content-center w-100 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${state.selectedInsurance == val.id && "btn-green"} `}>
																{val.insuranceCode}
															</button>
														</div>
													))
												}
											</Slider>
										</div>
									</div>
									{saveForm &&
										<div className="font-weight-bold col-lg-3 mt-4 ml-4 text-primary text-right ">
											<a className="cursor-pointer" onClick={AddAnotherInsurance}>+ Add another Insurance</a>
										</div>
									}
								</div>
								<div className="row">
									<div className="col-lg-6 mt-3 ml-5 ">
										<span className="text-secondary font-weight-bold">
											Insurance details
                    </span>
									</div>
								</div>

								<div className="insurance-form">
									<div className="row insurance-height">
										<div className="col-lg-6 mt-3 mt-3 ">
											<div className="row">
												{!saveForm ? (
													<>
														<div className="col-lg-4" />
														<div className="col-lg-6">
															<div class="justify-content-center pb-3">
																<div class="c_radiobtn w-50 d-flex ">
																	<div className="mr-4">
																		<input
																			type="radio"
																			id="existing"
																			name="radio-group"
																			value="Existing"
																			onChange={onTypeChanged}
																			checked={insuranceType === "Existing"}
																		/>
																		<label htmlFor="existing">Existing</label>
																	</div>
																	<div>
																		<input
																			type="radio"
																			id="new"
																			name="radio-group"
																			value="New"
																			checked={insuranceType == "New" && true}
																			onChange={onTypeChanged}
																			checked={insuranceType === "New"}
																			disabled={true}
																		/>
																		<label htmlFor="new">New</label>
																	</div>
																</div>
															</div>
														</div>
													</>
												) : (
														<span className="ml-3 text-primary mb-4 font-weight-bold">{insuranceType}</span>
													)}
											</div>

											<div className="row">
												<div className="col-lg-4">
													<label className="fs-14 mb-0 gTextPrimary fw-500 {!saveForm ? 'mt-7' : ''}">
														Insurance Type
                        </label>
												</div>
												{!saveForm ? (
													<div className="col-lg-6">
														<Select
															className="w-100 fs-12 create-lead-form-select"
															options={typeOption}
															value={typeOfInsurance}
															title="Insurance Type"
															name="typeOfInsurance"
															onChangeFunc={(name, value, error) => {
																onInputChange(name, value, error);
															}}
															isReq={true}
															error={errors.typeOfInsurance}
															labelKey="typeOfInsurance"
															valueKey="typeOfInsurance"
														/>
													</div>
												) : (
														<div className="col-lg-8">
															{typeOfInsurance}
														</div>
													)}
											</div>
											<div className={!saveForm ? 'row mb-3' : 'row'}>
												<div className="col-lg-4 {!saveForm ? 'mt-7' : ''}">
													<label className="fs-14 mb-0 gTextPrimary fw-500">
														Policy No.
                        </label>
												</div>
												<div className="col-lg-6">
													{!saveForm ? (
														<Input
															className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
															validationFunc={onInputValidate}
															onChangeFunc={(name, value, error) => {
																onInputChange(name, value.toUpperCase(), error);
															}}
															value={policyNumber}
															name="policyNumber"
															title="Policy Number"
															reqType="alphaNumeric"
															isReq={true}
															maxLength={15}
															minLength={4}
															error={errors.policyNumber}
															placeholder="Type Policy Number"
														/>
													) : (
															policyNumber
														)}
												</div>
											</div>

											<div className="row">
												<div className="col-lg-4">
													<label className="fs-14 mb-0 gTextPrimary fw-500 {!saveForm ? 'mt-7' : ''}">
														Insurance Provider
                        </label>
												</div>
												<div className="col-lg-6">
													{!saveForm ? (
														<Select
															className="w-100 fs-12 create-lead-form-select"
															value={insuranceProvider}
															options={providerOption}
															title="Insurance Provider"
															name="insuranceProvider"
															onChangeFunc={(name, value, error) => {
																onInputChange(name, value, error);
															}}
															isReq={true}
															error={errors.insuranceProvider}
															disabled={typeOfInsurance ? false : true}
															labelKey="insuranceProvider"
															valueKey="insuranceProvider"
														/>
													) : (
															insuranceProvider
														)}
												</div>
											</div>
											<div className="row">
												<div className="col-lg-4">
													<label className="fs-14 mb-0 gTextPrimary fw-500 {!saveForm ? 'mt-7' : ''}">
														Link Collateral
                        </label>
												</div>
												<div className="col-lg-6">
													{!saveForm ? (
														<Select
															className="w-100 fs-12 create-lead-form-select"
															value={linkCollateral}
															options={collateralOption}
															title="Link Collateral"
															name="linkCollateral"
															disabled={isCollateralDisable}
															onChangeFunc={(name, value, error) => {
																onInputChange(name, value, error);
															}}
															isReq={true}
															error={errors.linkCollateral}
															labelKey="linkCollateral"
															valueKey="collateralCode"
														/>
													) : (
															linkCollateral ? linkCollateral : <span className="ml-5">-</span>
														)}
												</div>
											</div>

											<div className={!saveForm ? 'row mb-3' : 'row'}>
												<div className="col-lg-4">
													<label className="fs-14 mb-0 gTextPrimary fw-500 {!saveForm ? 'mt-7' : ''}">
														Sum Insured
                        </label>
												</div>
												<div className="col-lg-6">
													<div className="d-flex w-100 ruppies-block">
														{!saveForm ? (
															<>
																<i className="fa fa-inr ruppies-icon fa-lg" aria-hidden="true"></i>
																<Input
																	className="form-control w-100 border-rounded-pill fs-14 p-2 pl-4 pr-2"
																	validationFunc={onInputValidate}
																	onChangeFunc={(name, value, error) => {
																		onInputChange(name, value, error);
																	}}
																	value={sumAssured}
																	name="sumAssured"
																	title="Sum Insured"
																	isReq={true}
																	reqType="number"
																	maxLength={16}
																	error={errors.sumAssured}
																	placeholder="Type Sum Insured"
																/>
															</>
														) : (
																<>
																	<i className="fa fa-inr ruppies-icon mr-1" aria-hidden="true"></i><span>{sumAssured}</span>
																</>
															)}
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-lg-4">
													<label className="fs-14 mb-0 gTextPrimary fw-500 {!saveForm ? 'mt-7' : ''}">
														Expiry Date
                        </label>
												</div>
												<div className="col-lg-6">
													{!saveForm ? (
														<Input
															name="expiryDate"

															className="form-control border-rounded-pill fs-14 p-2 pl-4"
															onChangeFunc={(name, value, error) => {
																onInputChange(name, value, error);
															}}
															title="Expiry Date"
															type="date"
															isReq={true}
															error={errors.expiryDate}
															validationFunc={(name, error) => {
																if (
																	moment(new Date()).format("YYYY-MM-DD") <= moment(new Date(expiryDate)).format("YYYY-MM-DD")
																) {

																} else {
																	error = "Please enter valid date";
																}
																onInputValidate(name, error);
															}}
															value={moment(expiryDate).format(
																"YYYY-MM-DD"
															)}
															min={moment(new Date()).format("YYYY-MM-DD")}
														/>
													) : (
															moment(expiryDate).format("YYYY-MM-DD")
														)}
												</div>
											</div>

										</div>
									</div>

									<div className="row mt-3">
										<div className="col-sm-12">
											<div className="text-right">
												{!saveForm && (
													<button className="btn btn-secondary btn-rounded ls-1 mb-2 cursor-pointer fs-16 mr-3 btn-green"
														onClick={() => {
															onInsuranceClick(state.insuranceSelectedResponse)
														}}
													>
														Cancel
                    			</button>
												)}
												{!saveForm && (
													<button
														disabled={!insuranceDetailFormStatus}
														className={`btn btn-secondary btn-rounded ls-1 mb-2 cursor-pointer mr-0 fs-16 ${insuranceDetailFormStatus &&
															"btn-green"}`}
														onClick={e => {
															onAddInsuranceDetail(e);
														}}>
														{loading ? "Saving..." : "Save"}
													</button>
												)}
												{saveForm && (
													<button
														className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mb-2 fs-16 ${"btn-green"}`}
														onClick={() => {
															setState({ ...state, saveForm: false });
														}}>
														Edit
                    			</button>
												)}

												<hr class="bg_lightblue border-0 h-1px" />
												<div className="row mt-4">
													<div className="col-sm-12">
														<div className="text-right">
															<Link to={`${public_url.collateral_document_upload}/${params.leadcode}/${props && props.insuranceDetail && props.insuranceDetail.applicant && props.insuranceDetail.applicant.mobileNumber}`}>
																<button className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 btn-green `}>
																	Next
                    						</button>
															</Link>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
