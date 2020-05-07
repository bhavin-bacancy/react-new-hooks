import React from "react";
import { Select, Input } from "../../Component/Input";
import { cloneDeep } from "lodash";
import moment from "moment";
import {
	postEntity,
	postGender,
	postSalution,
	getAllState,
	postPanGstVerify,
	postAddPanDetail,
	getAddressByGstNumber
} from "../../Utility/Services/QDE";
import { te, ts } from "../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";
import { getFormDetails, entityArray } from "../../Utility/Helper";
import { public_url } from "../../Utility/Constant";
const initEntityForm = { typeOfEntity: "", errors: { entity: null } };
let panForm1 = {
	panNumber: "",
	dateOfBirth: "",
	gender: "",
	salutation: "",
	firmName: "",
	errors: {
		dateOfBirth: null,
		gender: null,
		salutation: null,
		panNumber: null,
		firmName: null
	}
};
let panForm2 = {
	panNumber: "",
	dateOfBirth: "",
	errors: {
		panNumber: null,
		dateOfBirth: null
	}
};
let initGstForm = { gstNumber: "", errors: { gstNumber: null } };
class PanGstNonIndividual extends React.Component {
	constructor() {
		super();
		this.state = {
			panOpen: false,
			panGstOpen: false,
			gstOpen: false,
			entityForm: cloneDeep(initEntityForm),
			panForm: cloneDeep(panForm1),
			entity: [],
			saveEntity: false,
			genderList: [],
			salutationList: [],
			verifyLoading: false,
			checkData: "",
			gstForm: cloneDeep(initGstForm),
			gstArray: [],
			verifyGst: false,
			verifyPan: false,
			saveGst: false,
			saveDetail: false,
			saveDetailLoading: false,
			saveDetailStatus: false,
			updateLoading: false,
		};
	}

	SaveDetail = () => {
		let { entityForm, panForm, gstForm, entity } = this.state;
		let { match, selectedEntity, leadDetail } = this.props;
		this.setState({ saveDetailLoading: true });
		let entityName = "";
		entity.map(res => {
			if (res.id == entityForm.typeOfEntity) {
				entityName = res.subcat_desc;
			}
		});

		postAddPanDetail({
			typeOfEntity: entityName,
			panNumber: panForm.panNumber,
			dateOfBirth: moment(panForm.dateOfBirth).format("YYYY/MM/DD"),
			customerName: panForm.panName,
			gstNumber: gstForm.gstNumber,
			leadCode: match.params.leadcode,
			pansectionflag: true,
			mobileNumber: match.params.mobileno,
			gender: panForm.gender,
			salutation: panForm.salutation,
			firmName: panForm.firmName,
			defaultbranch: localStorage.getItem("employeeId"),
			mainapplicant: leadDetail.mainapplicant,
			custcode: leadDetail.custcode
		}).then(res => {
			if (res.error) {
				this.setState({ saveDetailLoading: false });
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				this.setState({ saveDetailLoading: false });
			} else {
				this.props.OnChange(
					"selectedEntity",
					selectedEntity == 1 ? this.state.checkData : entityForm.typeOfEntity
				);

				this.setState(
					{
						saveDetailLoading: false,
						saveDetailStatus: true,
						updateLoading: true
					},
					() => {
						setTimeout(async () => {
							await this.props.GetLeadDetail();
							this.setState({ updateLoading: false }, () =>
								ts(res.data.message)
							);
						}, 10000);
					}
				);
			}
		});
	};

