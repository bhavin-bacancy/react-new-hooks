import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import { withRouter } from "react-router-dom";
import { Input, File, Select } from "../../../Component/Input";
import {
	postAddTanDetail,
	postTanDocUpload,
	postTanNameByTanNumber,
	postDeleteTanDetail
} from "../../../Utility/Services/QDE";
import { getFormDetails } from "../../../Utility/Helper";
import jsZip from "jszip";
import { te, ts } from "../../../Utility/ReduxToaster";
import { API_URL, FileUrl } from "../../../Utility/Config";
import fileSave from "file-saver";

const initForm = {
	tanNumber: "",
	file: [],
	tanName: "",
	tanFileType: "",
	tanApplicable: "",
	errors: { tanNumber: null, file: null, tanFileType: null }
};
const TanNonIndividual = props => {
	const [state, setState] = useState({
		form: cloneDeep(initForm),
		tanOpen: false,
		saveForm: false,
		loading: false,
		verifyTan: false,
		verifyLoading: false
	});
	let { leadDetail } = props;
	let { tanOpen, form, saveForm, loading, verifyTan, verifyLoading } = state;
	let { file, errors, tanNumber, tanFileType, tanName } = form;
	let { match } = props;
	const tanOpenSection = () => {
		setState({ ...state, tanOpen: !tanOpen });
	};
	const onInputChange = (name, value, error = undefined) => {
		const { form } = state;
		if (name == "file") {
			form[name] = [];
			form[name].push(value);
		} else {
			form[name] = value;
			if (name == "tanFileType") {
				let { file } = state.form;
				file.splice(0, 1);
				setState({ ...state, form: { ...state.form, file: file } });
			}
		}
		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		setState({ ...state, form });
	};
	const onInputValidate = (name, error) => {
		let { errors } = state.form;
		errors[name] = error;
		setState({ ...state, form: { ...state.form, errors: errors } });
	};
	const RemoveImage = index => {
		let { file } = state.form;
		file.splice(index, 1);
		setState({ ...state, form: { ...state.form, file: file } });
	};
	useEffect(() => {
		FormUpdate();
	}, [props.leadDetail]);

	const FormUpdate = () => {
		let { leadDetail } = props;
		let { form } = state;

		form.file = [];
		Object.keys(form).map(res => {
			if (leadDetail[res]) {
				form[res] = leadDetail[res];
			}
			if (res == "file") {
				leadDetail && leadDetail.tanDocumentPath &&
					form.file.push(leadDetail.tanDocumentPath);
			}

		});
		setState({
			form,
			saveForm: leadDetail.tanDetailsFlag ? true : false,
			tanDetailsFlag: leadDetail.tanDetailsFlag
		});
	};

	const handleCheckChange = changeEvent => {
		if (changeEvent.target.checked) {
			setState({
				...state,
				form: { ...state.form, tanApplicable: false }
			});
		} else {
			setState({ ...state, form: { ...state.form, tanApplicable: true } });
		}
	};

	const VerifyTan = () => {
		setState({ ...state, verifyLoading: true });
		postTanNameByTanNumber({ tan: tanNumber }).then(res => {
			if (res.error) {
				setState({ ...state, verifyLoading: false, verifyTan: false });
				return;
			}
			if (res.data.error == "true") {
				te("Please check TAN no.");
				setState({ ...state, verifyLoading: false, verifyTan: false });
			} else if (res.data.error == "false") {
				ts("Tan number verified successfully");
				setState({
					...state,
					verifyLoading: false,
					form: { ...form, tanName: res.data.data.tan_name },
					verifyTan: true
				});
			}
		});
	};

	const editVerifyTan = () => {
		setState({ ...state, verifyTan: false });
	};

	const onDelete = () => {
		let obj = {
			leadCode: match.params.leadcode,
			mobileNumber: match.params.mobileno,
			mainapplicant: leadDetail.mainapplicant,
			custcode: leadDetail.custcode ? leadDetail.custcode : ""
		}
		postDeleteTanDetail(obj).then(res => {
			if (res.error) return
		});
	}

	const HandleSubmit = async () => {
		setState({ ...state, loading: true });
		if (form.tanApplicable == false) {
			let obj1 = {
				leadCode: match.params.leadcode,
				mobileNumber: match.params.mobileno,
				tanNumber: null,
				tanName: null,
				tanFileType: null,
				tanDetailsFlag: true,
				tanApplicable: false
			};
			obj1.mainapplicant = false;
			obj1.custcode = leadDetail.custcode
			let res = await postAddTanDetail(obj1).then(res => res);
			if (res.error) {
				setState({ ...state, loading: false });
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				setState({ ...state, loading: false });
			} else {
				ts(res.data.message);
				onDelete();
				setState({
					...state,
					form: {
						...form,
						tanName: "",
						tanNumber: "",
						tanFileType: "",
						file: [],
						tanApplicable: false,
					},
					loading: false
				});
				props.GetLeadDetail();
			}
		} else {
			let obj = {
				leadCode: match.params.leadcode,
				mobileNumber: match.params.mobileno,
				tanNumber: form.tanNumber,
				tanName: form.tanName,
				tanFileType: form.tanFileType,
				tanDetailsFlag: true,
				tanApplicable: true
			};
			obj.mainapplicant = false;
			obj.custcode = leadDetail.custcode
			let res = await postAddTanDetail(obj).then(res => res);
			if (res.error) {
				setState({ ...state, loading: false });
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				setState({ ...state, loading: false });
			} else {
				ts(res.data.message);
				ImageConvertInZipAndUpload(tanNumber);
			}
		}
	};

	const ImageConvertInZipAndUpload = uniqueId => {
		let { leadDetail } = props;
		let { form } = state;
		let zip = new jsZip();
		let imageDetailArray = [];
		form.tanName &&
			form.tanName &&
			form.tanFileType &&
			form.file.map(file => {
				imageDetailArray.push({
					createdDate: null,
					updatedDate: null,
					createdBy: null,
					updatedBy: null,
					ipaddress: null,
					leadCode: match.params.leadcode,
					mobileNumber: match.params.mobileno,
					mainapplicant: leadDetail.mainapplicant,
					custcode: leadDetail.custcode,
					// documentId:
					// 	leadDetail &&
					// 		leadDetail.tanDocument &&
					// 		leadDetail.tanDocument[0] &&
					// 		leadDetail.tanDocument[0].documentId
					// 		? leadDetail.tanDocument[0].documentId
					// 		: 0,
					documentName: `${file.name}`,
					// documentPath: "file path",
					description: `${file.name}`,
					uniqueId: tanNumber
				});
				zip.file(`${file.name}`, file, { binary: true });
			});
		zip.generateAsync({ type: "blob" }).then(function (content) {
			//fileSave(content);
			let formData = new FormData();
			formData.append("tanDocs", JSON.stringify(imageDetailArray));
			formData.append("file", content, `${uniqueId}.zip`);
			postTanDocUpload(formData).then(uploadResponse => {
				if (uploadResponse.error) {
					setState({ ...state, loading: false });
					return;
				}
				if (uploadResponse.data.error) {
					te(uploadResponse.data.message);
					setState({ ...state, loading: false });
				} else {
					ts(uploadResponse.data.message);
					setState({ ...state, loading: false, saveForm: true });
					props.GetLeadDetail();
				}
			});
		});
	};
	let tanFormStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (res != "errors" && !form[res] && res != "file") {
			return res;
		}
		if (res == "file") {
			if (form.file.length < 1) {
				return res;
			}
		}
	});
	let formStatus = getFormDetails(form, () => { });
	if (CheckForm.length == 0 && formStatus) {
		tanFormStatus = true;
	}
	if (form.tanApplicable == false) {
		tanFormStatus = true;
	}

	return (
		<>
			<div className="gAccordion">
				<div className="gAccordion__title" onClick={tanOpenSection}>
					<i class="icon">{tanOpen ? "-" : "+"}</i> TAN (Mandatory)
        </div>
				{tanOpen && (
					<div className="gAccordion__body">
						<div className="row">
							<div className="col-md-4 col-lg-12 d-flex align-items-center"></div>
							<div className="col-md-8 col-lg-12 mt-2 mt-lg-0">
								<div className="mb-3">
									<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
										<input
											type="checkbox"
											name="tan-applicable"
											value="tan-applicable"
											onChange={handleCheckChange}
											checked={form.tanApplicable == false}
											disabled={!saveForm ? false : true}
										/>

										<span className="geekmark"></span>
										<span className="checkboxText">Not Applicable</span>
									</label>
								</div>
								<div className="row mt-3">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Tan No :
                    </label>
									</div>
									<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
										{!saveForm ? (
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value.toUpperCase(), error);
												}}
												value={tanNumber}
												name="tanNumber"
												reqType="tanNumber"
												title="Tan Number"
												isReq={true}
												error={errors.tanNumber}
												placeholder="Type Tan number"
												disabled={
													verifyTan || form.tanApplicable == false
														? true
														: false
												}
											/>
										) : (
												leadDetail && leadDetail.tanNumber
											)}
									</div>
									<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
										<button
											disabled={
												saveForm || verifyTan || !tanNumber || verifyLoading
											}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${!verifyTan &&
												"btn-green"}`}
											onClick={VerifyTan}
										>
											{verifyLoading
												? "Verifying"
												: verifyTan
													? "Verified"
													: "Verify"}
										</button>
										<button
											disabled={!verifyTan}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer ml-3 fs-16 ${verifyTan &&
												"btn-green"}`}
											onClick={editVerifyTan}
										>
											Edit
                    </button>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Tan Name :
                    </label>
									</div>
									<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
										{form.tanApplicable == false
											? leadDetail && leadDetail.tanName
											: tanName
												? tanName
												: "-"}
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Upload Document Type :
                    </label>
									</div>
									<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
										{!saveForm ? (
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={[
													{ label: "jpeg", value: ".jpeg" },
													{ label: "png", value: ".png" },
													{ label: "pdf", value: ".pdf" }
												]}
												value={tanFileType}
												title="Document Type"
												name="tanFileType"
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												isReq={true}
												error={errors.tanFileType}
												disabled={form.tanApplicable == false ? true : false}
											/>
										) : (
												leadDetail && leadDetail.tanFileType
											)}
									</div>
								</div>

								<div className="row mt-3">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Upload Document:
                    </label>
									</div>
									<div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
										{file.length < 1 && (
											<div className="w-100 rounded dragdrop_box text_lightblue d-flex flex-column align-items-center justify-content-center">
												<label
													for="selectFile"
													className="w-100 h-100 d-flex flex-column align-items-center "
												>
													<span className="btn btn-primary rounded-pill">
														<i className="fa fa-file-o"></i>&nbsp; Upload Files
                          </span>
													<File
														id="selectFile"
														className="selectFile"
														name="file"
														size="1000001"
														errors={errors.file}
														validationFunc={onInputValidate}
														onChangeFunc={onInputChange}
														fileType={tanFileType}
														disabled={
															!tanFileType || form.tanApplicable == false
														}
														ismultiple={false}
													/>
													<h6 className="my-3">OR</h6>
													<h6>Drop your files here</h6>
												</label>
											</div>
										)}
										<span className="reqEstric">{errors.file}</span>
										{file && file.length > 0 && (
											<div
												className="dragdrop_box imageDropBox d-flex align-items-center mt-3 justify-content-center position-relative"
												id="selectFileOne"
											>
												<File
													id="selectFileOne"
													className="selectFile"
													name="file"
													size="1000001"
													errors={errors.file}
													validationFunc={onInputValidate}
													onChangeFunc={onInputChange}
													fileType={tanFileType}
													disabled={!tanFileType || form.tanApplicable == false}
													ismultiple={false}
												/>
												{file &&
													file.map((res, index) => {
														let name = "";
														if (res && typeof res == "object") {
															var urlCreator = window.URL || window.webkitURL;
															var imageUrl = urlCreator.createObjectURL(res);
															name = res.name;
														} else {
															name = leadDetail && leadDetail.tanDocumentName;
															imageUrl = FileUrl + res;
														}
														return (
															<div className="imagePreview text-center ml-3 position-relative">
																{!saveForm && (
																	<button
																		className="imageRemoveBtn"
																		type="button"
																		onClick={() => {
																			RemoveImage(index);
																		}}
																	></button>
																)}
																{tanFileType === ".pdf" ? (
																	<div
																		style={{ cursor: "pointer" }}
																		onClick={() => fileSave(imageUrl)}
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
																) : (
																		<div
																			style={{ cursor: "pointer" }}
																			onClick={() => fileSave(imageUrl)}
																		>
																			<div className="imageThumb p-2">
																				<img
																					src="/images/photo.svg"
																					className="img-fluid"
																					alt="Icon Zip"
																				/>
																			</div>
																			<div className="imageName px-3 py-2 break-text">
																				{name}
																			</div>
																		</div>
																	)}
															</div>
														);
													})}
											</div>
										)}
									</div>
								</div>
								<div className="row justify-content-end mt-3 pr-0 mt-lg-0 mx-0">
									{!saveForm && leadDetail.tanDetailsFlag && (
										<button
											className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
											onClick={props.GetLeadDetail}
										>
											Cancel
                    </button>
									)}
									{!saveForm && (
										<button
											disabled={!tanFormStatus}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${tanFormStatus &&
												"btn-green"}`}
											onClick={e => {

												HandleSubmit(e);

											}}
										>
											{loading ? "Saving..." : "Save"}
										</button>
									)}
									{saveForm && (
										<button
											// disabled={!tanFormStatus}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${"btn-green"}`}
											onClick={() => {
												setState({ ...state, saveForm: false });
											}}
										>
											Edit
                    </button>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
				<hr class="bg_lightblue border-0 h-1px" />
			</div>
		</>
	);
};
export default withRouter(TanNonIndividual);
