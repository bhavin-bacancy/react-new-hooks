import React from "react";
import { Link } from "react-router-dom";
import { File, Input, Select } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import {
	getApplicantbyLoan,
	sendLinkForBankDetails,
	sendDdeLinkSms,
	uploadBankStatement,
	getAllBankName,
	deleteBankSection
} from "../../Utility/Services/Documents";
import { te, ts } from "../../Utility/ReduxToaster";
import jsZip from "jszip";
import fileSave from "file-saver";
import { public_url } from "../../Utility/Constant";
import { inRange, map } from "lodash";
import { FileUrl } from "../../Utility/Config";

const initForm = [
	{
		file: [],
		bankname: "",
		institutionId: "",
		password: "",
		errors: {
			file: "",
			bankname: ""
		}
	}
];

class BankDetails extends React.Component {
	constructor() {
		super();
		this.state = {
			bankOpen: false,
			showComponent: "upbankstmt",
			form: cloneDeep(initForm) ? cloneDeep(initForm) : [],
			saveForm: false,
			closeFlag: false,
			sendLinkData: {},
			sendBankData: {},
			linkforCustomer: "",
			ddeType: "bnkstmt",
			sendSmsDatabank: "",
			bankDetailLoading: false,
			addedSucessfullyFlag: false,
			checkData: false,
			bankData: 1,
			bankOption: []
		};
	}

	componentDidMount() {
		this.getApplicantbyLoan();
		this.FormUpdate();
		this.getBankName();
		this.validateForm();
	}

	validateForm = () => {
		let { form } = this.state;
		let CheckForm = form.map((res, i) => {
			return Object.keys(form[i]).filter(res => {
				if (
					res != "errors" &&
					!form[i][res] &&
					res != "password" &&
					res != "institutionId"
				) {
					return res;
				}
				if (res == "file") {
					if (form[i].file && form[i].file.length < 1) {
						return res;
					}
				}
			});
		});

		if (CheckForm && CheckForm.length === 0) {
			this.props.handleBankDetailsFieldValidation(false);
		} else {
			this.props.handleBankDetailsFieldValidation(true);
		}
	};
	getBankName = () => {
		getAllBankName().then(res => {
			if (res.error) return;
			this.setState({
				bankOption: res.data && res.data.data
			});
		});
	};

	getbankOption = (bank) => {
		return this.state.bankOption && this.state.bankOption.filter(val => {
			const bankList = map(this.state.form, "bankname")
			return val.bankname == bank || !bankList.includes(val.bankname)
		})
	}

	bankOpen = () => {
		let { bankOpen, someParam } = this.state;
		this.setState({ bankOpen: !bankOpen });
	};

	onInputChange = (name, value, error = undefined, i) => {
		const { form, bankOption } = this.state;
		if (name == "bankname") {
			form[i][name] = value;
			form[i].errors[name] = error;
			let val =
				bankOption &&
				bankOption.filter(res => res.bankname == form[i].bankname);
			form[i].institutionId = val[0] && val[0].institutionId;
		}

		if (name == "file") {
			let fileData = map(form, "file")
			let flatData = fileData.flat(2)
			if ([...map(flatData, "name"), ...map(flatData, "filename")].includes(value.name)) {
				te("File already uploaded")
			}
			else {
				form[i][name].push(value);
			}
		} else {
			form[i][name] = value;
			form[i].errors[name] = error;
		}
		this.setState({ form });
	};

	onInputValidate = (name, error, i) => {
		let { form } = this.state;
		if (error) {
			form[i].errors[name] = error;
			this.setState({ form });
		}
	};

	RemoveImage = (i, index) => {
		const { form } = this.state;
		form[i].file.splice(index, 1);
		this.setState({ form });
	};

	onCheck = val => {
		let { showComponent } = this.state;
		this.setState({
			showComponent: val
		});
		if (val == "bankstatement") {
			this.sendLinkBankDetails();
		}
	};