	panOpen = () => {
		let { panOpen } = this.state;
		this.setState({ panOpen: !panOpen });
	};
	gstOpen = () => {
		let { gstOpen } = this.state;
		this.setState({ gstOpen: !gstOpen });
	};
	panGstOpen = () => {
		let { panGstOpen } = this.state;
		this.setState({ panGstOpen: !panGstOpen });
	};
	onInputChange = (name, value, error = undefined, formName) => {
		this.state[formName][name] = value;
		if (error !== undefined) {
			let { errors } = this.state[formName];
			this.state[formName].errors[name] = error;
		}
		if (name == "typeOfEntity") {
			this.panFormChange(value);
		}
		this.setState({ [formName]: this.state[formName] });
	};
	panFormChange = value => {
		this.props.OnChange("selectedEntity", value);
		if (value == "5" || value == "1") {
			this.setState({
				panForm: cloneDeep(panForm1),
				verifyPan: false,
				gstForm: cloneDeep(initGstForm),
				saveGst: false,
				saveDetailStatus: false
			});
		} else {
			this.setState({
				panForm: cloneDeep(panForm2),
				verifyPan: false,
				gstForm: cloneDeep(initGstForm),
				saveGst: false,
				saveDetailStatus: false
			});
		}
	};
	VerifyPanGST = () => {
		let { panForm } = this.state;
		let { leadDetail, selectedEntity } = this.props;
		let obj = {
			pan: panForm.panNumber,
			dateOfBirth: moment(panForm.dateOfBirth).format("DD/MM/YYYY"),
			custCategoryCode: selectedEntity == 1 ? "RETAIL" : "SME",
			mobileNumber: leadDetail.mobileNumber
		};
		this.setState({ verifyLoading: true, saveGst: false });
		postPanGstVerify(obj).then(res => {
			if (res.error) return;
			if (res.data.error) {
				te("Please try again");
				this.setState({ verifyLoading: false, verifyPan: false });
			} else {
				if (
					res.data["Wrapper Response"] &&
					res.data["Wrapper Response"].panResponse &&
					res.data["Wrapper Response"].panResponse.panStatus != "Invalid" &&
					!res.data.IsDuplicate
				) {
					this.setState({
						verifyLoading: false,
						panForm: {
							...this.state.panForm,
							panName:
								res.data["Wrapper Response"] &&
								res.data["Wrapper Response"].panResponse &&
								res.data["Wrapper Response"].panResponse.panName
						},
						gstArray: res.data["GST List"].GSTNoList
							? res.data["GST List"].GSTNoList
							: [],
						//gstArray: [],
						saveGst: res.data["GST List"].GSTNoList
							? res.data["GST List"].GSTNoList.length > 0
								? false
								: true
							: true,
						//saveGst: [].length > 0 ? false : true,

						verifyPan: true
					});
				} else {
					this.setState({
						verifyLoading: false,
						verifyPan: false
					});
					if (res.data.IsDuplicate) {
						te("Pan number is already associated with us");
					} else {
						te("Invalid Pan Details");
					}
				}
			}
		});
	};

	onInputValidate = (name, error, formName) => {
		this.state[formName].errors[name] = error;
		this.setState({ [formName]: { ...this.state[formName] } });
	};

	componentDidMount() {
		if (this.props.selectedEntity != 1) this.GetEntity();
		this.GetGender();
		this.GetSalution();
		if (this.props.selectedEntity == 1) {
			this.FormUpdate("panForm");
			this.FormUpdate("entityForm");
			this.FormUpdate("gstForm");
			this.setState({
				entityForm: {
					typeOfEntity: "1",
					errors: { ...this.state.entityForm.errors }
				}
			});
		}
		else {
			this.FormUpdate("panForm");
			this.FormUpdate("entityForm");
			this.FormUpdate("gstForm");
		}
	}

