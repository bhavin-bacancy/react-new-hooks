import React, { useState, useEffect } from "react";
import { File, Select } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import { withRouter } from "react-router-dom";
import { te, ts } from "../../../Utility/ReduxToaster";
import { CommonFileType } from "../../../Utility/Constant";
import { API_URL, FileUrl } from "../../../Utility/Config";

const initialState = {
	documentType: "",
	selectedDocument: "",
	file: [],
	errors: { documentType: null, selectedDocument: null, file: null }
};
const initUtilState = { loading: false, saveForm: false };

const UploadFormComponent = props => {
	const [state, setState] = useState({ ...cloneDeep(initialState) });
	const [utilState, utilSetState] = useState({ ...cloneDeep(initUtilState) });
	let { loading, saveForm } = utilState;
	let { selectedDocument, errors, file, documentType } = state;

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

	return (
		<>
			<div className="row ">
				<div className="col-lg-6 mt-3 mt-3 ">
					<div className="row mt-3">
						<div className="col-lg-3">
							<label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
								Section Name
              </label>
						</div>
						<div className="col-lg-6 ">
							<Select
								className="w-100 fs-12 create-lead-form-select  "
								labelKey="docTypeDesc"
								title="Proof Type"
								name="selectedDocument"
								value={selectedDocument}
								onChangeFunc={(name, value, error) => {
									onInputChange(name, value, error);
								}}
								valueKey="id"
								isReq={true}
								error={errors.selectedDocument}
							/>
						</div>
					</div>
					<div className="row mt-3">
						<div className="col-lg-3">
							<label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
								{/* Pan Card Document */}
							</label>
						</div>
						<div className="col-lg-6 ">
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
							/>
						</div>
					</div>
				</div>
				<div className="col-lg-6 mt-3 mt-3 ">
					<div className="row mt-3">
						<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>
						<div className="col-md-8 col-lg-12 mt-2 mt-lg-0">
							{file.length < 1 && (
								<div className="w-100 rounded dragdrop_box text_lightblue d-flex flex-column align-items-center justify-content-center position-relative">
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
											error={errors.file}
											onChangeFunc={onInputChange}
											validationFunc={onInputValidate}
											fileType={documentType}
											ismultiple={false}
											size="5120"
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
											imageUrl = res;
										}
										return (
											<div className="imagePreview text-center ml-3 position-relative">
												<button
													className="imageRemoveBtn"
													type="button"
												></button>
												<div className="imageName p-2 break-text">Name</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>

					<div className="col-md-4 col-lg-2 d-flex align-items-center"></div>

					<div className="row mt-3 mt-5">
						<div className="col-sm-12">
							<div className="text-right">
								<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
									Cancel
                </button>
								<button className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 `}>
									Save
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr class="bg_lightblue border-0 h-1px" />
		</>
	);
};
export const UploadForm = withRouter(UploadFormComponent);
