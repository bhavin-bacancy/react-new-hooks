import React from "react";
import { cloneDeep } from "lodash";
import { Select, Input } from "../../../Component/Input";
import { profile, public_url } from "../../../Utility/Constant";
import { getFormDetails } from "../../../Utility/Helper";
import {
	postAddLoanDetail,
	postAddProfessionalDetail,
	getIndustryList,
	getSectorList,
	getSubsectorList,
	getProfileList,
	getCinbyMobile,
	postGetSegmentList
} from "../../../Utility/Services/QDE";
import { te, ts } from "../../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";
import PersonalDetails from "./PersonalDetails";
import { postAddCoProfessionalDetail } from "../../../Utility/Services/CoApplicant";
const initForm = {
	sector: "",
	industry: "",
	subindustry: "",

	turnover: "",
	networth: "",
	ebitda: "",
	emiObligation: "",
	segment: "",
	errors: {
		sector: null,
		industry: null,
		subindustry: null,

		turnover: null,
		networth: null,
		ebitda: null,

		segment: null
	}
};
const initFormCin = {
	cin: "",
	sector: "",
	industry: "",
	subindustry: "",

	turnover: "",
	networth: "",
	ebitda: "",
	emiObligation: "",
	segment: "",

	// checkFlag: null,
	errors: {
		sector: null,
		industry: null,
		subindustry: null,

		turnover: null,
		networth: null,
		ebitda: null,
		// cin: null,

		segment: null
		// checkFlag: null
	}
};
const initLlpinForm = {
	llpin: "",
	sector: "",
	industry: "",
	subindustry: "",

	turnover: "",
	networth: "",
	ebitda: "",
	emiObligation: "",
	segment: "",
	errors: {
		sector: null,
		industry: null,
		subindustry: null,

		turnover: null,
		networth: null,
		ebitda: null,
		llpin: null,

		segment: null
	}
};
const initRegistrationForm = {
	registrationNumber: "",
	sector: "",
	industry: "",
	subindustry: "",

	turnover: "",
	networth: "",
	ebitda: "",
	emiObligation: "",
	segment: "",
	errors: {
		sector: null,
		industry: null,
		subindustry: null,

		turnover: null,
		networth: null,
		ebitda: null,
		registrationNumber: null,

		segment: null
	}
};

const initIndividualForm = {
	emptype: "",
	sector: "",
	industry: "",
	subindustry: "",
	profile: "",
	emiObligation: "",
	segment: "",
	errors: {
		sector: null,
		industry: null,
		subindustry: null,
		profile: null,
		emptype: null,

		segment: null
	}
};
const initNonFinanceial = {
	sector: "",
	industry: "",
	subindustry: "",
	profile: "",

	errors: {
		sector: null,
		industry: null,
		subindustry: null,
		profile: null
	}
};
const initSelfEmployed = {
	sector: "",
	industry: "",
	subindustry: "",
	profile: "",
	emptype: "",
	turnover: "",
	networth: "",
	ebitda: "",
	emiObligation: "",
	segment: "",
	errors: {
		sector: null,
		industry: null,
		subindustry: null,
		profile: null,
		emptype: null,
		turnover: null,
		networth: null,
		ebitda: null,

		segment: null
	}
};

const initSalriedForm = {
	sector: "",
	industry: "",
	subindustry: "",
	profile: "",
	emptype: "",
	empname: "",
	designation: "",
	department: "",
	emiObligation: "",
	segment: "",
	errors: {
		sector: null,
		industry: null,
		subindustry: null,
		profile: null,
		emptype: null,
		empname: null,
		designation: null,
		department: null,

		segment: null
	}
};

const empTypeList = [
	{ value: "Salaried", label: "Salaried" },
	{ value: "Self Employed", label: "Self Employed" }
];

const designationList = [
	{ value: "Manger", label: "Manger" },
	{ value: "Executive", label: "Executive" },
	{ value: "Engineer", label: "Engineer" }
];

const departmentList = [
	{ value: "IT", label: "IT" },
	{ value: "marketing", label: "marketing" },
	{ value: "finance", label: "finance" },
	{ value: "HR", label: "HR" }
];

const employersList = [
	{ value: "Bacancy", label: "Bacancy" },
	{ value: "Infochip", label: "Infochip" },
	{ value: "Technosoft", label: "Technosoft" }
];

class ProfessionalDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			ProfessionalDetailOpen: false,
			ProfeDetails: false,
			form: cloneDeep(initForm),
			sectorList: [],
			industryList: [],
			subindustryList: [],
			profileList: [],
			professionalFormLoading: false,
			saveForm: false,
			segmentList: [],
			componentDidUpdateCall: false
		};
	}

	onInputChange = (name, value, error = undefined) => {
		const { form } = this.state;
		form[name] = value;
		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		if (name == "emptype") {
			this.EmployeeTypeForm(value);
			//this.setState({ form });
		} else {
			this.setState({ form });
		}
	};
	// handle validation
	onInputValidate = (name, error) => {
		let { errors } = this.state.form;
		errors[name] = error;
		this.setState({
			form: { ...this.state.form, errors: errors }
		});
	};
	ProfessionalDetailOpen = () => {
		let { ProfessionalDetailOpen } = this.state;
		this.setState({ ProfessionalDetailOpen: !ProfessionalDetailOpen });
	};

	ProfeDetails = () => {
		let { ProfeDetails } = this.state;
		this.setState({ ProfeDetails: !ProfeDetails });
	};
	SaveCoForm = () => {
		let { saveForm, form, professionalFormLoading } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			delete obj.employeeType;
			obj.professionaldtlsflag = true;
			obj.custcode = match.params.custcode;
			obj.maritalstatus = leadDetail.maritalstatus;
			obj.fathersname = leadDetail.fathersname;
			obj.personaldtlsflag = leadDetail.personaldtlsflag;
			this.setState({ professionalFormLoading: true });
			postAddCoProfessionalDetail(obj).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, professionalFormLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, professionalFormLoading: false });
				} else {
					ts(res.data.message);
					this.setState(
						{
							saveForm: !saveForm,
							professionalFormLoading: false
						},
						() => {
							this.props.GetLeadDetail();
						}
					);
				}
			});
		} else {
			this.setState({ saveForm: !saveForm });
		}
	};
	SaveForm = () => {
		let { saveForm, form, professionalFormLoading } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			delete obj.checkFlag;
			obj.leadCode = params.leadcode;
			obj.mobileNumber = params.mobileno;
			obj.professionaldtlsflag = true;
			obj.mainapplicant = true;
			obj.custcode = ""
			this.setState({ professionalFormLoading: true });
			postAddProfessionalDetail(obj).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, professionalFormLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, professionalFormLoading: false });
				} else {
					ts(res.data.message);
					this.setState(
						{
							saveForm: !saveForm,
							professionalFormLoading: false
						},
						() => {
							this.props.GetLeadDetail();
						}
					);
				}
			});
		} else {
			this.setState({ saveForm: !saveForm });
		}
	};

	industryList = () => {
		getIndustryList().then(res => {
			if (res.error) {
				return;
			}
			this.setState({ industryList: res.data.data });
		});
	};

	sectorList = () => {
		getSectorList().then(res => {
			if (res.error) {
				return;
			}
			this.setState({ sectorList: res.data.sectorList });
		});
	};

	subSectorList = sector => {
		getSubsectorList(sector).then(res => {
			if (res.error) {
				return;
			}
			this.setState({ subindustryList: res.data.data });
		});
	};

	// GetCinbyMobile = () => {
	//   let { match } = this.props;
	//   getCinbyMobile(match.params.leadcode, match.params.mobileno).then(res => {
	//     if (res.error) return;
	//     if (res.data.error) {
	//       te(res.data.message);
	//     } else {
	//       this.setState({
	//         cin: res.data.cinnumber,
	//         checkFlag: (res.data.cinnumber === "N/A") ? false : true
	//       });
	//     }
	//   });
	// };

	profileList = () => {
		let { history } = this.props;
		let type = "";
		if (
			history.location.pathname.startsWith(
				public_url.co_applicant_update_profile
			)
		) {
			type = "RETAIL";
		} else {
			type = "SME";
		}
		getProfileList(type).then(res => {
			if (res.error) {
				return;
			}
			if (res.data.error) {
				te(res.data.message);
			} else {
				this.setState({ profileList: res.data.data });
			}
		});
	};

	OnCheckClick = () => {
		const { form, loading, ifscCodeCheck } = this.state;
		let { errors } = this.state.form;
		let { match, leadDetail } = this.props;
		getCinbyMobile(match.params.leadcode, match.params.mobileno).then(res => {
			if (res.error) return;
			if (res.data.error) {
				te(res.data.message);
			} else {
				// ts(res.data.message);
				this.setState({
					form: {
						...form,
						cin: res.data.cinnumber
					},
					checkFlag: res.data.cinnumber === "N/A" ? false : true
				});
			}
		});
	};

	componentDidMount() {
		this.FormUpdate();
		this.industryList();
		this.sectorList();
		this.profileList();
		this.GetSegmenList();
		// this.GetCinbyMobile();
		// this.subSectorList();
	}
	GetSegmenList = () => {
		postGetSegmentList().then(res => {
			if (res.error) {
				return;
			}
			if (res.data.error) {
				te(res.data.message);
			} else {
				this.setState({ segmentList: res.data.data });
			}
		});
	};
	componentDidUpdate(preProps, preState) {
		let { componentDidUpdateCall } = this.state;
		if (
			this.props.selectedEntity != preProps.selectedEntity ||
			(preProps.leadDetail != this.props.leadDetail && componentDidUpdateCall)
		) {
			this.setState({ componentDidUpdateCall: false });
			this.FormUpdate();
		}
	}
	EmployeeTypeForm = value => {
		let { form } = this.state;
		let { emptype } = form;
		if (value == "Salaried") {
			initSalriedForm.emptype = emptype;
			form = cloneDeep(initSalriedForm);
		} else {
			initSelfEmployed.emptype = emptype;
			form = cloneDeep(initSelfEmployed);
		}
		this.setState({
			form: form
		});
	};
	FormUpdate = () => {
		let { leadDetail, selectedEntity, history, checkData } = this.props;
		let { form } = this.state;
		if (selectedEntity == 4 || selectedEntity == 2 || selectedEntity == 3||selectedEntity == 7) {
			form = cloneDeep(initFormCin);
		} else if (selectedEntity == 5 ) {
			form = cloneDeep(initForm);
		} else if (selectedEntity == 8) {
			form = cloneDeep(initLlpinForm);
		} else if (selectedEntity == 1012) {
			form = cloneDeep(initRegistrationForm);
		} else if (selectedEntity == 1002) {
			form = cloneDeep(initRegistrationForm);
		} else if (selectedEntity == 1) {
			form = cloneDeep(initIndividualForm);
		}

		if (
			history.location.pathname.startsWith(
				public_url.co_applicant_update_profile
			) &&
			leadDetail.professionaldtlsflag &&
			leadDetail.emptype == "Salaried" &&
			checkData == "financial"
		) {
			form = cloneDeep(initSalriedForm);
		} else if (
			history.location.pathname.startsWith(
				public_url.co_applicant_update_profile
			) &&
			leadDetail.professionaldtlsflag &&
			leadDetail.emptype == "Self Employed" &&
			checkData == "financial"
		) {
			form = cloneDeep(initSelfEmployed);
		}
		if (
			history.location.pathname.startsWith(
				public_url.co_applicant_update_profile
			) &&
			checkData == "non-financial"
		) {
			form = cloneDeep(initNonFinanceial);
		}
		Object.keys(form).map(res => {
			if (leadDetail[res] || leadDetail[res] == 0) {
				form[res] = leadDetail[res];
			}
		});
		if (form.sector) {
			this.subSectorList(form.sector);
		}
		this.setState({
			form,
			saveForm: leadDetail.professionaldtlsflag ? true : false,
			checkFlag: form.cin != "N/A" && form.cin != "" ? true : false
		});
	};
	render() {
		let { selectedEntity, checkData } = this.props;
		let {
			ProfessionalDetailOpen,
			ProfeDetails,
			form,
			sectorList,
			industryList,
			profileList,
			subindustryList,
			professionalFormLoading,
			saveForm,
			segmentList
		} = this.state;
		let {
			sector,
			industry,
			emptype,
			department,
			designation,
			empname,
			subindustry,
			profile,
			typeOfEntity,
			turnover,
			networth,
			registrationNumber,
			ebitda,
			cin,
			errors,
			llpin,
			emiObligation,
			segment
			// checkFlag
		} = form;
		let { leadDetail, history } = this.props;
		let ProfessionalFormStatus = false;
		let loanDetailFormStatus = false;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && res != "emiObligation" &&  res != "cin" && !form[res]) return res;
		});
		let formStatus = getFormDetails(form, () => { });

		if (CheckForm.length == 0 && formStatus) {
			ProfessionalFormStatus = true;
		}
		return (
			<React.Fragment>
				<div className="gAccordion">
					<div
						className="gAccordion__title"
						onClick={this.ProfessionalDetailOpen}
					>
						<i class="icon">{ProfessionalDetailOpen ? "-" : "+"}</i>{" "}
						{selectedEntity == 1} Professional Details (Mandatory)
          </div>
					{ProfessionalDetailOpen && (
						<div className="gAccordion__body">
							{/* {selectedEntity == 1 && (
                <PersonalDetails
                  leadDetail={leadDetail}
                  GetLeadDetail={this.props.GetLeadDetail}
                />
              )} */}
							{
								<>
									<div class="row align-items-center mb-4">
										<div className="addressdetaillblock">
											<div class="pr-3" onClick={this.ProfeDetails}>
												<label class="mb-0 fw-700 text-primary2 colorGreen">
													{ProfeDetails ? "-" : "+"} Professional Details
                        </label>
											</div>

											<div class="flex-grow-1">
												<hr class="bg_lightblue" />
											</div>
										</div>
									</div>
									{ProfeDetails && (
										<>
											<div className="row align-items-center pr-lg-5 mt-3">
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) && checkData == "financial" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Employee Type
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
																<div class="select">
																	{!saveForm ? (
																		<Select
																			className="w-100 fs-12 create-lead-form-select"
																			options={empTypeList}
																			value={emptype}
																			title="employeeType"
																			name="emptype"
																			onChangeFunc={(name, value, error) => {
																				// if (value == null) {
																				//   error = `Please select Employee Type `;
																				// }
																				this.onInputChange(name, value, error);
																			}}
																			isReq={true}
																			error={errors.emptype}
																		// labelKey={"IndustryDesc"}
																		// valueKey={"IndustryCode"}
																		/>
																	) : (
																			emptype
																		)}
																</div>
															</div>
														</>
													) : (
														""
													)}
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) &&
													checkData == "financial" &&
													emptype == "Salaried" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Employer's Name
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
																<div class="select">
																	{!saveForm ? (
																		<Select
																			className="w-100 fs-12 create-lead-form-select"
																			options={employersList}
																			value={empname}
																			title="empoyerName"
																			name="empname"
																			onChangeFunc={(name, value, error) => {
																				this.onInputChange(name, value, error);
																			}}
																			isReq={true}
																			error={errors.empname}
																		/>
																	) : (
																			empname
																		)}
																</div>
															</div>
														</>
													) : (
														""
													)}
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) &&
													checkData == "financial" &&
													emptype == "Self Employed" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Turnover
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter Turnover"
																		name="turnover"
																		value={turnover}
																		onChangeFunc={(name, value, error) => {
																			if (value.match(/^\d*\.?\d*$/)) {
																				this.onInputChange(name, value, error);
																			}
																		}}
																		validationFunc={(name, error) => {
																			if (turnover == 0) {
																				error = "Turnover must be greater then 0";
																			}
																			this.onInputValidate(name, error);
																		}}
																		// validationFunc={this.onInputValidate}
																		//type="number"
																		reqType="Amount"
																		maxLength="16"
																		error={errors.turnover}
																		isReq={true}
																		title="Turnover"
																	/>
																) : (
																		turnover
																	)}
															</div>
														</>
													) : (
														""
													)}
											</div>
											<div className="row align-items-center pr-lg-5 mt-3">
												<div class="col-md-4 col-lg-2 d-flex align-items-center">
													<label class="fs-14 mb-0 gTextPrimary fw-500">
														Sector
                          </label>
												</div>
												<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
													<div class="select">
														{!saveForm ? (
															<Select
																className="w-100 fs-12 create-lead-form-select"
																options={sectorList}
																value={sector}
																title="Sector"
																name="sector"
																onChangeFunc={(name, value, error) => {
																	this.onInputChange(name, value, error);
																	this.subSectorList(value);
																	this.onInputChange("subindustry", "", error);
																}}
																isReq={true}
																labelKey="sectorName"
																valueKey="sectorCode"
																error={errors.sector}
															/>
														) : (
																sectorList.map(res => {
																	if (res.sectorCode == sector) {
																		return res.sectorName;
																	}
																})
															)}
													</div>
												</div>
												{(selectedEntity == 5 ||
													selectedEntity == 4 ||
													selectedEntity == 7 ||
													selectedEntity == 2 ||
													selectedEntity == 3 ||
													selectedEntity == 8 ||
													selectedEntity == 1012 ||
													selectedEntity == 1002) && (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Turnover
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter Turnover"
																		name="turnover"
																		value={turnover}
																		onChangeFunc={(name, value, error) => {
																			if (value.match(/^\d*\.?\d*$/)) {
																				this.onInputChange(name, value, error);
																			}
																		}}
																		validationFunc={(name, error) => {
																			if (turnover == 0) {
																				error =
																					"Turnover must be greater than  0";
																			}
																			this.onInputValidate(name, error);
																		}}
																		// validationFunc={this.onInputValidate}
																		//type="number"
																		reqType="Amount"
																		maxLength="16"
																		error={errors.turnover}
																		isReq={true}
																		title="Turnover"
																	/>
																) : (
																		turnover
																	)}
															</div>
														</>
													)}
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) &&
													checkData == "financial" &&
													emptype == "Self Employed" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Networth
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter Networth"
																		value={networth}
																		name="networth"
																		onChangeFunc={(name, value, error) => {
																			if (value.match(/^\d*\.?\d*$/)) {
																				this.onInputChange(name, value, error);
																			}
																		}}
																		validationFunc={(name, error) => {
																			if (networth == 0) {
																				error = "Networth must be greater then 0";
																			}
																			this.onInputValidate(name, error);
																		}}
																		// validationFunc={this.onInputValidate}
																		isReq={true}
																		reqType="Amount"
																		maxLength="16"
																		error={errors.networth}
																		title="Networth"
																	/>
																) : (
																		networth
																	)}
															</div>
														</>
													) : (
														""
													)}
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) &&
													checkData == "financial" &&
													emptype == "Salaried" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Department
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
																<div class="select">
																	{!saveForm ? (
																		<Select
																			className="w-100 fs-12 create-lead-form-select"
																			options={departmentList}
																			value={department}
																			title="department"
																			name="department"
																			onChangeFunc={(name, value, error) => {
																				this.onInputChange(name, value, error);
																			}}
																			isReq={true}
																			error={errors.department}
																		/>
																	) : (
																			department
																		)}
																</div>
															</div>
														</>
													) : (
														""
													)}
											</div>{" "}
											<div className="row align-items-center pr-lg-5 mt-3">
												<div class="col-md-4 col-lg-2 d-flex align-items-center">
													<label class="fs-14 mb-0 gTextPrimary fw-500">
														Industry
                          </label>
												</div>
												<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
													<div class="select">
														{!saveForm ? (
															<Select
																className="w-100 fs-12 create-lead-form-select"
																options={industryList}
																value={industry}
																title="Industry"
																name="industry"
																onChangeFunc={this.onInputChange}
																isReq={true}
																error={errors.industry}
																labelKey={"industry_desc"}
																valueKey={"industry_id"}
															/>
														) : (
																industryList.map(res => {
																	if (res.industry_id == industry) {
																		return res.industry_desc;
																	}
																})
															)}
													</div>
												</div>
												{(selectedEntity == 5 ||
													selectedEntity == 7 ||
													selectedEntity == 4 ||
													selectedEntity == 2 ||
													selectedEntity == 3 ||
													selectedEntity == 8 ||
													selectedEntity == 1012 ||
													selectedEntity == 1002) && (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Networth
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter Networth"
																		value={networth}
																		name="networth"
																		onChangeFunc={(name, value, error) => {
																			if (value.match(/^\d*\.?\d*$/)) {
																				this.onInputChange(name, value, error);
																			}
																		}}
																		validationFunc={(name, error) => {
																			if (networth == 0) {
																				error = "Networth must be greater than 0";
																			}
																			this.onInputValidate(name, error);
																		}}
																		// validationFunc={this.onInputValidate}
																		isReq={true}
																		reqType="Amount"
																		maxLength="16"
																		error={errors.networth}
																		title="Networth"
																	/>
																) : (
																		networth
																	)}
															</div>
														</>
													)}
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) &&
													checkData == "financial" &&
													emptype == "Self Employed" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	EBITDA
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter EBITDA"
																		value={ebitda}
																		name="ebitda"
																		onChangeFunc={(name, value, error) => {
																			if (value.match(/^-?\d*\.?\d*$/)) {
																				this.onInputChange(name, value, error);
																			}
																		}}
																		validationFunc={(name, error) => {
																			if (ebitda == 0) {
																				error = "EBITDA must be greater then  0";
																			}
																			this.onInputValidate(name, error);
																		}}
																		isReq={true}
																		reqType="numberPosNeg"
																		maxLength="16"
																		error={errors.ebitda}
																		title="EBITDA"
																	/>
																) : (
																		ebitda
																	)}
															</div>
														</>
													) : (
														""
													)}
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) &&
													checkData == "financial" &&
													emptype == "Salaried" ? (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Designation
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
																<div class="select">
																	{!saveForm ? (
																		<Select
																			className="w-100 fs-12 create-lead-form-select"
																			options={designationList}
																			value={designation}
																			title="designation"
																			name="designation"
																			onChangeFunc={(name, value, error) => {
																				this.onInputChange(name, value, error);
																			}}
																			isReq={true}
																			error={errors.designation}
																		/>
																	) : (
																			designation
																		)}
																</div>
															</div>
														</>
													) : (
														""
													)}
											</div>{" "}
											<div className="row align-items-center pr-lg-5 mt-3">
												<div class="col-md-4 col-lg-2 d-flex align-items-center">
													<label class="fs-14 mb-0 gTextPrimary fw-500">
														Sub-Industry
                          </label>
												</div>
												<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
													<div class="select">
														{!saveForm ? (
															<Select
																className="w-100 fs-12 create-lead-form-select"
																options={subindustryList}
																value={subindustry}
																title="Sub-Industry"
																name="subindustry"
																// onChangeFunc={this.onInputChange}
																onChangeFunc={(name, value, error) => {
																	this.onInputChange(name, value, error);
																}}
																isReq={true}
																error={errors.subindustry}
																labelKey="subSectorDesc"
																valueKey="subSectorCode"
															/>
														) : (
																// subindustry
																subindustryList &&
																subindustryList.map(res => {
																	if (res.subSectorCode == subindustry) {
																		return res.subSectorDesc;
																	}
																})
															)}
													</div>
												</div>
												{(selectedEntity == 5 ||
													selectedEntity == 7 ||
													selectedEntity == 4 ||
													selectedEntity == 2 ||
													selectedEntity == 3 ||
													selectedEntity == 8 ||
													selectedEntity == 1012 ||
													selectedEntity == 1002) && (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	EBITDA
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter EBITDA"
																		value={ebitda}
																		name="ebitda"
																		onChangeFunc={(name, value, error) => {
																			// ^-?[0-9]\d*(\.\d+)?$

																			if (value.match(/^-?\d*\.?\d*$/)) {
																				this.onInputChange(name, value, error);
																			}
																		}}
																		validationFunc={(name, error) => {
																			if (ebitda == 0) {
																				error = "EBITDA must be greater than 0";
																			}

																			this.onInputValidate(name, error);
																		}}
																		isReq={true}
																		reqType="numberPosNeg"
																		maxLength="16"
																		error={errors.ebitda}
																		title="EBITDA"
																	/>
																) : (
																		ebitda
																	)}
															</div>
														</>
													)}
												{this.props.checkData &&
													this.props.checkData == "financial" && (
														<React.Fragment>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 ">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	EMI obligations
                                </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter EMI Obligations"
																		value={emiObligation}
																		name="emiObligation"
																		onChangeFunc={(name, value, error) => {
																			// if (value.match(/^\d*\.?\d*$/)) {
																			//   this.onInputChange(name, value, error);
																			// }
																			this.onInputChange(name, value, error);
																		}}
																		validationFunc={(name, error) => {
																			this.onInputValidate(name, "");
																		}}
																		isReq={true}
																		reqType="number"
																		maxLength="16"
																		error={errors.emiObligation}
																		title="EMI obligations"
																	// disabled="true"
																	/>
																) : (
																		emiObligation
																	)}
															</div>
														</React.Fragment>
													)}
											</div>{" "}
											<div className="row align-items-center pr-lg-5 mt-3">
												{history.location.pathname.startsWith(
													public_url.co_applicant_update_profile
												) && (
														<>
															<div class="col-md-4 col-lg-2 d-flex align-items-center">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Profile
                              </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
																<div class="select">
																	{!saveForm ? (
																		<Select
																			className="w-100 fs-12 create-lead-form-select"
																			options={profileList}
																			value={profile}
																			title="Profile"
																			name="profile"
																			onChangeFunc={(name, value, error) => {
																				this.onInputChange(name, value, error);
																			}}
																			isReq={true}
																			error={errors.profile}
																			labelKey="profile_desc"
																			valueKey="profile_id"
																		/>
																	) : (
																			profileList.map(res => {
																				if (res.profile_id == profile) {
																					return res.profile_desc;
																				}
																			})
																		)}
																</div>
															</div>
														</>
													)}

												{selectedEntity == 8 && (
													<React.Fragment>
														<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
															<label class="fs-14 mb-0 gTextPrimary fw-500">
																LLPIN
                              </label>
														</div>
														<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
															{!saveForm ? (
																<Input
																	className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																	placeholder="Enter LLPIN"
																	value={llpin}
																	name="llpin"
																	onChangeFunc={(name, value, error) => {
																		// if (value.match(/^\d*\.?\d*$/)) {
																		// }
																		this.onInputChange(name, value, error);
																	}}
																	validationFunc={this.onInputValidate}
																	isReq={true}
																	reqType="alphaNumeric"
																	maxLength="16"
																	error={errors.LLPIN}
																	title="LLPIN"
																//disabled="true"
																/>
															) : (
																	llpin
																)}
														</div>
													</React.Fragment>
												)}
												{(selectedEntity == 4 ||
													selectedEntity == 2 ||
													selectedEntity == 3||selectedEntity==7) && (
														<React.Fragment>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	Cin
                              </label>
																{/* <span
                                className="fs-14 mb-0 gTextPrimary fw-500"
                                // onClick={() => !errors.cin && ( leadDetail.cin ? '' : this.OnCheckClick() )}
                                onClick={() =>
                                  !errors.cin &&
                                  !this.state.checkFlag &&
                                  this.OnCheckClick()
                                }
                              >
                                Verify
                              </span> */}
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter Cin"
																		value={cin === "N/A" ? "" : cin}
																		name="cin"
																		onChangeFunc={(name, value, error) => {
																			this.onInputChange(name, value, error);
																		}}
																		validationFunc={this.onInputValidate}
																		// isReq={true}
																		reqType="alphaNumeric"
																		maxLength="21"
																		// error={errors.cin}
																		title="Cin"
																		// disabled={(cin === "N/A") ? false : (cin === "N/A") ? true : false}
																		disabled={this.state.checkFlag}
																	/>
																) : // cin
																	cin === "N/A" ? (
																		""
																	) : (
																			cin ? cin : "-"
																		)}
															</div>
														</React.Fragment>
													)}
												{selectedEntity == 1012 && (
													<React.Fragment>
														<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
															<label class="fs-14 mb-0 gTextPrimary fw-500">
																Society Registration Number
                              </label>
														</div>
														<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
															{!saveForm ? (
																<Input
																	className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																	placeholder="Enter Society Registration Number"
																	value={registrationNumber}
																	name="registrationNumber"
																	onChangeFunc={(name, value, error) => {
																		// if (value.match(/^\d*\.?\d*$/)) {
																		//   this.onInputChange(name, value, error);
																		// }
																		this.onInputChange(name, value, error);
																	}}
																	validationFunc={this.onInputValidate}
																	isReq={true}
																	reqType="alphaNumeric"
																	maxLength="16"
																	error={errors.registrationNumber}
																	title="Society Registration Number"
																// disabled="true"
																/>
															) : (
																	registrationNumber
																)}
														</div>
													</React.Fragment>
												)}
												{selectedEntity == 1002 && (
													<React.Fragment>
														<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
															<label class="fs-14 mb-0 gTextPrimary fw-500">
																Trust Registration Number
                              </label>
														</div>
														<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
															{!saveForm ? (
																<Input
																	className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																	placeholder="Enter Trust Registration Number"
																	value={registrationNumber}
																	name="registrationNumber"
																	onChangeFunc={(name, value, error) => {
																		// if (value.match(/^\d*\.?\d*$/)) {
																		//   this.onInputChange(name, value, error);
																		// }
																		this.onInputChange(name, value, error);
																	}}
																	validationFunc={this.onInputValidate}
																	isReq={true}
																	reqType="alphaNumeric"
																	maxLength="16"
																	error={errors.registrationNumber}
																	title="Trust Registration Number"
																// disabled="true"
																/>
															) : (
																	registrationNumber
																)}
														</div>
													</React.Fragment>
												)}
											</div>
											{this.props.checkData != "non-financial" && (
												<div className="row align-items-center pr-lg-5 mt-3">
													<div class="col-md-4 col-lg-2 d-flex align-items-center">
														<label class="fs-14 mb-0 gTextPrimary fw-500">
															Segment
                            </label>
													</div>

													<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
														<div class="select">
															{!saveForm ? (
																<Select
																	className="w-100 fs-12 create-lead-form-select"
																	options={segmentList}
																	value={segment}
																	title="Segment"
																	name="segment"
																	onChangeFunc={(name, value, error) => {
																		this.onInputChange(name, value, error);
																	}}
																	isReq={true}
																	error={errors.segment}
																	labelKey="segment_desc"
																	valueKey="segment_code"
																/>
															) : (
																	// profile
																	// profileList.map(res => {
																	//   if (res.value == profile) return res.label;
																	// })
																	segmentList.map(res => {
																		if (res.segment_code == segment) {
																			return res.segment_desc;
																		}
																	})
																)}
														</div>
													</div>

													{this.props.checkData != "financial" && (
														<React.Fragment>
															<div class="col-md-4 col-lg-2 d-flex align-items-center mt-lg-0 mt-3">
																<label class="fs-14 mb-0 gTextPrimary fw-500">
																	EMI obligations
                                </label>
															</div>
															<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		placeholder="Enter EMI Obligations"
																		value={emiObligation}
																		name="emiObligation"
																		onChangeFunc={(name, value, error) => {
																			// if (value.match(/^\d*\.?\d*$/)) {
																			//   this.onInputChange(name, value, error);
																			// }
																			this.onInputChange(name, value, error);
																		}}
																		validationFunc={(name, error) => {
																			this.onInputValidate(name, "");
																		}}
																		isReq={true}
																		reqType="number"
																		maxLength="16"
																		error={errors.emiObligation}
																		title="EMI obligations"
																	// disabled="true"
																	/>
																) : (
																		emiObligation
																	)}
															</div>
														</React.Fragment>
													)}
												</div>
											)}
											<div class="row justify-content-end mt-4 mx-0">
												{!saveForm && leadDetail.professionaldtlsflag && (
													<button
														disabled=""
														class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
														onClick={() => {
															this.setState({ componentDidUpdateCall: true });
															this.props.GetLeadDetail();
														}}
													>
														Cancel
                          </button>
												)}
												<button
													disabled={
														(!saveForm && !ProfessionalFormStatus) ||
														professionalFormLoading
													}
													class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16  ${ProfessionalFormStatus &&
														"btn-green"}`}
													// class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16  ${ !saveForm && !ProfessionalFormStatus &&
													//   "btn-green"}`}
													onClick={e => {
														if (this.props.selectedEntity == 1) {
															this.setState({
																componentDidUpdateCall: saveForm ? false : true
															});
															this.SaveCoForm(e);
														} else {
															this.setState({
																componentDidUpdateCall: saveForm ? false : true
															});
															this.SaveForm(e);
														}
													}}
												>
													{saveForm
														? "Edit"
														: professionalFormLoading
															? "Saving..."
															: "Save"}
												</button>
											</div>
										</>
									)}
								</>
							}
						</div>
					)}
						<hr class="bg_lightblue border-0 h-1px" />
				</div>
			
			</React.Fragment>
		);
	}
}
export default withRouter(ProfessionalDetail);