	FormUpdate = name => {
		let { leadDetail, selectedEntity } = this.props;
		let { panForm, entity } = this.state;
		Object.keys(this.state[name]).map(res => {

			if (leadDetail[res]) {
				this.state[name][res] = leadDetail[res];
			}
		});
		if (leadDetail.typeOfEntity) {
			let entityId = "";
			entity &&
				entity.map(res => {
					if (leadDetail.typeOfEntity == res.subcat_desc) {
						entityId = res.id;
					}
				});
			this.props.OnChange(
				"selectedEntity",
				selectedEntity == 1 ? leadDetail.financialstatus : entityId
			);
		}
		if (name == "entityForm") {
			let entityId = "";
			entity &&
				entity.map(res => {
					if (leadDetail.typeOfEntity == res.subcat_desc) {
						entityId = res.id;
					}
				});
			this.props.OnChange(
				"selectedEntity",
				selectedEntity == 1 ? leadDetail.financialstatus : entityId
			);
			leadDetail &&
				this.props.OnChange("checkData", leadDetail.financialstatus);
			this.state[name].typeOfEntity = selectedEntity == 1 ? 1 : entityId;
		}
		if (name == "panForm" && leadDetail && leadDetail.customerName) {
			this.state[name].panName = leadDetail.customerName;
		}

		if (this.props.selectedEntity == 1) {
			this.state.checkData = leadDetail.financialstatus;
		}
		this.setState({
			[name]: this.state[name],
			saveDetailStatus: leadDetail.pansectionflag ? true : false,
			saveEntity: leadDetail.pansectionflag ? true : false,
			verifyGst: leadDetail.pansectionflag ? true : false,
			verifyPan: leadDetail.pansectionflag ? true : false,
			saveGst: leadDetail.pansectionflag ? true : false
		});
	};
	GetEntity = () => {
		let { leadDetail, entity } = this.props;
		postEntity().then(res => {
			if (res.error) return;
			if (leadDetail.typeOfEntity) {
				let entityId = "";
				entity &&
					entity.map(res => {
						if (leadDetail.typeOfEntity == res.subcat_desc) {
							entityId = res.id;
						}
					});
				this.props.OnChange("selectedEntity", entityId);
			}
			let entityArr = entityArray(res.data.data);

			this.setState({ entity: entityArr }, () => {
				this.FormUpdate("entityForm");
			});
		});
	};
	GetSalution = () => {
		postSalution().then(res => {
			if (res.error) return;
			this.setState({ salutationList: res.data.data });
		});
	};
	GetGender = () => {
		postGender().then(res => {
			if (res.error) return;
			this.setState({ genderList: res.data.data });
		});
	};

	SaveEntity = value => {
		let { saveEntity, entityForm, panForm, gstForm, checkData } = this.state;
		if (saveEntity) {
			if (entityForm.typeOfEntity == 1) {
				checkData = "";
			} else {
				entityForm = cloneDeep(initEntityForm);
			}
			this.panFormChange(value ? value : "");
			this.ResetGst();
		}
		this.setState({
			checkData,
			saveEntity: !saveEntity,
			entityForm,
			saveDetailStatus: false
		});
	};

	ResetEnityInindividual = () => {
		let {
			saveEntity,
			entityForm,
			panForm,
			gstForm,
			checkData,
			verifyPan
		} = this.state;
		if (saveEntity) {
			if (entityForm.typeOfEntity == 1) {
				checkData = "";
			} else {
				entityForm = cloneDeep(initEntityForm);
			}

			this.ResetGst();
		}
		this.setState({
			panForm: cloneDeep(panForm1),
			checkData,
			saveEntity: !saveEntity,
			entityForm,
			saveDetailStatus: false,
			verifyPan: false
		});
	};
	componentDidUpdate(preProps, preState) {
		if (preProps.leadDetail != this.props.leadDetail) {
			this.FormUpdate("panForm");
			this.FormUpdate("entityForm");
			this.FormUpdate("gstForm");
		}
	}
	handleCheckChange = (changeEvent, value) => {
		if (changeEvent.target.checked) {
			this.setState({ checkData: changeEvent.target.value });
			this.props.OnChange("checkData", changeEvent.target.value);
			this.props.OnChange("selectedEntity", changeEvent.target.value);
		} else {
			this.setState({ checkData: "" });
			this.props.OnChange("checkData", "");
		}
	};

