import React, { useState, useEffect } from "react";
import { Input, TextArea, Checkbox } from "../../Component/Input";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";
import {
	getDisbursalCheckList,
	postSaveChecklist
} from "../../Utility/Services/DisbursalChecklist";
import { cloneDeep } from "lodash";
import { ts, te } from "../../Utility/ReduxToaster";
import CheckBoxMulti from "../../Component/Input/CheckBoxMulti";
const inItForm = { form: { errors: {} } };
export const DisbursalChecklistForm = props => {
	let { match, loading, checklistDetails, documents, applicantDetail } = props;
	const [state, setState] = useState(cloneDeep(inItForm));
	let data = Object.keys(documents);
	let allData =
		data &&
		data.map(res => {
			return documents[res];
		});
	let obj = cloneDeep(state.form);
	delete obj.errors;
	const SaveCheckList = (props, state, setState) => {

		postSaveChecklist({
			subcategoryIDListOfcheckedBoxes: state.form.subcategoryIDListOfcheckedBoxes,
			id: props.applicantDetail.docs.id,
			leadCode: props.match.params.leadcode,
			loanAplNumber: props.applicantDetail.data.loannumber,
			loanRefNumber: props.applicantDetail.docs.loanRefNumber
				? props.applicantDetail.docs.loanRefNumber
				: "",
			applicantName: props.applicantDetail.docs.applicantName
				? props.applicantDetail.docs.applicantName
				: "",
			applicantType: props.applicantDetail.docs.applicantType
				? props.applicantDetail.docs.applicantType
				: "",
			docSubCategoryId: state.form.docSubCategoryId,
			approveFlag: true,
			mobileNumber: props.match.params.mobileno,
			addressProofOthers: null,
			businessProofOthers: null,
			ownershipProofOthers: null,
			incomeProofOthers: null,
			gstProofOthers: null,
			bankingProofOthers: "bankingProofOthers",
			additionalOthers: null,
			applicationFormRemark: "bankingProofOthers",
			kycDocumentRemark: null,
			dedupeReportRemark: null,
			additionaldocuments_in_EDI_Remark: "bankingProofOthers",
			otherPointsRemark: null,
			technicalReportRemark: "bankingProofOthers",
			legalReportRemark: null,
			stampPapersRemark: null,
			bankersSignatureVerificationRemark: "bankingProofOthers",
			repaymentSecurityChequesRemark: "bankingProofOthers",
			bankStatementRemark: "bankingProofOthers",
			residenceOwnershipProofRemark: "bankingProofOthers",
			businessContinuityVintageProofRemark: "bankingProofOthers",
			salesIncomeTaxRemark: "bankingProofOthers",
			propertyOwnershipProofRemark: "bankingProofOthers",
			any_officially_valid_docRemark: "bankingProofOthers",
			partnership_deed_Remark: "bankingProofOthers",
			partnership_Authority_Letter_Remark: "bankingProofOthers",
			borrowing_clause_Remark: null,
			stamp_paper_with_notary_Remark: "bankingProofOthers",
			loan_structure_with_pal_Remark: "bankingProofOthers",
			trust_Society_Resolution_Remark: "bankingProofOthers",
			trust_Deed_Remark: "bankingProofOthers",
			bylaws_Remark: "bankingProofOthers",
			trust_Authority_Letter_Remark: "bankingProofOthers",
			society_Members_Remark: "bankingProofOthers",
			ca_certi_latest_List_of_direct_Remark: "bankingProofOthers",
			ca_certi_latest_Shareholding_patrn_Remark: "bankingProofOthers",
			form32_Remark: null,
			moa_AOA_Remark: null,
			company_Board_Resolution_Remark: null,
			power_of_attorney_Remark: null,
			subcategoryIDListOfcheckedBoxes: "",
			...obj
		}).then(res => {
			if (res.error) return;
			if (res.data.error) {
			} else {
				props.history.push(`${public_url.franking_fees}/${props.match.params.leadcode}/${props.applicantDetail.data.loannumber}`)
				ts(res.data.message);
			}
		});
	};
	useEffect(() => {
		FormUpdate();
	}, [documents]);
	const FormUpdate = () => {
		let Keys = Object.keys(documents);
		Keys.map(res => {
			documents[res].map(sectionData => {
				state.form[sectionData.remarkName] =
					sectionData[sectionData.remarkName];
			});
		});
		state.form.docSubCategoryId = props.applicantDetail.docs && props.applicantDetail.docs.docSubCategoryId ? props.applicantDetail.docs.docSubCategoryId : "";
		state.form.subcategoryIDListOfcheckedBoxes = props.applicantDetail.docs && props.applicantDetail.docs.subcategoryIDListOfcheckedBoxes ? props.applicantDetail.docs.subcategoryIDListOfcheckedBoxes : "";
		setState({ ...state });
	};
	const onInputChange = (name, value, error = undefined) => {
		console.log(name, value);
		if (name == "file") {
			state.form[name].push(value);
		} else {
			state.form[name] = value;
		}
		if (error !== undefined) {
			let { errors } = state;
			state.form.errors[name] = error;
		}
		setState({ ...state });
	};

	return (
		<>
			<section className="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div className="d-flex justify-content-start align-items-center">
						<section className="py-4 position-relative bg_l-secondary w-100 ">
							<div className="pb-5 bg-white">
								{loading ? (
									<div className="row">
										<div className="col-lg-12 text-primary font-weight-bold fs-24 text-center mt-5 h3 ">
											<i className="fa fa-spinner fa-spin mr-2 fa-lg" />{" "}
											Loading...
                    </div>
									</div>
								) : (
										<>
											<div className="row">
												<div className="col-lg-12 mt-3">
													<span className="font-weight-bold text-green text-primary ml-4 mt-3">
														{" "}
														{checklistDetails &&
															checklistDetails.firmName ? checklistDetails.firmName : checklistDetails.customerName}{" "}
													</span>
													<span className="text-primary text-green ml-3 mt-3">
														{" "}
														( {checklistDetails &&
															checklistDetails.typeOfEntity}{" "}
														)
                        </span>
												</div>
											</div>
											<div className="px-4 py-3">
												<p className="text-primary fw-700 ">
													Case Disbursal Credentials
                      </p>
											</div>
											<div>
												<div className="row pl-5 pr-5">
													<div className="col-lg-12">
														{allData &&
															allData.map((res, index) => {
																return res.map((dataRes, resIndex) => {
																	console.log(res[resIndex].subSection)
																	return res[resIndex].documents.map(
																		(response, sectionIndex) => (
																			<>
																				{sectionIndex == 0 && (
																					<div className="gTextPrimary font-weight-bold">
																						{data[index]}
																						<br />
																						<br />
																						<div className="gTextPrimary">	{res[resIndex].subSection != "N/A" ? res[resIndex].subSection : ""}</div>
																					</div>
																				)}
																				<div className="custom-control custom-checkbox mb-2">
																					{!response.checkboxDisburseListFlag ? <CheckBoxMulti
																						disabled={
																							!response.checkboxDisburseListFlag
																						}
																						options={[response]}
																						valueKey="id"
																						labelKey="docTypeDesc"
																						value={
																							response.selected
																								? response.id.toString()
																								: state.form.subcategoryIDListOfcheckedBoxes
																									? state.form.subcategoryIDListOfcheckedBoxes
																									: ""
																						}
																						labelClassName="custom-control-label gTextPrimary  mb-2"
																						customClass="custom-control-input"
																						name="subcategoryIDListOfcheckedBoxes"
																						onChangeFunc={(name, value) => {
																							onInputChange(name, value);
																						}}
																					/> : <>
																							<CheckBoxMulti
																								disabled={
																									!response.checkboxDisburseListFlag
																								}
																								options={[response]}
																								valueKey="id"
																								labelKey="docTypeDesc"
																								value={
																									state.form.subcategoryIDListOfcheckedBoxes ? state.form.subcategoryIDListOfcheckedBoxes : ""
																								}
																								labelClassName="custom-control-label gTextPrimary  mb-2"
																								customClass="custom-control-input"
																								name="subcategoryIDListOfcheckedBoxes"
																								onChangeFunc={(name, value) => {
																									console.log("----", name, value)
																									onInputChange(name, value);
																								}}
																							/>
																						</>}


																				</div>

																				{res[resIndex].documents.length - 1 ==
																					sectionIndex && (
																						<div className="mt-4">
																							<TextArea
																								placeholder="Remarks"
																								name={res[resIndex].remarkName}
																								value={state.form[res[resIndex].remarkName]}
																								onChangeFunc={onInputChange}
																							/>
																							<hr class="bg_lightblue border-0 h-1px" />
																						</div>
																					)}
																			</>
																		)
																	);
																})

															})}
														{/* <hr className="bg_d-primary border-0 h-1px mt-4" /> */}
													</div>
												</div>
											</div>







											<div className="row justify-content-end mt-4 pr-4 ">
												<Link
													to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
												>
													<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
														Cancel
                        </button>
												</Link>
												{/* <Link
                        to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
                      > */}
												<button
													onClick={() => {
														SaveCheckList(props, state, setState);
													}}
													className="btn btn-green btn-rounded ls-1 text-white py-1 px-5 cursor-pointer fs-16 mr-3"
												>
													Save
                      </button>
												{/* </Link> */}
											</div>
										</>
									)}
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
