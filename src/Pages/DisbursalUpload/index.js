import React, { useState, useEffect } from "react";
import { BreadCrumbs } from "./BreadCrumbs";
import { Link } from "react-router-dom";
import { Form } from "./Form";
import { cloneDeep } from "lodash";
import { GetDisbrisalDetail, UpdatingDisbursementDocFlag } from "../../Utility/Services/DisbrusalUpload";
import { te } from "../../Utility/ReduxToaster";
import { public_url } from "../../Utility/Constant";
import { getFormDetails } from "../../Utility/Helper";
import { DropDownForm } from "./DropDownSection";
const initState = {
	document: "",
	loading: false,
	userDetail: "",
	form: { errors: {} }
};

export const DisbursalUpload = props => {
	let [state, setState] = useState({ ...cloneDeep(initState) });
	let { loading, document, userDetail } = state;

	useEffect(() => {
		GetDetail(state, setState, props);
	}, []);

	const GetDetail = (state, setState, props) => {
		let { match } = props;
		state.loading = true;
		setState({ ...state });
		return GetDisbrisalDetail(match.params.leadcode, match.params.mobileno).then(res => {
			if (res.errror) {
				state.loading = false;
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				state.loading = false;
			} else {
				state.document = res.data.docs;
				state.userDetail = res.data.data;
				state.loading = false;
				FormUpdate(res.data.docs, state, setState)
				UpdateDocFlag();
			}
			setState({ ...state });
		});
	};

	const UpdateDocFlag = () => {
		let { match } = props;
		let documentFlag;
		let CheckForm = Object.keys(state.form).filter(res => {
			if (res != "errors" && res != "file" && !state.form[res] && res != "file") {
				return res;
			}
		});
		let formStatus = getFormDetails(state.form, () => { });
		if (CheckForm.length == 0 && formStatus) {
			documentFlag = true;
		}
		else {
			documentFlag = false;
		}
		UpdatingDisbursementDocFlag(match.params.leadcode, match.params.mobileno, documentFlag).then(res => {
			if (res.errror) return;
		});
	};

	const FormUpdate = (SectionList, state, setState) => {
		let obj = { errors: {} };
		Object.keys(SectionList.docMap).map(main => {
			SectionList.docMap[main].map((res, subSectionIndex) => {
				//if(SectionList.docMap[main][subSectionIndex].)
				if (SectionList.docMap[main][subSectionIndex].subSection == "N/A") {
					res && res.documents && res.documents.map(response => {
						if ((response && response.mandatoryFlag && response.checkboxDocUploadFlag) && (!response.loginChecklistFlag || response.loginChecklistFlag && response.filePath && response.filePath[0] != "N/A")) {
							obj[response.docTypeDesc] = response.selected ? true : "";
							obj.errors[response.docTypeDesc] = response.selected ? "" : true;
						}
					});
				} else {
					obj[SectionList.docMap[main][subSectionIndex].subSection] =
						res.documents.filter(response => response.selected == true).length > 0
							? true
							: "";
					obj.errors[SectionList.docMap[main][subSectionIndex].subSection] =
						res.documents.filter(response => response.selected == true).length > 0
							? ""
							: true;
				}
			});
		});
		state.form = obj;
		setState({ ...state });
	};

	const Next = () => {
		props.history.push(
			`${public_url.disbursal_checklist}/${props.match.params.leadcode}/${props.match.params.mobileno}`
		);
	};
	let documentFormStatus = false;
	let CheckForm = Object.keys(state.form).filter(res => {
		if (res != "errors" && res != "file" && !state.form[res] && res != "file") {
			return res;
		}
	});
	let formStatus = getFormDetails(state.form, () => { });
	if (CheckForm.length == 0 && formStatus) {
		documentFormStatus = true;
	}
	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={""}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs />
			<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div class="d-flex justify-content-start align-items-center">
						<section class="py-4 position-relative bg_l-secondary w-100 ">
							<div class="pb-5 bg-white">
								<div className="container pl-4 pr-4">
									{loading && (
										<div className="row mt-4">
											<div className="col-lg-12 text-primary font-weight-bold fs-24 text-center mt-5 h3 ">
												<i className="fa fa-spinner fa-spin mr-2 fa-lg" />{" "}
												Loading...
                      </div>
										</div>
									)}
									{userDetail && (
										<div className="row">
											<div className="col-lg-12 mt-4">
												<span className="font-weight-bold text-primary mt-3">
													{" "}
													{userDetail.firmName ? userDetail.firmName : userDetail.customerName}
												</span>
												<span className=" text-primary ml-3 mt-3">
													{" "}
													( {userDetail.typeOfEntity})
                        </span>
											</div>
										</div>
									)}
									{document &&
										Object.keys(document.docMap).map((res, mainIndex) => {
											let header = res
											let headerShow = false
											return document.docMap[res].map((resdata, indexData) => {
												return document.docMap[res][indexData].documents.map(
													(response, index) => {
														if (
															document.docMap[res][indexData].documents[index]
																.checkboxDocUploadFlag &&
															(!response.loginChecklistFlag ||
																(response.loginChecklistFlag &&
																	response.filePath[0] != "N/A")) || document.docMap[res][indexData].subSection !=
															"N/A"
														)
															if (
																document.docMap[res][indexData].subSection ==
																"N/A"
															) {

																return (
																	<>
																		<Form
																			name={!headerShow && res}
																			options={
																				document.docMap[res][indexData].documents
																			}
																			subsectionName={
																				document.docMap[res][indexData].documents[
																					index
																				].docTypeDesc
																			}
																			loading={loading}
																			GetDetail={() =>
																				GetDetail(state, setState, props)
																			}
																			subSectionId={
																				document.docMap[res][indexData].documents[
																					index
																				].docSubCategoryId
																			}
																			sectionFreez={
																				document.docMap[res][indexData].documents[
																					index
																				].loginChecklistFlag
																			}
																			mandtory={
																				document.docMap[res][indexData].documents[
																					index
																				].mandatoryFlag
																			}
																			sectionSwitch={
																				document.docMap[res][indexData].documents
																					.length -
																					1 ==
																					index ||
																					document.docMap[res][indexData].documents
																						.length == 1
																					? true
																					: false
																			}
																		/>
																		{headerShow = true}
																	</>
																);

															} else {
																if (index == 0)
																	return (
																		<>
																			<DropDownForm
																				name={!headerShow && res}
																				options={
																					document.docMap[res][indexData]
																						.documents
																				}
																				subsectionName={
																					document.docMap[res][indexData]
																						.subSection
																				}
																				loading={loading}
																				GetDetail={() =>
																					GetDetail(state, setState, props)
																				}
																				subSectionId={
																					document.docMap[res][indexData]
																						.documents[index].docSubCategoryId
																				}
																				sectionFreez={
																					document.docMap[res][indexData]
																						.documents[index].loginChecklistFlag
																				}
																				mandtory={
																					document.docMap[res][indexData]
																						.documents[index].mandatoryFlag
																				}
																				sectionSwitch={
																					document.docMap[res].length - 1 == indexData ? true : false
																				}
																			/>
																			{headerShow = true}
																		</>
																	);
															}
													}
												);
											});
										})}
									{!loading && (
										<div className="row">
											<div className="col-sm-12">
												<div className="text-right">
													<Link
														to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}
													>
														<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mt-2 btn-green">
															Cancel
                            </button>
													</Link>

													{documentFormStatus && (
														<button
															className="btn btn-secondary btn-rounded ls-1 cursor-pointer ml-3 fs-16 mt-2 btn-green"
															onClick={() => {
																Next();
															}}
														>
															Next
                            </button>
													)}
												</div>
											</div>
										</div>
									)}
								</div>
								{document && loading && (
									<div className="row">
										<div className="col-lg-12 text-primary font-weight-bold fs-24 text-center mt-3 h3 ">
											<i className="fa fa-spinner fa-spin mr-2 fa-lg" />{" "}
											Loading...
                      </div>
									</div>
								)}
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
