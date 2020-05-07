import React, { useState, useEffect } from "react";
import { File, Select } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails, ConvertInFormData } from "../../Utility/Helper";
import { withRouter } from "react-router-dom";
import { te, ts } from "../../Utility/ReduxToaster";
import { CommonFileType } from "../../Utility/Constant";
import { API_URL, FileUrl } from "../../Utility/Config";
import jsZip from "jszip";
import fileSave from "file-saver";
import {
	postAddDisbrisalDetail,
	postDisbrusalDocumentDelete,
	UpdatingDisbursementDocFlag
} from "../../Utility/Services/DisbrusalUpload";

const initialState = {
	documentType: "",
	selectedDocument: "",
	file: [],
	errors: { documentType: null, selectedDocument: null, file: null }
};
const initUtilState = { loading: false, saveForm: false };

const DropDownComponent = props => {
	const [state, setState] = useState({ ...cloneDeep(initialState) });
	const [utilState, utilSetState] = useState({ ...cloneDeep(initUtilState) });
	let { loading, saveForm } = utilState;
	let { selectedDocument, errors, file, documentType } = state;
	let { options, name, subsectionName, mandtory, match } = props;
	const onInputValidate = (name, error) => {
		state.errors[name] = error;
		setState({
			...state
		});
	};
	const onInputChange = (name, value, error = undefined) => {
		if (name == "file") {
			state[name].push(value);
		} else {
			state[name] = value;
			state.file = [];
		}
		if (error !== undefined) {
			let { errors } = state;
			errors[name] = error;
		}
		setState({ ...state });
	};
	const RemoveImage = index => {
		state.file.splice(index, 1);
		setState({ ...state });
	};
	useEffect(() => {
		FormDataUpdate();
	}, [JSON.stringify(options)]);
	const FormDataUpdate = res => {
		let selectedDocument = options.filter(res => {
			if (res.selected) return res;
		});

		if (selectedDocument.length > 0) {
			state.selectedDocument = selectedDocument[0].id;
			state.file = selectedDocument[0].filePath;
			let UrlArray = selectedDocument[0].filePath[0].split("/");
			UrlArray.map((res, index) => {
				if (index == UrlArray.length - 1) {
					res.split(".").map((response, i) => {
						if (res.split(".").length - 1 == i) {
							state.documentType = "." + response.trim().toLowerCase();
						}
					});
				}
			});
			utilState.saveForm = true;
			utilSetState({ ...utilState });
			setState({ ...state });
		} else {
			utilSetState({ ...cloneDeep(initUtilState) });
			setState({
				...cloneDeep(initialState)
				//selectedDocument: props.subSectionId
			});
		}
	};

	const AddDocument = (state, setState, props, utilState, utilSetState) => {
		let { options, name, subsectionName, match, GetDetail } = props;
		let { params } = match;
		let zip = new jsZip();
		state.file.map((res, index) => {
			if (res && typeof res == "object") {
				zip.file(`${res.name}`, res, { binary: true });
			} else {
				zip.file(`${index}${state.documentType}`, res, { binary: true });
			}
		});
	
		//return
		zip.generateAsync({ type: "blob" }).then(function (content) {
			let obj = {
				file: content,
				uploadString: {
					id: null,
					leadCode: params.leadcode,
					mobileNumber: params.mobileno,
					sectionName: name,
					remark: "",
					mainapplicant: true,
					subSectionName: subsectionName,
					module: "DISBM",
					docData: {
						docSubCategoryId: options.filter(res => {
							if (res.id == state.selectedDocument) return res;
						})[0].docSubCategoryId,
						docTypeDesc: options.filter(res => {
							if (res.id == state.selectedDocument) return res;
						})[0].docTypeDesc,
						id: options.filter(res => {
							if (res.id == state.selectedDocument) return res;
						})[0].id,
						mandatoryFlag: options.filter(res => {
							if (res.id == state.selectedDocument) return res;
						})[0].mandatoryFlag,
						selected: true
					},
					docType: state.documentType
				}
			};
			//return;
			let formData = ConvertInFormData(obj, "file");
			formData.append("file", content);
			utilState.loading = true;
			utilSetState({ ...utilState });
			postAddDisbrisalDetail(formData).then(res => {
				if (res.error) {
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					utilState.loading = false;
					utilSetState({ ...utilState });
				} else {
					GetDetail();
					ts(res.data.message);
					utilState.loading = false;
					utilState.saveForm = true;
					utilSetState({ ...utilState });
				}
			});
		});
	};
	const DeleteDocument = (state, setState, props, utilState, utilSetState) => {
		let { options, name, subsectionName, match, GetDetail } = props;
	
		let { params } = match;
		let obj = {
			leadCode: params.leadcode,
			mobileNumber: params.mobileno,
			docData: {
				docSubCategoryId: options.filter(res =>
					res.id.toString().includes(state.selectedDocument)
				)[0].docSubCategoryId,
				id: state.selectedDocument
			},
			module: "DISBM"
		};
		utilState.loading = true;
		utilSetState({ ...utilState });
		postDisbrusalDocumentDelete(obj).then(res => {
			if (res.error) return;
			if (res.data.error) {
				te(res.data.message);
				utilState.loading = false;
				utilSetState({ ...utilState });
			} else {
				ts(res.data.message);
				utilState.loading = false;
				setState({ ...cloneDeep(initialState) });
				utilSetState({ ...cloneDeep(utilState) });
				GetDetail();
			}
		});
	};
	
	const CancelButton = () => {
		FormDataUpdate();
	};
	const ForceDownload = (url, fileName) => {
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
		window.open(url);
	};
	let documentFormStatus = false;
	let CheckForm = Object.keys(state).filter(res => {
		if (res != "errors" && res != "file" && !state[res] && res != "file") {
			return res;
		}
		if (res == "file") {
			if (state.file.length == 0) {
				return res;
			}
		}
	});
	let formStatus = getFormDetails(state, () => { });
	if (CheckForm.length == 0 && formStatus) {
		documentFormStatus = true;
	}
	return (
		<>
			<div className="row ">
				<div className="col-lg-12 mt-3 mt-3 ">
					<div className="row mt-3">
						<div className="col-lg-12">
							<label className="fs-18 mb-0 gTextPrimary fw-500 mt-7 font-weight-bold">
								{name} <br />
							</label>
							<br />
							<label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
								{subsectionName == "N/A" ? name : subsectionName}
								{mandtory && <span className="reqEstric">*</span>}
							</label>
						</div>

						<div className="col-lg-12 mt-3">
							<label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
								{options.filter(res => {
									if (res.selected) return res;
								}).length > 0 && options.filter(res => {
									if (res.selected) return res;
								})[0].docTypeDesc}
							</label>
						</div>

						<div className="col-lg-6 mt-3 d-flex w-100 delete-block">
							{saveForm ? (
								""
							) : (
									<Select
										className="w-100 fs-12 create-lead-form-select"
										options={options}
										title="Document Type"
										onChangeFunc={(name, value, error) => {
											onInputChange(name, value, error);
										}}
										name="selectedDocument"
										isReq={true}
										value={selectedDocument}
										error={errors.selectedDocument}
										disabled={
											options.filter(res => {
												if (res.selected) return res;
											}).length > 0 || (props.loading || loading) && true

										}
										labelKey="docTypeDesc"
										valueKey="id"
									/>
								)}
							{!saveForm &&
								options.filter(res => {
									if (
										res.docTypeDesc.includes(props.subsectionName) &&
										res.selected
									)
										return res;
								}).length > 0 && (
									<i
										class={`fas ${
											!loading
												? "fa-trash-alt delete-icon"
												: "fa-spinner fa-spin delete-icon"
											} `}
										onClick={() => {
											if (!loading)
												DeleteDocument(
													state,
													setState,
													props,
													utilState,
													utilSetState
												);
										}}
									></i>
								)}
						</div>
					</div>
					<div className="row mt-3">
						<div className="col-lg-6 mt-3 d-flex w-100 delete-block">
							{saveForm ? (
								""
							) : (
									<Select
										className="w-100 fs-12 create-lead-form-select"
										options={CommonFileType}
										title="Document Type"
										onChangeFunc={(name, value, error) => {
											onInputChange(name, value, error);
										}}
										name="documentType"
										isReq={true}
										value={documentType}
										error={errors.documentType}
										disabled={
											options.filter(res =>
												res.selected.toString().includes(true)
											).length > 0 || (props.loading || loading) && true

										}
									/>
								)}
							{!saveForm &&
								options.filter(res => {
									if (res.selected) return res;
								}).length > 0 && (
									<i
										class={`fas ${
											!loading
												? "fa-trash-alt delete-icon"
												: "fa-spinner fa-spin delete-icon"
											} `}
										onClick={() => {
											if (!loading)
												DeleteDocument(
													state,
													setState,
													props,
													utilState,
													utilSetState
												);
										}}
									></i>
								)}
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col-lg-12">
					<div className="row mt-3">
						<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>
						<div className="col-md-8 col-lg-12 mt-2 mt-lg-0">
							{!saveForm && file.length < 3 && (
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
											error={errors.file}
											onChangeFunc={onInputChange}
											validationFunc={onInputValidate}
											fileType={
												documentType == ".jpg" ? ".jpeg,.jpg" : documentType
											}
											ismultiple={false}
											size="5120"
											disabled={
												options.filter(res =>
													res.selected.toString().includes(true)
												).length > 0 || (props.loading || loading) && true
											}
										/>
										<h6 className="my-3">OR</h6>
										<h6>Drop your files here</h6>
									</label>
								</div>
							)}
							{file.length > 0 && (
								<div className="dragdrop_box imageDropBox d-flex align-items-center mt-3 ">
									{file.map((res, index) => {
										let name = "";
										if (res && typeof res == "object") {
											var urlCreator = window.URL || window.webkitURL;
											var imageUrl = urlCreator.createObjectURL(res);
											name = res.name;
										} else {
											res.split("/").map((response, index) => {
												if ((index = res.split("/").length - 1)) {
													name = response;
												}
											});
											imageUrl = FileUrl + res;
										}
										return (
											<div className="imagePreview text-center ml-3 position-relative">
												{!saveForm &&
													options.filter(res =>
														res.selected.toString().includes(true)
													).length == 0 && (
														<button
															className="imageRemoveBtn"
															type="button"
															onClick={() => {
																RemoveImage(index);
															}}
														></button>
													)}

												<div className="imageThumb p-2">
													{CommonFileType.filter(res =>
														res.value.includes(documentType)
													).length > 0 &&
														CommonFileType.filter(res =>
															res.value
																.toLowerCase()
																.includes(documentType.toLowerCase())
														)[0].type == "image" ? (
															<img src={imageUrl} alt="Image" />
														) : (
															<img
																src="/images/pdf-file.svg"
																className="img-fluid"
																alt="Icon Zip"
															/>
														)}
												</div>

												<div
													className="imageName p-2 break-text cursor-pointer"
													onClick={() => {
														ForceDownload(imageUrl, name);
													}}
												>
													{name}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
					<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>

					{!props.sectionFreez && (
						<div className="row mt-4">
							<div className="col-sm-12">
								<div className="text-right">
									{!saveForm &&
										options.filter(res =>
											res.selected.toString().includes(true)
										).length > 0 && (
											<button
												className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
												onClick={CancelButton}
											>
												Cancel
                      </button>
										)}
									{(saveForm ||
										options.filter(res => {
											if (res.selected) return res;
										}).length == 0) && (
											<button
												disabled={loading || !documentFormStatus}
												className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16  ${documentFormStatus &&
													"btn-green"}`}
												onClick={() => {
													if (!saveForm) {
														AddDocument(
															state,
															setState,
															props,
															utilState,
															utilSetState
														);
													} else {
														utilSetState({ ...utilState, saveForm: false });
													}
												}}
											>
												{loading ? "Saving..." : saveForm ? "Edit" : "Save"}
											</button>
										)}
								</div>
							</div>
						</div>
					)}
					{props.sectionSwitch.toString() == "true" && <hr class="bg_lightblue border-0 h-1px" />}
				</div>

			</div>

		</>
	);
};
export const DropDownForm = withRouter(DropDownComponent);