	ResetCommonData = () => {
		let obj = {
			...this.props.commonData,
			addressline1: "",
			pincode: ""
		};
		// if (this.props.commonData.addressline1) {this.props.GetLeadDetail()};
		this.props.OnChange("commonData", obj);
	};
	ResetGst = () => {
		this.ResetCommonData();
		this.setState({ gstForm: cloneDeep(initGstForm), saveGst: false });
	};
	SaveGST = () => {
		let { saveGst, gstForm } = this.state;
		this.GetAddressByGst(gstForm.gstNumber);
		//this.setState({ saveGst: !saveGst });
	};
	GetAddressByGst = gstNumber => {
		this.setState({ gstLoading: true });
		getAddressByGstNumber(gstNumber).then(res => {
			if (res.error) {
				return;
			}
			if (res.data.error == "false") {
				let obj = {
					...this.props.commonData,
					addressline1: res.data.data[0].perAddress,
					pincode: res.data.data[0].perAddresspincode
						? res.data.data[0].perAddresspincode
						: ""
				};
				this.props.OnChange("commonData", obj);
				this.setState({ gstLoading: false, saveGst: true });
			} else {
				this.setState({ gstLoading: false });
				te(res.data.message);
			}
		});
	};
	render() {
		let {
			panOpen,
			panGstOpen,
			gstOpen,
			entityForm,
			panForm,
			entity,
			saveEntity,
			genderList,
			salutationList,
			verifyLoading,
			gstArray,
			gstForm,
			saveGst,
			verifyPan,
			saveDetailStatus,
			gstLoading
		} = this.state;
		let { history } = this.props;
		let { selectedEntity, leadDetail } = this.props;
		let panDetailFormStatus = false;
		let CheckForm = Object.keys(panForm).filter(res => {
			if (res != "errors" && !panForm[res]) return res;
		});
		let formStatus = getFormDetails(panForm, () => { });

		if (CheckForm.length == 0 && formStatus) {
			panDetailFormStatus = true;
		}
		let dateOfBirthLabel = "";
		if (
			entityForm.typeOfEntity == 5 ||
			history.location.pathname.startsWith(
				public_url.co_applicant_update_profile
			)
		) {
			dateOfBirthLabel = "Date of Birth";
		} else {
			dateOfBirthLabel = "Date of Incorporation";
		}

		return (
			<React.Fragment>
				<div className="gAccordion">
					<div className="gAccordion__title" onClick={this.panGstOpen}>
						<i className="icon">{panGstOpen ? "-" : "+"}</i> PAN and GST
            verification (Mandatory)
          </div>
					{panGstOpen && (
						<div className="gAccordion__body">
							<div className="row align-items-center">

								<div className="col-md-4 col-lg-2 d-flex align-items-center">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										Type of entity
                        </label>
								</div>
								<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
									<div class="select">
										{!saveEntity && !saveDetailStatus ? (
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={entity}
												value={entityForm.typeOfEntity}
												title="Entity"
												name="typeOfEntity"
												onChangeFunc={(name, value, error) => {
													this.onInputChange(
														name,
														value,
														error,
														"entityForm"
													);
												}}
												error={entityForm.errors.typeOfEntity}
												isReq={true}
												labelKey="subcat_desc"
												valueKey="id"
											/>
										) : (
												entity.map(res => {
													if (entityForm.typeOfEntity == res.id) {
														return res.subcat_desc ? res.subcat_desc : "-";
													}
												})
											)}
									</div>
								</div>
								{!saveEntity ? (
									<React.Fragment>
										<div className="col-12 d-flex justify-content-end">
											{entityForm.typeOfEntity && leadDetail.pansectionflag && (
												<div className="text-right pr-0 mt-3 mt-lg-0">
													<button
														onClick={() => {
															this.props.GetLeadDetail();
														}}
														className="btn btn-secondary btn-rounded ls-1 cursor-pointer mr-3 fs-16 btn-green bg-green"
													>
														Cancel
                          </button>
												</div>
											)}
											{history.location.pathname.startsWith(
												public_url.co_applicant_update_profile
											) && (
													<>
														<div
															className={`${
																entityForm.typeOfEntity ? "btn1" : "btn2"
																}  text-right mt-3 mt-lg-0 `}
														>
															{!entityForm.typeOfEntity &&
																leadDetail.pansectionflag && (
																	<button
																		onClick={() => {
																			this.props.GetLeadDetail();
																		}}
																		className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green mr-2"
																	>
																		Cancel
                                </button>
																)}
															<button
																disabled={!entityForm.typeOfEntity}
																className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${entityForm.typeOfEntity &&
																	"btn-green"}`}
																onClick={this.SaveEntity}
															>
																Save
                            </button>
														</div>
													</>
												)}
										</div>
									</React.Fragment>
								) : (
										history.location.pathname.startsWith(
											public_url.co_applicant_update_profile
										) && (
											<div className={`col-12 text-right mt-3 mt-lg-0`}>
												<button
													className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16  btn-green`}
													onClick={() => {
														this.SaveEntity(`${entityForm.typeOfEntity}`);
													}}
												>
													Reset
                      </button>
											</div>
										)
									)}

							</div>

							<div className="row align-items-center my-4">
								<div
									className="col-6 col-md-3 col-lg-3 col-xl-2"
									onClick={this.panOpen}
								>
									<label className="mb-0 fw-700 text-primary2 colorGreen">
										{panOpen ? "-" : "+"} PAN Details
                  </label>
								</div>
								<div className="col-6 col-md-9 col-lg-9 col-xl-10 px-3">
									<hr className="bg_lightblue" />
								</div>
							</div>
							{panOpen && (
								<div className="ml-2 ml-md-4">
									<div className="row">
										<div className="col-md-4 col-lg-2 d-flex align-items-center">
											<label className="fs-14 mb-0 gTextPrimary fw-500">
												PAN No.
                      </label>
										</div>
										<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
											{!saveDetailStatus ? (
												<Input
													name="panNumber"
													placeholder="Type PAN No."
													className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
													onChangeFunc={(name, value, error) => {
														let regex = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
														if (value.match(regex) == null) {
															this.onInputChange(
																name,
																value.toUpperCase(),
																error,
																"panForm"
															);
														}
													}}
													title="Pan Number"
													isReq={true}
													maxLength="10"
													error={panForm.errors.panNumber}
													validationFunc={(name, error) => {
														this.onInputValidate(name, error, "panForm");
													}}
													value={panForm.panNumber}
													disabled={verifyPan}
												/>
											) : (
													panForm.panNumber
												)}
										</div>
									</div>
									<div className="row mt-3 align-items-center">
										<div className="col-md-4 col-lg-2 d-flex align-items-center">
											<label className="fs-14 mb-0 gTextPrimary fw-500">
												{dateOfBirthLabel}
											</label>
										</div>
										<div className="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2 position-relative">
											{!saveDetailStatus ? (
												<Input
													name="dateOfBirth"
													placeholder="Type PAN No."
													className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
													onChangeFunc={(name, value, error) => {
														this.onInputChange(name, value, error, "panForm");
													}}
													title={dateOfBirthLabel}
													type="date"
													isReq={true}
													error={panForm.errors.dateOfBirth}
													validationFunc={(name, error) => {
														if (
															new Date("1919-12-12") <
															new Date(panForm.dateOfBirth) &&
															new Date() > new Date(panForm.dateOfBirth)
														) {
														} else {
															error = "Please enter valid date";
														}
														this.onInputValidate(name, error, "panForm");
													}}
													value={moment(panForm.dateOfBirth).format(
														"YYYY-MM-DD"
													)}
													min="1920-12-12"
													max={moment(new Date()).format("YYYY-MM-DD")}
													disabled={verifyPan}
												/>
											) : (
													panForm.dateOfBirth
												)}
											{/* <img
                        src="/images/date-primary.png"
                        className="img-fluid"
                        alt="Date Icon"
                      /> */}
										</div>
									</div>
									{(entityForm.typeOfEntity == 5 ||
										entityForm.typeOfEntity == 1) && (
											<div className="row mt-3">
												<div className="col-md-4 col-lg-2 d-flex align-items-center">
													<label className="fs-14 mb-0 gTextPrimary fw-500">
														Gender
                        </label>
												</div>
												<div className="col-md-8 col-lg-3  mt-2 mt-lg-0">
													<div class="select">
														{!saveDetailStatus ? (
															<Select
																className="w-100 fs-12 create-lead-form-select"
																options={genderList}
																value={panForm.gender}
																title="Gender"
																name="gender"
																onChangeFunc={(name, value, error) => {
																	this.onInputChange(
																		name,
																		value,
																		error,
																		"panForm"
																	);
																}}
																isReq={true}
																// isMulti={true}
																labelKey="subcat_desc"
																valueKey="id"
																error={panForm.errors.gender}
																disabled={verifyPan}
															/>
														) : (
																<>
																	{genderList.map(res => {
																		if (res.id == panForm.gender) {
																			return res.subcat_desc;
																		}
																	})}
																</>
															)}
													</div>
												</div>
											</div>
										)}
									<div className="row mt-3">
										{(entityForm.typeOfEntity == 5 ||
											entityForm.typeOfEntity == 1) && (
												<React.Fragment>
													<div className="col-md-4 mb-3 col-lg-2 d-flex align-items-center">
														<label className="fs-14 mb-0 gTextPrimary fw-500">
															Salutation
                          </label>
													</div>
													<div className="col-md-8 mb-3  col-lg-3 mt-2 mt-lg-0">
														<div class="select">
															{!saveDetailStatus ? (
																<Select
																	className="w-100 fs-12 create-lead-form-select"
																	options={salutationList}
																	value={panForm.salutation}
																	title="Salutation"
																	name="salutation"
																	onChangeFunc={(name, value, error) => {
																		this.onInputChange(
																			name,
																			value,
																			error,
																			"panForm"
																		);
																	}}
																	error={panForm.errors.salutation}
																	isReq={true}
																	// isMulti={true}
																	labelKey="subcat_desc"
																	valueKey="id"
																	disabled={verifyPan}
																/>
															) : (
																	<>
																		{salutationList.map(res => {
																			if (res.id == panForm.salutation) {
																				return res.subcat_desc;
																			}
																		})}
																	</>
																)}
														</div>
													</div>
												</React.Fragment>
											)}
										{
											verifyPan &&
											<div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center col-12 col-xl-8 mt-3 mt-lg-0">
												<p className="fs-14 mb-0 gTextPrimary fw-500">
													PAN Name
                      </p>
												<p className="mb-0 ml-5 pl-5 text-primary2">{panForm.panName}</p>
											</div>

										}
									</div>
									{
										entityForm.typeOfEntity == 5 && (
											<div className="row mt-3">
												<div className="col-md-4 col-lg-2 d-flex align-items-center">
													<label className="fs-14 mb-0 gTextPrimary fw-500">
														Firm Name
                      </label>
												</div>
												<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
													{!saveDetailStatus ? (
														<Input
															className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
															name="firmName"
															placeholder="Type Firm Name"
															onChangeFunc={(name, value, error) => {
																this.onInputChange(
																	name,
																	value,
																	error,
																	"panForm"
																);
															}}
															title="Firm Name"
															reqType="alphaNumeric"
															isReq={true}
															error={panForm.errors.firmName}
															validationFunc={(name, error) => {
																this.onInputValidate(name, error, "panForm");
															}}
															value={panForm.firmName}
														/>
													) : (
															panForm.firmName ? panForm.firmName : "-"
														)}
												</div>
											</div>
										)}
									<div className="row justify-content-end mt-3  mt-lg-0">
										<div className="col-sm-12 text-right">
											{verifyPan && (
												<span className="ls-1 cursor-pointer fs-16 mr-3">
													Verified
                        </span>
											)}
											{leadDetail && leadDetail.pansectionflag && !verifyPan && (
												<button
													className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3   btn-green"
													onClick={() => {
														this.props.GetLeadDetail();
													}}
												>
													Cancel
                        </button>
											)}
											{verifyPan && (
												<React.Fragment>
													<button
														className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green"
														onClick={() => {
															this.ResetCommonData();
															this.panFormChange(entityForm.typeOfEntity);
														}}
													>
														Reset
                          </button>
												</React.Fragment>
											)}

											{/* {!verifyPan && panDetailFormStatus && (
                      <button
                        disabled={!verifyPan}
                        className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3"
                        onClick={() => {
                          this.panFormChange(entityForm.typeOfEntity);
                        }}
                      >
                        Reset
                      </button>
                    )} */}
											{!verifyPan && (
												<button
													disabled={!panDetailFormStatus || verifyLoading}
													className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${panDetailFormStatus &&
														"btn-green"} `}
													onClick={this.VerifyPanGST}
												>
													{verifyLoading ? "Verifying..." : "Verify"}
												</button>
											)}
										</div>
									</div>
								</div>
							)}
							<div className="row align-items-center my-4">
								<div
									className="col-6 col-md-3 col-lg-3 col-xl-2"
									onClick={this.gstOpen}
								>
									<label className="mb-0 fw-700 text-primary2 colorGreen">
										{gstOpen ? "-" : "+"} Gst
                  </label>
								</div>
								<div className="col-6 col-md-9 col-lg-9 col-xl-10 px-3">
									<hr className="bg_lightblue" />
								</div>
							</div>
							{gstOpen && (
								<div className="ml-2 ml-md-4">
									<div className="row mt-3">
										<div className="col-md-4 col-lg-2 d-flex align-items-center">
											<label className="fs-14 mb-0 gTextPrimary fw-500">
												GST
                      </label>
										</div>
										<div className="col-md-8 col-lg-3 col-xl-2 mt-2 mt-lg-0">
											<div class="select">
												{verifyPan &&
													!gstForm.gstNumber &&
													gstArray.length == 0 &&
													"Not applicable"}
												{gstArray.length > 0 && !saveDetailStatus ? (
													<Select
														className="w-100 fs-12 create-lead-form-select"
														options={gstArray}
														value={gstForm.gstNumber}
														title="GST Number"
														name="gstNumber"
														onChangeFunc={(name, value, error) => {
															this.onInputChange(name, value, error, "gstForm");
														}}
														isReq={true}
														//isMulti={true}
														labelKey="gstNo"
														valueKey="gstNo"
														disabled={saveGst}
														error={gstForm.errors.gstNumber}
													/>
												) : (
														gstForm.gstNumber
													)}
											</div>
										</div>
									</div>

									<div className="row justify-content-end mt-3 mt-lg-0">
										{!saveGst && gstForm.gstNumber && (
											<button
												className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3"
												onClick={this.ResetGst}
											>
												Reset
                      </button>
										)}

										{gstArray.length > 0 && (
											<button
												disabled={
													!gstForm.gstNumber || gstLoading ? true : false
												}
												className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${!saveGst &&
													gstForm.gstNumber &&
													"btn-green"} `}
												onClick={!saveGst && this.SaveGST}
											>
												{saveGst
													? "Verified"
													: gstLoading
														? "Verifying"
														: "Verify"}
											</button>
										)}
									</div>
								</div>
							)}
							<br />
							{(!saveGst ||
								!verifyPan ||
								(!saveEntity && leadDetail.pansectionflag)) && (
									<div className="row justify-content-end mt-3 mt-lg-0">
										<div className="col-md-12 text-right">
											<button
												className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green bg-green ${!saveDetailStatus &&
													gstForm.gstNumber &&
													"btn-green"} `}
												onClick={this.props.GetLeadDetail}
											>
												Cancel
                    </button>
										</div>
									</div>
								)}
							{saveGst && verifyPan && saveEntity && (
								<div className="row justify-content-end mt-3  mt-lg-0">
									<div className="col-sm-12 text-right">
										{this.state.saveDetailStatus ? (
											<>
												<button
													disabled={
														!gstForm.gstNumber || this.state.saveDetailLoading
													}
													className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${!saveDetailStatus &&
														gstForm.gstNumber &&
														"btn-green"} `}
												>
													{this.state.saveDetailLoading ? (
														"Saving..."
													) : this.state.updateLoading ? (
														<>
															<i className="fa fa-spinner fa-spin mr-2" />
															Updating data...
                            </>
													) : (
																"Saved"
															)}
												</button>
											</>
										) : (
												<button
													disabled={!saveGst || this.state.saveDetailLoading}
													className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${!saveDetailStatus &&
														saveGst &&
														"btn-green"} `}
													onClick={e => {
														this.SaveDetail(e);
													}}
												>
													{this.state.saveDetailLoading
														? "Saving..."
														: "Save Detail"}
												</button>
											)}
									</div>
								</div>
							)}
						</div>
					)}
					<hr class="bg_lightblue border-0 h-1px" />
				</div>
			</React.Fragment>
		);
	}
}
export default withRouter(PanGstNonIndividual);