	sendLinkBankDetails = () => {
		let {
			sendLinkData,
			ddeType,
			sendBankData,
			linkforCustomer,
			sendSmsDatabank,
			showComponent
		} = this.state;
		let obj = {
			loanAmount: this.props.appData.amount,
			loanDuration: this.props.appData.tenure,
			loanType: this.props.appData.productName,
			cif: this.props.data.cif,
			leadId: this.props.data.leadCode,
			mobileNumber: this.props.data.mobileNumber,
			mainapplicant:
				this.props && this.props.data && this.props.data.mainapplicant
		};
		let bankLinkDetails = {
			cif: this.props.data.cif,
			customerName: this.props.data && this.props.data.customerName,
			emailid: this.props.data.emailid,
			mobileNumber: this.props.data.mobileNumber,
			mainapplicant:
				this.props && this.props.data && this.props.data.mainapplicant
		};
		sendLinkForBankDetails(obj).then(res => {
			if (res.data.error) {
				te(res.data.message);
			}
			if (res && res.data && res.data.data) {
				let url = res.data.data.url;
				sendDdeLinkSms(ddeType, url, bankLinkDetails).then(res => {
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
				});
			}
		});
	};

	getApplicantbyLoan = () => {
		let { match, data } = this.props;
		let { params } = this.props.match;
		getApplicantbyLoan(params.refrencenumber).then(res => {
			if (data && data.type) {
			}
			let LinkData = {
				loanAmount: res && res.data.data.amount,
				loanDuration: res && res.data.data.tenure,
				loanType: res && res.data.data.productName,
				cif: res && res.data.data.cif
			};
			let dataTosend = {
				loanAmount: res.data.data.amount,
				loanDuration: res.data.data.tenure,
				loanType: res.data.data.productName,
				cif: res.data.data.cif,
				leadId: res.data.data.leadCode,
				mobileNumber: res.data.data.mobileNumber
			};
			let smsData = {
				mobileNumber: res.data.data.mobileNumber,
				leadCode: res.data.data.leadCode,
				customerName: res.data.data.customerName,
				cif: res.data.data.cif
			};
			this.setState({
				sendLinkData: LinkData,
				sendBankData: dataTosend,
				sendSmsDatabank: smsData
			});
		});
	};

	handleSubmit = async e => {
		let { saveForm, form, sendBankData, bankOption } = this.state;

		if (!saveForm) {
			let list = [];
			let data =
				form &&
				form.map(
					(val, i) =>
						val.file &&
						val.file.map(res =>
							!res.filePath &&
							list.push({
								filename: res.name,
								bankname: val.bankname,
								institutionId: val.institutionId,
								password: val.password ? val.password : null,
								passwordApplicable: val.password ? true : false
							})
						)
				);

			let uploadString = {
				loanAmount: this.props.appData.amount,
				loanDuration: this.props.appData.tenure,
				loanType: this.props.appData.productName,
				cif: this.props.data.cif,
				leadId: this.props.data.leadCode,
				mobileNumber: this.props.data.mobileNumber,
				mainapplicant: this.props.data.mainapplicant,
				list: list
			};

			let zip = new jsZip();
			form &&
				form.map((val, i) => {
					val.file.map(res => {
						if (res && !res.filePath && typeof res == "object") {
							zip.file(`${res.name}`, res, { binary: true });
						}
					});
				});
			await zip.generateAsync({ type: "blob" }).then(content => {
				let formData = new FormData();
				formData.append("uploadString", JSON.stringify(uploadString));
				formData.append("file", content, "Bank_statement.zip");
				this.setState({ bankDetailLoading: true });
				uploadBankStatement(formData).then(res => {
					if (res.data.error == true) {
						te(res.data.message);
						this.props.handleBankDetailsFieldValidation(true);
						this.setState({
							saveForm: saveForm,
							bankDetailLoading: false
						});
					} else {
						ts("Document Upload Successfully");
						this.props.handleBankDetailsFieldValidation(false);
						this.setState(
							{
								// saveForm: !saveForm,
								addedSucessfullyFlag: false,
								bankDetailLoading: false
							}
						);
						this.props.getApplicantbyLoan();
					}
				});
			});
		} else {
			this.validateForm();
			this.setState({ saveForm: !saveForm, closeFlag: true });
		}
	};

	FormUpdate = () => {
		let { data } = this.props;
		let { form, bankData } = this.state;
		bankData = data.listOfBankDetails && data.listOfBankDetails.length > 0 ? data.listOfBankDetails.length : 1
		if (data.listOfBankDetails && data.listOfBankDetails.length > 0) {
			let FileArray = [];
			data.listOfBankDetails.map((res, index) => {
				form[index] = { bankname: res.bankname, password: res.password, institutionId: res.institutionId, file: [], errors: form[0].errors }
				res && res.listOfBankDetails && res.listOfBankDetails.map(file => {
					form[index].file.push(file)
				})
			})
			this.setState({ form: form, saveForm: true });
		} else {
			this.setState({ saveForm: false });
		}
		this.setState({ bankData: bankData });
	};

