import React from "react";
import { Link } from "react-router-dom";
import { File, Input, Select } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import {
	getApplicantbyLoan, uploadFinancialStatement, deleteFinancialSection, getAllFinanacialYear
} from "../../Utility/Services/Documents";
import { te, ts } from "../../Utility/ReduxToaster";
import jsZip from "jszip";
import fileSave from "file-saver";
import { public_url } from "../../Utility/Constant";
import { map } from "lodash";
import { FileUrl } from "../../Utility/Config";

const initForm = [
	{
		financialYear: "",
		file: [],
		errors: {
			financialYear: "",
			file: "",
		}
	}
];

class FinancialStatement extends React.Component {
	constructor() {
		super();
		this.state = {
			financeOpen: false,
			form: cloneDeep(initForm) ? cloneDeep(initForm) : [],
			saveForm: false,
			financialData: 1,
			financialDetailLoading: false,
			closeFlag: false,
			finanacialOption: []
		};
	}

	componentDidMount() {
		this.getApplicantbyLoan();
		this.FormUpdate();
		this.getFinancialYear();
		this.validateForm();
	}

	getFinancialYear = () => {
		getAllFinanacialYear().then(res => {
			if (res.error) return;
			this.setState({
				finanacialOption: res.data && res.data.data
			});
		});
	};

