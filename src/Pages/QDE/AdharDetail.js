import React from "react";
import { File, Input, Select } from "../../Component/Input/index";
import { cloneDeep } from "lodash";
import {
	postAddAdharDetail,
	postUploadAdharFile
} from "../../Utility/Services/QDE";
import { te, ts } from "../../Utility/ReduxToaster";
import { getFormDetails } from "../../Utility/Helper";
import { withRouter } from "react-router-dom";
import jsZip from "jszip";
import fileSave from "file-saver";
import { API_URL, FileUrl } from "../../Utility/Config";
import { postCoAddAdharDetail } from "../../Utility/Services/CoApplicant";
const initForm = {
	aadharNumber: "",
	ekyctype: "",
	file: [],
	fileType: "",
	errors: { aadharNumber: null, ekyctype: null, file: null, fileType: null }
};
class AdharDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			adharOpen: false,
			form: cloneDeep(initForm),
			adharDetailLoading: false,
			saveForm: false,
			adhardtlsflag: false
		};
	}
	adharOpen = () => {
		let { adharOpen } = this.state;
		this.setState({ adharOpen: !adharOpen });
	};
	onInputChange = (name, value, error = undefined) => {
		const { form } = this.state;
		if (name == "file") {
			console.log("File----", value);
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
	// handle validation
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
	SaveCoForm = () => {
		let { saveForm, form } = this.state;
		let { match } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			this.setState({ adharDetailLoading: true });
			obj.leadCode = params.leadcode;
			postCoAddAdharDetail({
				aadharNumber: form.aadharNumber,
				ekyctype: form.ekyctype,
				adhardtlsflag: true,
				custcode: params.custcode,
				fileType: form.fileType
			}).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, adharDetailLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, adharDetailLoading: false });
				} else {
					ts(res.data.message);
					this.ImageConvertInZipAndUpload(res.data.data.aadharNumber);
				}
			});
		} else {
			this.setState({ saveForm: !saveForm, adhardtlsflag: false });
		}
	};
	SaveForm = () => {
		let { saveForm, form } = this.state;
		let { match } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			this.setState({ adharDetailLoading: true });
			obj.leadCode = params.leadcode;
			postAddAdharDetail({
				aadharNumber: form.aadharNumber,
				ekyctype: form.ekyctype,
				leadCode: params.leadcode,
				mobileNumber: params.comobileno,
				adhardtlsflag: true
			}).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, adharDetailLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, adharDetailLoading: false });
				} else {
					//ts(res.data.message);
					this.ImageConvertInZipAndUpload(res.data.data.aadharNumber);
				}
			});
		} else {
			this.setState({ saveForm: !saveForm });
		}
	};
	ImageConvertInZipAndUpload = uniqueId => {
		let { saveForm } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		let { form } = this.state;
		let zip = new jsZip();
		let imageDetailArray = [];
		form.file.map((res, index) => {
			if (res && typeof res == "object") {
				imageDetailArray.push({
					documentName: `${res.name}`,
					description: `${res.name}`,
					uniqueId: uniqueId
				});
				zip.file(`${res.name}`, res, { binary: true });
			} else {
				imageDetailArray.push({
					documentName: `${leadDetail.document[index].documentName}`,
					description: `${res.name}`,
					uniqueId: uniqueId
				});
				zip.file(`${index}.gif`, res, { binary: true });
			}
		});
		let _this = this;
		zip.generateAsync({ type: "blob" }).then(function (content) {
			let formData = new FormData();
			formData.append("adharDocs", JSON.stringify(imageDetailArray));
			formData.append("file", content, `${uniqueId}.zip`);
			formData.append("mobileNo", params.comobileno);
			formData.append("adhardtlsflag", true);
			postUploadAdharFile(formData).then(res => {
				if (res.error) return;
				if (res.data.error) {
					te(res.data.message);
					_this.setState({ saveForm: saveForm, adharDetailLoading: false });
				} else {
					ts(res.data.message);
					_this.setState({ saveForm: true, adharDetailLoading: false });
				}
			});
		});
	};
	componentDidUpdate(preProps) {
		if (preProps.leadDetail != this.props.leadDetail) {
			this.FormUpdate();
		}
	}
	componentDidMount() {
		this.FormUpdate();
	}
	FormUpdate = () => {
		let { leadDetail } = this.props;
		let { saveForm } = this.state;
		let { form } = this.state;
		form.file = [];
		Object.keys(form).map(res => {
			if (leadDetail[res]) {
				form[res] = leadDetail[res];
			}
			if (res == "file") {
				leadDetail.document &&
					leadDetail.document.map(res => {
						let splitArray = res.documentPath.split("/");
						let path = "";
						splitArray.map((folder, index) => {
							if (folder != "var" && (folder != "www") & (folder != "html")) {
								if (index + 1 != splitArray.length) {
									path += folder + "/";
								} else {
									path += folder;
								}
							}
						});
						form.file.push(FileUrl + path);
					});
			}
		});
		this.setState({
			form,
			saveForm: leadDetail.adhardtlsflag ? true : false,
			adhardtlsflag: leadDetail.adhardtlsflag
		});
	};
	ResetFiles = () => {
		let { form } = this.state;
		this.setState({
			form: { ...form, file: [], errors: { ...form.errors, file: null } }
		});
	};
	render() {
		let { adharOpen, form, adharDetailLoading, saveForm } = this.state;
		let { ekyctype, aadharNumber, errors, file, fileType } = form;
		let { selectedEntity, leadDetail } = this.props;
		let adharFormDetailStatus = false;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && !form[res] && res != "file") {
				return res;
			}
			if (res == "file") {
				if (form.file.length < 2) {
					return res;
				}
			}
		});
		let formStatus = getFormDetails(form, () => { });
		if (CheckForm.length == 0 && formStatus) {
			adharFormDetailStatus = true;
		}
		return (
			<React.Fragment>
				<div className="gAccordion">
					<div className="gAccordion__title" onClick={this.adharOpen}>
						<i class="icon">{adharOpen ? "-" : "+"}</i> Aadhaar Details
            (Not Mandatory)
          </div>
					{adharOpen && (
						<div className="gAccordion__body">
							{!saveForm && (
								<div className="row">
									<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>
									<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
										{saveForm ? (
											ekyctype
										) : (
												<div class="c_radiobtn w-50 d-flex ">
													<div className="mr-3">
														<input
															type="radio"
															className=""
															onChange={() => {
																this.onInputChange("ekyctype", "osv", "");
															}}
															id="osvradio"
															value="osv"
															checked={ekyctype == "osv" ? true : false}
														/>
														<label className="fw-500" for="osvradio">
															OSV
                          </label>
													</div>
													<div className="">
														<input
															type="radio"
															id="offlineradio"
															name="radio-group"
															onChange={() => {
																this.onInputChange("ekyctype", "offline", "");
															}}
															value="offline"
															checked={ekyctype == "offline" ? true : false}
														/>
														<label className="fw-500" for="offlineradio">
															Offline
                          </label>
													</div>
												</div>
											)}
									</div>
								</div>
							)}
							<div className="row mt-3 align-items-center">
								<div className="col-md-4 col-lg-2 d-flex align-items-center">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										Aadhaar No.
                  </label>
								</div>
								<div className="col-10 col-md-8 col-lg-3 mt-2 mt-lg-0 pr-2">
									{!saveForm ? (
										<Input
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											placeholder="Type Aadhaar No."
											name="aadharNumber"
											value={aadharNumber}
											onChangeFunc={(name, value, error) => {
												if (value.length <= 12) {
													this.onInputChange(name, value, error);
												}
											}}
											validationFunc={this.onInputValidate}
											error={errors.aadharNumber}
											isReq={true}
											title="Aadhaar Number"
											reqType="number"
											//type="number"
											maxLength="12"
										/>
									) : (
											aadharNumber
										)}
								</div>
							</div>
							<div className="row mt-3">
								<React.Fragment>
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Upload Document
                    </label>
									</div>
									{!saveForm ? (
										<div className="col-md-8 col-lg-3 col-xl-3 mt-2 mt-lg-0">
											<div className="select">
												<Select
													className="w-100 fs-12 create-lead-form-select"
													options={[
														{ label: "jpeg", value: ".jpeg" },
														{ label: "png", value: ".png" }
													]}
													value={fileType}
													title="Document Type"
													name="fileType"
													onChangeFunc={(name, value, error) => {
														this.onInputChange(name, value, error);
														this.ResetFiles();
													}}
													isReq={true}
													error={errors.fileType}
												/>
											</div>
										</div>
									) : (
											fileType
										)}
								</React.Fragment>
							</div>

							<div className="row mt-3">
								<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>
								<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
									{file.length < 2 && (
										<div className="w-100 rounded dragdrop_box text_lightblue d-flex flex-column align-items-center justify-content-center position-relative">
											<label
												for="selectFile"
												className="w-100 h-100 d-flex flex-column align-items-center "
											>
												<span className="btn btn-primary rounded-pill">
													<i className="fa fa-file-o"></i>&nbsp; Upload Files
                        </span>
												{/* <input
                        type="file"
                        className="selectFile d-none"
                        id="selectFile"
                      /> */}
												<File
													id="selectFile"
													className="selectFile"
													name="file"
													errors={errors.file}
													validationFunc={this.onInputValidate}
													onChangeFunc={this.onInputChange}
													fileType={fileType}
													disabled={!fileType}
												/>
												<h6 className="my-3">OR</h6>
												<h6>Drop your files here</h6>
											</label>
										</div>
									)}
									<span className="reqEstric">{errors.file}</span>
									{file.length > 0 && (
										<div className="dragdrop_box imageDropBox d-flex align-items-center mt-3 ">
											{file.map((res, index) => {
												let name = "";
												if (res && typeof res == "object") {
													var urlCreator = window.URL || window.webkitURL;
													var imageUrl = urlCreator.createObjectURL(res);
													name = res.name;
												} else {
													name = leadDetail.document[index]
														? leadDetail.document[index].documentName
														: "";
													imageUrl = res;
												}

												return (
													<div className="imagePreview text-center ml-3 position-relative">
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
															style={{ cursor: "pointer" }}
															onClick={() => fileSave(imageUrl)}
														>
															<div className="imageThumb p-2">
																<img src={imageUrl} alt="Image" />
															</div>
															<div className="imageName p-2 break-text">
																{name}
															</div>
														</div>
													</div>
												);
											})}
										</div>
									)}
								</div>
							</div>

							<div className="row justify-content-end mt-3 pr-0 mt-lg-0 mx-0">
								{!saveForm && leadDetail.adhardtlsflag && (
									<button
										disabled={!leadDetail.adhardtlsflag}
										className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
										onClick={this.props.GetLeadDetail}
									>
										Cancel
                  </button>
								)}
								<button
									disabled={!adharFormDetailStatus || adharDetailLoading}
									className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${adharFormDetailStatus &&
										"btn-green"}`}
									onClick={e => {
										if (selectedEntity == 1) {
											this.SaveCoForm(e);
										} else {
											this.SaveForm(e);
										}
									}}
								>
									{!saveForm
										? adharDetailLoading
											? "Saving..."
											: "Save"
										: "Edit"}
								</button>
							</div>
						</div>
					)}

					<hr class="bg_lightblue border-0 h-1px" />
				</div>
			</React.Fragment>
		);
	}
}
export default withRouter(AdharDetail);