	componentDidUpdate(preProps) {
		const { data } = this.props;
		let { checkData } = this.state;
		if (preProps.data != data) {
			this.setState({ form: cloneDeep(initForm) }, () => {
				this.FormUpdate();
			});
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

	onCounterAdd = bankData => {
		if (bankData > 0) {
			this.state.bankData = bankData;
			this.state.form.push({ ...cloneDeep(initForm[0]) });
			this.setState({ ...this.state });
		}
	};

	onDeleteBank = (bankData, val, index) => {
		let { data } = this.props;
		let { form } = this.state;
		if (val && val.institutionId && val.bankname && val.file && val.file.length > 0 && val.file[0].filePath) {
			let obj = {
				institutionId: val.institutionId,
				leadId: data.leadCode,
				mobileNumber: data.mobileNumber,
				mainapplicant: data.mainapplicant,
				deleteInstitutionFlag: true
			}
			deleteBankSection(obj).then(res => {
				if (res.data && res.data.error == "true") {
					te(res.data && res.data.message)
					return;
				}
				else {
					ts(res.data && res.data.message)
					this.props.getApplicantbyLoan();
				}
			});
		}
		else {
			if (bankData > 0) {
				this.state.bankData = bankData;
				form.splice(index, 1);
				this.setState({ form });
			}
			else {
				val.bankname = "";
				val.institutionId = "";
				val.password = "";
				val.file = [];
				this.setState({ form });
			}
		}
	}

	render() {
		let {
			bankOpen,
			form,
			bankDetailLoading,
			addedSucessfullyFlag,
			saveForm,
			checkData,
			bankData,
			bankOption,
			closeFlag
		} = this.state;
		let { data } = this.props;
		let { file } = form;
		let CurrentBankStatus = false;
		let CheckForm = form.map((res, i) => {
			return Object.keys(form[i]).filter(res => {
				if (
					res != "errors" &&
					!form[i][res] &&
					res != "password" &&
					res != "institutionId"
				) {
					return res;
				}
				if (res == "file") {
					if (form[i].file && form[i].file.length < 1) {
						return res;
					}
				}
			});
		});
		CheckForm.map((res, i) => {
			if (res.length == 0) {
				CurrentBankStatus = true;
			}
		});
		CurrentBankStatus = CheckForm.every(res => res.length === 0);

		let bankFormArray = [];
		for (let i = 0; i < bankData; i++) {
			bankFormArray.push(
				<div className="row mb-5">
					<div className="col-md-12 mt-3">
						<div className={`row ${saveForm && "pl-4"}`}>
							<div className={`${saveForm ? "col-md-12" : "col-md-5"}`}>
								<div className="row mb-4">
									<div className={`${saveForm ? "col-md-2" : "col-md-4"}`}>
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											{" "}
											Bank Name {!saveForm ? <span className="text-danger mr-2">* </span> : <span className="mr-2"> : </span>}
										</label>
									</div>
									<div className={`${saveForm ? "col-md-10 mt-2 mt-md-0" : "col-md-8 mt-2 mt-md-0"}`}>
										<div className="select">
											{!saveForm ? (
												<Select
													className="w-100 fs-12 create-lead-form-select"
													options={this.getbankOption(form[i] && form[i].bankname)}
													value={form[i] && form[i].bankname}
													title="Bank Name"
													name="bankname"
													onChangeFunc={(name, value, error) => {
														this.onInputChange(name, value, error, i);
													}}
													labelKey="bankname"
													valueKey="bankname"
													isReq={true}
													disabled={form[i] && form[i].file[0] && form[i].file[0].filePath}
													error={form[i] && form[i].errors.bankname}
												/>
											) : (
													<>
														<span>{form[i] && form[i].bankname} </span> <span>{form[i] && form[i].password ? <i class="fa fa-lock text-green fa-lg ml-2" aria-hidden="true"></i> : ""}</span>
													</>
												)}
										</div>
									</div>
								</div>
							</div>
							{
								!saveForm &&
								<div className="col-md-5">
									<div className="row mb-4">
										<div className="col-md-4">
											<label className="fs-14 mb-0 gTextPrimary fw-500">
												Password <br /> (If Applicable)
                    </label>
										</div>
										<div className="col-md-8 mt-2 mt-md-0">
											<div className="select">
												<Input
													className="form-control w-100 border-rounded-pill fs-14 p-2 pl-4 pr-2"
													onChangeFunc={(name, value, error) => {
														this.onInputChange(name, value, error, i);
													}}
													value={form[i] && form[i].password}
													name="password"
													title="Password"
													type="password"
													disabled={form[i] && form[i].file[0] && form[i].file[0].filePath}
													placeholder="Please enter password"
												/>
											</div>
										</div>
									</div>
								</div>
							}
							{!saveForm && (
								<div className="col-md-2 ">
									<button
										onClick={() => {
											this.onDeleteBank(bankData - 1, form[i], i);
										}}
										className="btn btn-secondary btn-rounded ls-1 py-2 px-4 cursor-pointer fs-16 btn-secondary ml-3"
									>
										<i
											className="fa fa-trash fa-lg mr-2"
											aria-hidden="true"
										></i>{" "}
										Delete
                  </button>
								</div>
							)}
						</div>
					</div>

					<div className="col-md-12 mt-3">
						{
							!saveForm ?
								<>
									<div className="dragdrop_box mb-2 d-flex align-items-center justify-content-center">
										{/* {file.length > 0 && ( */}
										<div className="imageDropBox d-flex align-items-center p-3 mr-5 position-relative">
											{form[i] &&
												form[i].file &&
												form[i].file.map((res, index) => {
													let name = "";
													let url = FileUrl + res.filePath;
													let type = false;
													let imageUrl = "";
													if (res && !res.filePath && typeof res == "object") {
														type = false;
														var urlCreator = window.URL || window.webkitURL;
														// imageUrl = urlCreator.createObjectURL(res);
														name = res.name;
													}
													else if (res.filePath) {
														name = res.filename;
													}
													return (
														<div className="imagePreview upload-img-block imagePreview--zip cursor-pointer text-center p-2 m-1">
															{!saveForm && !closeFlag && (
																<button
																	className="imageRemoveBtn"
																	type="button"
																	onClick={() => {
																		this.RemoveImage(i, index);
																	}}
																></button>
															)}
															<div onClick={() => this.ForceDownload(url, name)}>
																<div>
																	<div className="imageThumb p-2">
																		<img
																			src="/images/statement.svg"
																			className="img-fluid"
																			alt="Icon Pdf"
																		/>
																	</div>
																	<div className="imageName py-2 break-text">
																		{type ? imageUrl : name}
																	</div>
																</div>
															</div>
														</div>
													);
												})}
										</div>
										{/* )} */}
										{
											form[i] && form[i].file && form[i].file.length < 10 && (
												<div className="p-3 cursor-pointer rounded dragdrop_box text_lightblue d-flex flex-column align-items-center mr-5 justify-content-center position-relative">
													<label
														htmlFor="selectFile1"
														className="w-100 h-100 d-flex flex-column align-items-center"
													>
														<span className="btn btn-primary rounded-pill">
															<i className="fa fa-file-o"></i>&nbsp; Upload Files
                    			</span>
														<File
															id="selectFile1"
															className="selectFile"
															name="file"
															errors={form[i] && form[i].errors.file}
															validationFunc={(name, error) => {
																this.onInputValidate(name, error, i);
															}}
															onChangeFunc={(name, value, error) => {
																this.onInputChange(name, value, error, i);
															}}
															fileType=".pdf, .jpg,.jpeg, .png"
															ismultiple={true}
															size={data && (data.indNonIndFlag == "non-individual" || data.indNonIndFlag == undefined || !data.indNonIndFlag) ? "20480" : "10240"}
														/>
														<h6 className="my-3">OR</h6>
														<h6>Drop your files here</h6>
													</label>
												</div>
											)
										}
									</div>
									<span className="reqEstric">{form[i] && form[i].errors.file}</span>
								</>
								:
								<>
									<div className=" imageDropBox d-flex align-items-center p-3 position-relative">
										{form[i] &&
											form[i].file &&
											form[i].file.map((res, index) => {
												let name = "";
												let url = FileUrl + res.filePath;
												if (res && !res.filePath && typeof res == "object") {
													var urlCreator =
														window.URL || window.webkitURL;
													// var imageUrl = urlCreator.createObjectURL(res);
													name = res.name;
												}
												else if (res.filePath) {
													name = res.filename;
												}
												return (
													<div className="imagePreview upload-img-block imagePreview--zip cursor-pointer text-center p-2 m-1 w-100">
														<div onClick={() => this.ForceDownload(url, name)}>
															<div>
																<div className="imageThumb p-2">
																	<img
																		src="/images/statement.svg"
																		className="img-fluid"
																		alt="Icon Pdf"
																	/>
																</div>
																<div className="imageName py-2 break-text">
																	{name}
																</div>
															</div>
														</div>
													</div>
												);
											})}
									</div>
									<div className="row align-items-center justify-content-center mt-4 mx-0 colorGreen">
										{" "}
										<i className="upload-success fa fa-check mr-2" aria-hidden="true"></i>
										<span>Document Uploaded Successfully</span>
									</div>
								</>
						}
					</div>
				</div>
			);
		}

		return (
			<React.Fragment>
				<div className="p-3">
					<div className="gAccordion__title" onClick={this.bankOpen}>
						<label className="mb-0 fw-700 text-primary2 colorGreen">
							{bankOpen ? "-" : "+"} Bank Details
            </label>
					</div>
					{bankOpen && (
						<React.Fragment>
							<>
								<div className="d-flex flex-wrap ml-lg-4 p-3 justify-content-md-around">
									<div className="c_radiobtn w-100 d-flex justify-content-around">
										<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
											<input
												type="radio"
												id="upbankstmt"
												name="upbankstmt"
												value="upbankstmt"
												onChange={() => this.onCheck("upbankstmt")}
												checked={this.state.showComponent == "upbankstmt"}
											/>

											<label className="fw-500" htmlFor="upbankstmt">
												Upload Bank Statements
                      </label>
										</label>
										<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
											<input
												type="radio"
												id="bankstatement"
												name="bankstatement"
												value="bankstatement"
												onChange={() => this.onCheck("bankstatement")}
												checked={this.state.showComponent == "bankstatement"}
											/>
											{""}
											<label className="fw-500" htmlFor="bankstatement">
												Send link to customer to upload the Bank Statement
                      </label>
										</label>
									</div>
								</div>
								{this.state.showComponent == "upbankstmt" &&

									<div className="ml-2 ml-md-4 position-relative z-index-1">
										{/* <div className={`mb-3 ${saveForm ? "ml-4" : "ml-2"} fs-14 text-danger`}>
											<span>
												Please upload document type with pdf & maximum 5 banks.
											</span>
										</div> */}
										{
											!saveForm &&
											<div className="alert alert-danger fs-14 mb-4" role="alert">
												<i className="fa fa-info-circle mr-2 fa-lg" aria-hidden="true"></i>
												Please upload document type with PDF, JPG, PNG & maximum 5 banks.
										</div>
										}
										{
											bankData < 5 && !saveForm &&
											<div className="row d-flex justify-content-start mb-4">
												<button
													onClick={() => {
														bankData <= 4 &&
															this.onCounterAdd(bankData + 1);
													}}
													className="btn btn-secondary btn-rounded ls-1 py-2 px-4 cursor-pointer fs-16 btn-secondary ml-3"
												>
													<i
														className="fa fa-plus-circle fa-lg mr-2"
														aria-hidden="true"
													></i>
													Add Bank Statement
                      </button>
											</div>
										}
										{bankFormArray ? bankFormArray : ""}
									</div>

								}
								<div className="position-relative z-index-1">
									<div className="d-flex justify-content-end mt-3 pr-0 mt-lg-0">
										{!saveForm && (
											<button onClick={() => this.props.getApplicantbyLoan()} className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-3 fs-16 ${"btn-green"}`}>
												Cancel
                      </button>
										)}

										{!saveForm && (
											<button
												disabled={!CurrentBankStatus}
												className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 ${CurrentBankStatus &&
													"btn-green"}`}
												onClick={() => this.handleSubmit()}
											>
												{bankDetailLoading ? "Saving..." : "Save"}
											</button>
										)}

										{saveForm && (
											<button
												className={`btn btn-secondary btn-rounded ls-1 cursor-pointer  fs-16 ${"btn-green"}`}
												onClick={() => {
													this.setState({ saveForm: false, closeFlag: true })
												}}
											>
												Edit
                      </button>
										)}
									</div>
								</div>
							</>

						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}
export default BankDetails;