	validateForm = () => {
		let { form } = this.state;
		let CheckForm = form.map((res, i) => {
			return Object.keys(form[i]).filter(res => {
				if (
					res != "errors" &&
					!form[i][res]
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
	};

	getFinancialOption = (year) => {
		const { finanacialOption } = this.state;
		return finanacialOption && finanacialOption.filter(val => {
			const finanacialList = map(this.state.form, "financialYear")
			return val.year == year || !finanacialList.includes(val.year)
		})
	}

	financeOpen = () => {
		let { financeOpen, someParam } = this.state;
		this.setState({ financeOpen: !financeOpen });
	};

	onInputChange = (name, value, error = undefined, i) => {
		const { form, bankOption } = this.state;
		if (name == "financialYear") {
			form[i][name] = value;
			form[i].errors[name] = error;
		}
		if (name == "file") {
			let fileData = map(form, "file")
			if (fileData && fileData[i].length >= 3) {
				te("You can upload maximum 3 files")
				return
			}
			let flatData = fileData.flat(2)
			if ([...map(flatData, "name"), ...map(flatData, "filename")].includes(value.name)) {
				te("File already uploaded")
				return
			}
			else {
				form[i][name].push(value)
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
		let { saveForm, form, sendBankData } = this.state;

		if (!saveForm) {
			let list = [];
			let data =
				form &&
				form.map((val, i) =>
					val.file && val.file.map((res, i) =>
						!res.filePath &&
						list.push({
							filename: res.name,
							financialYear: val.financialYear,
							password: null,
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
				companyName: this.props.data.firmName ? this.props.data.firmName : this.props.data.customerName,
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
				formData.append("file", content, "Finanacial_statement.zip");
				this.setState({ financialDetailLoading: true });
				uploadFinancialStatement(formData).then(res => {
					if (res.data.error == true) {
						te(res.data.message);
						this.setState({
							saveForm: saveForm,
							financialDetailLoading: false
						});
					} else {
						ts("Document Uploaded Successfully");
						this.setState(
							{
								saveForm: !saveForm,
								addedSucessfullyFlag: false,
								financialDetailLoading: false
							},
							() => {
								setTimeout(() => {
									this.props.getApplicantbyLoan();
								}, 1000);
							}
						);
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
		let { form, financialData } = this.state;
		financialData = data.fsaDetailsList && data.fsaDetailsList.length > 0 ? data.fsaDetailsList.length : 1
		if (data.fsaDetailsList && data.fsaDetailsList.length > 0) {
			let FileArray = [];
			data.fsaDetailsList.map((res, index) => {
				form[index] = { financialYear: res.financialYear, file: [], errors: form[0].errors }
				res && res.fileNamePathList && res.fileNamePathList.map(file => {
					form[index].file.push(file)
				})
			})
			this.setState({ form: form, saveForm: true });
		} else {
			this.setState({ saveForm: false });
		}
		this.setState({ financialData: financialData });
	};

	componentDidUpdate(preProps) {
		const { data } = this.props;
		if (preProps.data != data) {
			this.setState({ form: cloneDeep(initForm) }, () => {
				this.FormUpdate();
			});
		}
	}

	onCounterAdd = financialData => {
		if (financialData > 0) {
			this.state.financialData = financialData;
			this.state.form.push({ ...cloneDeep(initForm[0]) });
			this.setState({ ...this.state });
		}
	};

	onDeleteFinancialYear = (financialData, val, index) => {
		let { data } = this.props;
		let { form } = this.state;
		if (val && val.financialYear && val.file && val.file.length > 0 && val.file[0].filePath) {
			let obj = {
				financialYear: val.financialYear,
				leadId: data.leadCode,
				mobileNumber: data.mobileNumber,
				mainapplicant: data.mainapplicant
			}
			deleteFinancialSection(obj).then(res => {
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
			if (financialData > 0) {
				this.state.financialData = financialData;
				form.splice(index, 1);
				this.setState({ form });
			}
			else {
				val.financialYear = "";
				val.file = [];
				this.setState({ form });
			}
		}
	}

	render() {
		let { financeOpen, form, saveForm, closeFlag, financialData, finanacialOption, financialDetailLoading } = this.state;
		let { financialYear, file, errors } = form;
		let { data } = this.props;

		let financialStatus = false;
		let CheckForm = form.map((res, i) => {
			return Object.keys(form[i]).filter(res => {
				if (
					res != "errors" &&
					!form[i][res]
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
				financialStatus = true;
			}
		});
		financialStatus = CheckForm.every(res => res.length === 0);

		let financialFormArray = [];
		for (let i = 0; i < financialData; i++) {
			financialFormArray.push(
				<div className="mb-5">
					<div className={`row ${saveForm ? "pl-5" : "pl-4"}`}>
						<div className="col-md-6">
							<div className="row mb-3">
								<div className="col-md-4">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										{" "}
										Financial Year {!saveForm ? <span className="text-danger mr-2">* </span> : <span className="mr-2"> : </span>}
									</label>
								</div>
								<div className="col-md-8 mt-2 mt-md-0">
									<div className="select">
										{!saveForm ? (
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={this.getFinancialOption(form[i] && form[i].financialYear)}
												value={form[i] && form[i].financialYear}
												title="Financial Year"
												name="financialYear"
												onChangeFunc={(name, value, error) => {
													this.onInputChange(name, value, error, i);
												}}
												labelKey="financialYear"
												valueKey="year"
												isReq={true}
												disabled={form[i] && form[i].file[0] && form[i].file[0].filePath}
												error={form[i] && form[i].errors.financialYear}
											/>
										) : (
												form[i] && "FY" + " " + form[i].financialYear + " " + "-" + " " + (parseInt(form[i].financialYear) + 1)
											)}
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-3" />
						{!saveForm && (
							<div className="col-md-2 pl-5 ml-5">
								<button
									onClick={() => {
										this.onDeleteFinancialYear(financialData - 1, form[i], i);
									}}
									className="btn btn-secondary btn-rounded ls-1 py-2 px-4 cursor-pointer fs-16 btn-secondary ml-3">
									<i
										className="fa fa-trash fa-lg mr-2"
										aria-hidden="true"
									></i>{" "}
									Delete
							</button>
							</div>
						)}
					</div>
					<div className="col-md-12 mt-2 pr-0">
						{
							!saveForm ?
								<>
									{/* <span className="text-primary fs-14 ml-2"> Upload maximum 3 finanacial statement </span> */}
									<div className="dragdrop_box d-flex align-items-center justify-content-center mt-3">
										{/* {file.length > 0 && ( */}
										<div className="imageDropBox d-flex align-items-center p-3 mr-5 position-relative">
											{form[i] &&
												form[i].file &&
												form[i].file.map((res, index) => {
													let name = "";
													let type = false;
													let imageUrl = "";
													let url = FileUrl + res.filePath;
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
																		{name}
																	</div>
																</div>
															</div>
														</div>
													);
												})}
										</div>
										{/* )} */}
										{form[i] && form[i].file && form[i].file.length < 3 && (
											<div className="p-3 cursor-pointer rounded dragdrop_box text_lightblue d-flex flex-column align-items-center mr-5 justify-content-center position-relative">
												<label
													htmlFor="selectFile1"
													className="w-100 h-100 d-flex flex-column align-items-center"
												>
													<span className="btn btn-primary rounded-pill">
														<i className="fa fa-file-o"></i>&nbsp; Upload Files ( Max 3 )
													 </span>
													<File
														id="selectFile1"
														className="selectFile"
														name="file"
														size="20480"
														errors={form[i] && form[i].errors.file}
														validationFunc={(name, error) => {
															this.onInputValidate(name, error, i);
														}}
														onChangeFunc={(name, value, error) => {
															this.onInputChange(name, value, error, i);
														}}
														fileType=".pdf, .jpg,.jpeg, .png"
														ismultiple={true}
													/>
													<h6 className="my-3">OR</h6>
													<h6>Drop your files here</h6>
												</label>
											</div>
										)}
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
													var urlCreator = window.URL || window.webkitURL;
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
			)
		}

		return (
			<React.Fragment>
				<div className="p-3">
					<div className="gAccordion__title" onClick={this.financeOpen}>
						<label className="mb-0 fw-700 text-primary2 colorGreen">
							{financeOpen ? "-" : "+"} Financial Statements
            </label>
					</div>
					{financeOpen && (
						<React.Fragment>
							<div className="row mb-5 mt-3">
								<div className="col-md-12 mt-3">
									<div className={`row ${saveForm && "pl-4"}`}>
										<div className="col-md-6">
											<div className="row pl-4 mb-4">
												<div className="col-md-4">
													<label className="fs-14 mb-0 gTextPrimary fw-500">
														{" "}
														Comapany Name {!saveForm ? <span className="text-danger mr-2">* </span> : <span className="mr-2"> : </span>}
													</label>
												</div>
												<div className="col-md-8 mt-2 mt-md-0">
													<div className="select">
														{!saveForm ? (
															<Input
																className="form-control w-100 border-rounded-pill fs-14 p-2 pl-4 pr-2"
																value={this.props && this.props.data && this.props.data.firmName ? this.props.data.firmName : this.props.data.customerName}
																name="companyName"
																title="Company Name"
																disabled={true}
																placeholder="Please enter company name"
															/>
														) : (
																this.props && this.props.data && this.props.data.firmName ? this.props.data.firmName : this.props.data.customerName
															)}
													</div>
												</div>
											</div>
										</div>
									</div>
									{
										!saveForm &&
										<div className="ml-2 ml-md-4 position-relative z-index-1">
											<div className="alert alert-danger fs-14 mb-4" role="alert">
												<i className="fa fa-info-circle mr-2 fa-lg" aria-hidden="true"></i>
												Please upload document type with PDF, JPG, PNG & maximum 5 financial years.
										</div>
										</div>
									}

									{
										financialData < 5 && !saveForm &&
										<div className="row d-flex justify-content-start pl-3 mb-5">
											<button
												onClick={() => {
													financialData <= 4 &&
														this.onCounterAdd(financialData + 1);
												}}
												className="btn btn-secondary btn-rounded ls-1 py-2 px-4 cursor-pointer fs-16 btn-secondary ml-3"
											>
												<i
													className="fa fa-plus-circle fa-lg mr-2"
													aria-hidden="true"
												></i>
												Add Financial Year
                    </button>
										</div>
									}
									{financialFormArray ? financialFormArray : ""}
								</div>
							</div>
							<div className="position-relative z-index-1">
								<div className="d-flex justify-content-end mt-3 pr-0 mt-lg-0">
									{!saveForm && (
										<button onClick={() => this.props.getApplicantbyLoan()} className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-3 fs-16 ${"btn-green"}`}>
											Cancel
                    </button>
									)}
									{!saveForm && (
										<button
											disabled={!financialStatus}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 ${financialStatus && "btn-green"}`}
											onClick={() => this.handleSubmit()}
										>
											{financialDetailLoading ? "Saving..." : "Save"}
										</button>
									)}
									{saveForm && (
										<button
											onClick={() => {
												this.setState({ saveForm: false, closeFlag: true })
											}}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${"btn-green"}`}
										>
											Edit
                    </button>
									)}
								</div>
							</div>
						</React.Fragment>
					)}
				</div>
			</React.Fragment>
		);
	}
}
export default FinancialStatement;
