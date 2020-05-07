import React from "react";
// import {Link} from "react-router-dom"
import { File, Input, Select } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import {
	getApplicantbyLoan,
	sendDdeLinkSms,
	itrdocuments
} from "../../Utility/Services/Documents";
import { withRouter } from "react-router-dom";
import jsZip from "jszip";
import fileSave from "file-saver";
import { te, ts } from "../../Utility/ReduxToaster";
import { FrontendURL, FileUrl } from "../../Utility/Config";

const initForm = {
	ITR: "",
	file: [],
	fileType: "",
	errors: { file: null, fileType: null }
};

class ITRupload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			adharOpen: false,
			showComponent: "uploaddoc",
			form: cloneDeep(initForm),
			adharDetailLoading: false,
			saveForm: false,
			dataITR: {},
			itrF: "",
			username: "",
			password: "",
			ddeType: "itr",
			sms: {},
			loading: false,
			itrDetailLoading: false,
			itrSucessfullyFlag: false,
			changeData: false
			// sendSmsDataItr: '',
		};
	}

	adharOpen = () => {
		let { adharOpen } = this.state;
		this.setState({ adharOpen: !adharOpen });
	};

	onInputChange = (name, value, error = undefined) => {
		const { form } = this.state;
		if (name == "file") {
			form[name] = [];
			form[name].push(value);
		} else {
			form[name] = value;
		}
		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		this.setState({ form });
	};

	onInputValidate = (name, error) => {
		let { errors, file } = this.state.form;
		errors[name] = error;
		this.setState({
			form: { ...this.state.form, errors: errors }
		});
	};

	RemoveImage = index => {
		let { file } = this.state.form;
		file.splice(index, 1);
		this.setState({ form: { ...this.state.form, file: file } });
	};

	handleChange = () => {
		if (this.state.showComponent) {
			this.renderLink();
		}
		this.setState({ showComponent: !this.state.showComponent });
	};

	getApplicantbyLoan = () => {
		//dont remove comments
		let { match } = this.props;
		let { params } = match;
		let { itrF } = this.state;
		getApplicantbyLoan(params.refrencenumber).then(res => {
			const sendDataLink = cloneDeep(res.data.data);
			delete sendDataLink.coApplicantList;
			let data = {
				leadId: res.data.data.leadCode,
				mobileNumber: res.data.data.mobileNumber
				// cif: res.data.data.cif,
				// customerName: res.data.data.customerName
			};
			let sms = {
				leadCode: res.data.data.leadCode,
				mobileNumber: res.data.data.mobileNumber,
				cif: res.data.data.cif,
				customerName: res.data.data.customerName
			};
			let itrFlag = {
				itrFlag: res.data.data.itrFlag
			};
			this.setState({
				dataITR: data,
				itrF: itrFlag.itrFlag,
				saveForm: true,
				// sms: sendDataLink,
				sms: sms,
				loading: false
			});
			if (itrF === true) {
				this.setState({ itrF: true });
			} else {
				this.setState({ itrF: false });
			}
		});
	};

	componentDidMount() {
		this.getApplicantbyLoan();
		this.validateForm();
	}

	validateForm = () => {
		let { form } = this.state;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && !form[res] && res != "ITR" && res != "file") {
				return res;
			}
			if (res == "file") {
				if (form.file && form.file.length != 1) {
					return res;
				}
			}
		});
		let formStatus = getFormDetails(form, () => { });
		if (CheckForm.length == 0 && formStatus) {
			this.props.handleItrFieldValidation(false);
		} else {
			this.props.handleItrFieldValidation(true);
		}
	};

	handleSubmit = uniqueId => {
		let { dataITR, saveForm, form } = this.state;
		let sendData = { ...dataITR, mobileNumber: this.props.data.mobileNumber, mainapplicant: this.props.data.mainapplicant };
		let { file } = form;
		if (!saveForm) {
			let formData = new FormData();
			formData.append("itrInfo", JSON.stringify(sendData));
			formData.append("file", file[0]);
			this.setState({ itrDetailLoading: true });
			itrdocuments(formData).then(res => {
				if (res && res.data && res.data.status === "success" && res.data.error === "false") {
					ts("Your ITR document has been uploaded successfully");
					this.setState({
						saveForm: !saveForm,
						itrSucessfullyFlag: false,
						itrDetailLoading: false
					}, () => {
						setTimeout(() => {
							this.getApplicantbyLoan();
						}, 1000);
					});

				} else {
					te(res.data && res.data.message);
					this.setState({
						itrDetailLoading: false
					});
				}
			});
		}
		else {
			this.setState({ saveForm: !saveForm })
		}
	};

	FormITRUpdate = () => {
		let { data } = this.props;
		let { form } = this.state;
		Object.keys(this.state.form).map(res => {
			if (res == "file") {
				if (data.itrPathList && data.itrPathList.length > 0) {
					data.itrPathList[0].filePath = FileUrl + data.itrPathList[0].filePath
				}
				form[res] = data.itrPathList && data.itrPathList.length > 0 ? data.itrPathList : []
			}
			if (res == "fileType") {
				form[res] = data.itrPathList && data.itrPathList.length > 0 ? "pdf" : ""
			}
			if (res == "ITR") {
				form[res] = data.itrPathList && data.itrPathList.length > 0 && ""
			}
		});
		if (data.itrPathList && data.itrPathList.length > 0) {
			this.setState({ saveForm: true });
		}
		this.setState({ form: { ...form, errors: { ...form.errors } } });
	};

	componentDidUpdate(preProps) {
		const { data } = this.props;
		let { checkData } = this.state;
		if (preProps.data != data) {
			this.setState({ saveForm: false, form: cloneDeep(initForm) });
			this.FormITRUpdate();
		}
	}

	ForceDownload = (url, fileName) => {
		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.responseType = "blob";
		xhr.onload = function () {
			var urlCreator = window.URL || window.webkitURL;
			var imageUrl = urlCreator.createObjectURL(this.response);
			var tag = document.createElement("a");
			tag.href = imageUrl;
			tag.download = fileName;
			document.body.appendChild(tag);
			tag.click();
			document.body.removeChild(tag);
		};
		xhr.send();
		if (url) {
			window.open(url);
		}
	};

	renderLink = () => {
		let { ddeType, sms } = this.state;
		let { match, data } = this.props;
		let { params } = match;
		//  let dataSendSms = { ...sms, cif: this.props.data.cif, mobileNumber: this.props.data.mobileNumber}
		let dataSendSms = {
			mainapplicant: this.props.data.mainapplicant,
			leadCode: this.props.data.leadCode,
			mobileNumber: this.props.data.mobileNumber,
			cif: this.props.data.cif,
			customerName: this.props.data.customerName,
			emailid: this.props.data.emailid
		};
		//   let userData=cloneDeep(data)
		//  if(userData.coApplicantList)
		//  {
		//   delete userData.coApplicantList
		//  }
		// `http://${window.location.hostname}/itrupload/${params.refrencenumber}`
		sendDdeLinkSms(
			ddeType,
			`${FrontendURL}/itrupload/${params.refrencenumber}/${this.props.data.mobileNumber}/${this.props.data.mainapplicant}`,
			dataSendSms
		).then(res => {
			if (res.data.smsError == "true") {
				te(res.data.smsMessage);
			} else {
				ts(res.data.smsMessage);
			}
			if (res.data.emailError == "true") {
				te(res.data.emailMessage);
			} else {
				ts(res.data.emailMessage);
			}
			this.setState({
				smsData: res.data
			});
		});
	};

	handleAuthChange = target => {
		this.setState({ [target.name]: target.value });
	};

	render() {
		let {
			adharOpen,
			form,
			saveForm,
			itrDetailLoading,
			itrSucessfullyFlag,
			changeData
		} = this.state;
		let { errors, fileType, file, ITR } = form;
		let CurrentAddressFormStatus = false;
		if (errors && fileType && file && ITR) {
			CurrentAddressFormStatus = true;
		}
		let { data } = this.props;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && !form[res] && res != "ITR" && res != "file") {
				return res;
			}
			if (res == "file") {
				if (form.file && form.file.length != 1) {
					return res;
				}
			}
		});
		let formStatus = getFormDetails(form, () => { });
		if (CheckForm.length == 0) {
			CurrentAddressFormStatus = true;
		}
		return (
			<React.Fragment>
				<div className="p-3">
					<div className="gAccordion__title" onClick={this.adharOpen}>
						<label className="mb-0 fw-700 text-primary2 colorGreen">
							{adharOpen ? "-" : "+"} ITR Upload
            </label>
					</div>
					{adharOpen && (
						<React.Fragment>
							<>
								<div className="d-flex flex-wrap ml-lg-4 p-3 justify-content-md-around mb-3">
									<div className="c_radiobtn w-100 d-flex justify-content-around">
										<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
											<input
												type="radio"
												className=""
												id="uploaddoc"
												name="radio-group"
												onChange={this.handleChange}
												checked={this.state.showComponent}
											/>
											<label className="fw-500" htmlFor="uploaddoc">
												Upload Document
                      </label>
										</label>
										<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
											<input
												type="radio"
												id="offlineradio"
												name="radio-group"
												onChange={this.handleChange}
												checked={!this.state.showComponent}
											/>
											{""}
											<label className="fw-500" htmlFor="offlineradio">
												Send link to customer to upload the Document
                      </label>
										</label>
									</div>
								</div>
								{this.state.showComponent ? (
									<>
										{
											<>
												{itrSucessfullyFlag == true ? (
													saveForm
												) : !saveForm ? (
													<div className="ml-2 ml-md-4">
														<div className="row">
															<div className="col-md-4 col-lg-2 d-flex">
																<label className="fs-14 mb-0 gTextPrimary fw-500 pb-3">
																	{" "}
																	ITR Acknowledge No.{" "}
																</label>
															</div>
															<div className="col-md-8 col-lg-4 mt-2 mt-lg-0">
																{!saveForm ? (
																	<Input
																		className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
																		id="colFormLabelSm"
																		placeholder="Type ITR No"
																		name="ITR"
																		value={ITR}
																		title="ITR"
																		// isReq={true}
																		onChangeFunc={this.onInputChange}
																	// error={errors.ITR}
																	// validationFunc={this.onInputValidate}
																	/>
																) : (
																		ITR
																	)}
															</div>
														</div>
														<div className="row mt-3 align-items-center">
															<div className="col-md-4 col-lg-2 d-flex align-items-center">
																<label className="fs-14 mb-0 gTextPrimary fw-500 pb-3">
																	Upload Document
                                </label>
															</div>
															<div className="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
																<div className="select">
																	{!saveForm ? (
																		<Select
																			className="w-100 fs-12 create-lead-form-select"
																			options={[{ label: "pdf", value: "pdf" }]}
																			value={fileType}
																			title="Document Type"
																			name="fileType"
																			onChangeFunc={(name, value, error) => {
																				this.onInputChange(name, value, error);
																			}}
																			isReq={true}
																			error={errors.fileType}
																		/>
																	) : (
																			fileType
																		)}
																</div>
															</div>
														</div>
														<div className="row mt-3">
															<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>
															<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
																{file && file.length < 1 && (
																	<div className="w-100 rounded dragdrop_box text_lightblue d-flex flex-column align-items-center justify-content-center">
																		<label
																			htmlFor="selectFile"
																			className="w-100 h-100 d-flex flex-column align-items-center"
																		>
																			<span className="btn btn-primary rounded-pill">
																				<i className="fa fa-file-o"></i>&nbsp;
                                        Upload Files
                                      </span>
																			<File
																				id="selectFile"
																				className="selectFile"
																				name="file"
																				errors={errors.file}
																				validationFunc={this.onInputValidate}
																				onChangeFunc={this.onInputChange}
																				fileType=".pdf"
																				size="2048"
																			/>
																			<h6 className="my-3">OR</h6>
																			<h6>Drop your files here</h6>
																		</label>
																	</div>
																)}
																{file && file.length > 0 && (
																	<div
																		className="dragdrop_box imageDropBox d-flex align-items-center mt-3 justify-content-center position-relative"
																		id="selectFileOne"
																	>
																		<File
																			id="selectFileOne"
																			className="selectFile"
																			name="file"
																			errors={errors.file}
																			validationFunc={this.onInputValidate}
																			onChangeFunc={this.onInputChange}
																			fileType=".pdf"
																			size="2048"
																		/>
																		{file.map((res, index) => {
																			let name = "";
																			let url = res.filePath;
																			if (res && !res.filePath && typeof res == "object") {
																				var urlCreator =
																					window.URL || window.webkitURL;
																				var imageUrl = urlCreator.createObjectURL(res
																				);
																				name = res.name;
																			}
																			else if (res.filePath && res.filePath.startsWith("http")) {
																				name = res.fileName;
																			}

																			return (
																				<div className="imagePreview imagePreview--zip cursor-pointer text-center m-1">
																					{!saveForm && (
																						<button
																							className="imageRemoveBtn"
																							type="button"
																							onClick={() => {
																								this.RemoveImage(index);
																							}}
																						></button>
																					)}
																					<div
																						onClick={() =>
																							this.ForceDownload(url, name)
																						}
																					>
																						<div className="imageThumb p-2">
																							<img
																								src="/images/pdf-file.svg"
																								className="img-fluid"
																								alt="Icon Zip"
																							/>
																						</div>
																						<div className="imageName px-3 py-2 break-text">
																							{name}
																						</div>
																					</div>
																				</div>
																			);
																		})}
																		{/* 2097152 */}
																	</div>
																)}
																<span className="reqEstric">{errors.file}</span>
															</div>
														</div>
													</div>
												) : (
															<>
																{file.map((res, index) => {
																	let name = "";
																	let url = res.filePath
																	if (res && !res.filePath && typeof res == "object") {
																		var urlCreator = window.URL || window.webkitURL;
																		var imageUrl = urlCreator.createObjectURL(res);
																		name = res.name;
																	}
																	else if (res.filePath && res.filePath.startsWith("http")) {
																		name = res.fileName;
																	}
																	return (
																		<div className="imagePreview imagePreview--zip cursor-pointer text-center m-1">
																			{!saveForm && (
																				<button
																					className="imageRemoveBtn"
																					type="button"
																					onClick={() => {
																						this.RemoveImage(index);
																					}}
																				></button>
																			)}
																			<div
																				onClick={() =>
																					this.ForceDownload(url, name)

																				}
																			>
																				<div className="imageThumb p-2">
																					<img
																						src="/images/pdf-file.svg"
																						className="img-fluid"
																						alt="Icon Zip"
																					/>
																				</div>
																				<div className="imageName px-3 py-2 break-text">
																					{name}
																				</div>
																			</div>
																		</div>
																	);
																})}
																<div>
																	<span className="row justify-content-center mt-4 mx-0 colorGreen">
																		{" "}
																		Document Upload Successfully
                              </span>
																</div>
															</>
														)}
											</>
										}
										<div className="ml-2 ml-md-4 pr-3">
											<div className="row justify-content-end mt-3 pr-0 mt-lg-0">
												{!saveForm && CurrentAddressFormStatus && (
													<button
														onClick={this.getApplicantbyLoan}
														className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green mr-3"
													>
														Cancel
                          </button>
												)}
												<button
													href="#"
													disabled={!CurrentAddressFormStatus}
													className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${!saveForm &&
														file &&
														file.length == 1 &&
														CurrentAddressFormStatus &&
														"btn-green"}`}
													onClick={() => {
														file.length == 1 && this.handleSubmit();
													}}
												>
													{saveForm
														? "Edit"
														: `${itrDetailLoading ? "Saving..." : "Save"}`}
												</button>
											</div>
										</div>
									</>
								) : (
										<></>
									)}
							</>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}
export default withRouter(ITRupload);
