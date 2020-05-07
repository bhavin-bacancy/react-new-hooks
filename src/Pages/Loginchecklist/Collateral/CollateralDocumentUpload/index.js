import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { Select, File } from "../../../../Component/Input";
import { Form } from "./Form";
import { cloneDeep } from "lodash";
import { postGetCollateralDetailAndCoapplicant } from "../../../../Utility/Services/CollateralDetail";
import { te } from "../../../../Utility/ReduxToaster";
import Slider from "react-slick";
import { getFormDetails } from "../../../../Utility/Helper";
const initialState = {
	mainapplicant: "",
	coApplicant: [],
	document: "",
	form: { errors: {} },
	selectedApplicantResponse: "",
	loading: false
};


let settings = {
	focusOnSelect: true,
	infinite: false,
	slidesToShow: 4,
	slidesToScroll: 1,
	speed: 500,

	/* 	className: "center",
			centerMode: true,
			centerPadding: "60px", */
};

const GetCollateralDocumentandApplicant = (state, setState, props) => {
	let { match } = props;
	let { params } = match;
	state.loading = true;
	setState({ ...state });
	postGetCollateralDetailAndCoapplicant(
		params.leadcode,
		params.mobileno,
		match.path == "/collateral-document-upload/:leadcode/:mobileno"
			? true
			: false
	).then(res => {
		if (res.error) {
			return;
		}
		if (res.data.error) {
			te(res.data.message);
			state.loading = false;
			setState({ ...state });
		} else {
			state.mainapplicant = res.data.applicant;
			state.coApplicant = res.data.applicant.coApplicantList;
			state.document = res.data.docs.docMap;
			state.loading = false;
			state.selectedApplicantResponse = state.selectedApplicantResponse
				? state.selectedApplicantResponse
				: window.location.pathname.startsWith(
					public_url.coapplicant_collateral_document_upload
				)
					? res.data.applicant.coApplicantList.filter(filterData =>
						filterData.mobileNumber.includes(params.mobileno)
					)[0]
					: res.data.applicant;
			MakeForm(res.data.docs.docMap, state);
			setState({ ...state });
		}
	});
};
const MakeForm = (document, state) => {
	Object.keys(document).map(res => {
		Object.keys(document[res]).map(response => {
			if (document[res][response].subSection == "N/A") {
				if (document[res][response].mandatory) {
					let sectionStatusFlag = false;
					if (
						document[res][response].documents.filter(filterResponse =>
							filterResponse.selected.toString().includes(true)
						).length > 0
					) {
						sectionStatusFlag = true;
					}
					state.form[res] = sectionStatusFlag ? "Filled" : "";
					state.form.errors[res] = sectionStatusFlag ? "" : true;
				}
			} else {
				if (document[res][response].mandatory) {
					let sectionStatusFlag = false;
					if (
						document[res][response].documents.filter(filterResponse =>
							filterResponse.selected.toString().includes(true)
						).length > 0
					) {
						sectionStatusFlag = true;
					}
					state.form[document[res][response].subSection] = sectionStatusFlag
						? "Filled"
						: "";
					state.form.errors[
						document[res][response].subSection
					] = sectionStatusFlag ? "" : true;
				}
			}
		});
	});
};
const ApplicantButtonClick = (props, objBody = {}, state, setState) => {
	state.selectedApplicantResponse = objBody;
	setState({ ...state });
	if (objBody.userStatus == "applicant") {
		props.history.push(
			`${public_url.collateral_document_upload}/${objBody.leadCode}/${objBody.mobileNumber}`
		);
	} else {
		props.history.push(
			`${public_url.coapplicant_collateral_document_upload}/${objBody.leadCode}/${objBody.mobileNumber}`
		);
	}
};
export const CollateralDocumentUpload = props => {
	const [state, setState] = useState(cloneDeep(initialState));
	let {
		coApplicant,
		mainapplicant,
		document,
		selectedApplicantResponse,
		form,
		loading
	} = state;
	let { match } = props;
	let { params } = match;
	useEffect(() => {
		GetCollateralDocumentandApplicant(state, setState, props);
	}, [params.mobileno]);
	let documentArray = Object.keys(document);
	const Next = () => {
		props.history.push(
			`${public_url.checklist}/${params.leadcode}/${params.mobileno}`
		);
	};
	let documentSectionStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (res != "errors" && !state.form[res]) {
			return res;
		}
	});

	let formStatus = getFormDetails(form, () => { });

	if (CheckForm.length == 0 && formStatus) {
		documentSectionStatus = true;
	}
	if (mainapplicant) {
		let name = mainapplicant.firmName
			? mainapplicant.firmName
			: mainapplicant.customerName;
		console.log("mainapplicant", name);
		settings.slidesToShow = name.length > 32 ? 2 : 4;
	}
	//console.log(document);
	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs />
			<>
				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div class="d-flex justify-content-start align-items-center">
							<section class="py-4 position-relative bg_l-secondary w-100 ">
								<div class="pb-5 bg-white">
									{loading && (
										<div className="row">
											<div className="col-lg-12 mt-3 ">
												<h3 className="font-weight-bold text-primary ml-3 mt-3 text-center">
													<i className="fa fa-spinner fa-spin mr-2" />
													Loading...
                        </h3>
											</div>
										</div>
									)}
									{mainapplicant && (
										<>
											<div className="row m-1">
												<div className="col-lg-12 pl-4 pr-5 mt-3 ">
													<div className="ml-3 mt-3 mb-3">
														{/* <Slider {...settings} className=""> */}
														<div>
															<button
																className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-2 ${selectedApplicantResponse.cif ==
																	mainapplicant.cif && "btn-green"} `}
																id={"applicantName"}
																value={
																	mainapplicant.firmName
																		? mainapplicant.firmName
																		: mainapplicant.customerName
																}
																onClick={() => {
																	mainapplicant.userStatus = "applicant";
																	ApplicantButtonClick(
																		props,
																		mainapplicant,
																		state,
																		setState
																	);
																}}
															>
																{mainapplicant.firmName
																	? mainapplicant.firmName
																	: mainapplicant.customerName}
															</button>

															{coApplicant &&
																coApplicant.map(res => {
																	return (
																		// <div className="pl-2 pr-2">
																		<button
																			className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-2 ${selectedApplicantResponse.id ==
																				res.id && "btn-green"}`}
																			onClick={() => {
																				res.userStatus = "co-applicant";
																				ApplicantButtonClick(
																					props,
																					res,
																					state,
																					setState
																				);
																			}}
																		>
																			{res.firmName
																				? res.firmName
																				: res.customerName}
																		</button>
																		// </div>
																	);
																})}
															<br />
														</div>
														{/* </Slider> */}
													</div>
												</div>
												{/* <div className="col-lg-3 mt-4 ml-3 text-primary float-right text-right  font-weight-bold">
                      <span>+ Add another Collateral</span>
                    </div> */}
											</div>
											<div className="row">
												<div className="col-lg-6 mt-3 ml-5 ">
													<span className="text-secondary font-weight-bold">
														Documents Upload
                          </span>
												</div>
											</div>
											<div className="collateral-detail-page">
												{documentArray.map(res => {
													let section = [];
													Object.keys(document[res]).map(response => {

														section.push(
															<Form
																options={document[res][response].documents}
																name={res}
																data={selectedApplicantResponse}
																subsectionName={
																	document[res][response].subSection
																}
																mandtory={document[res][response].mandatory}
																GetCollateralDocumentUpload={() => {
																	GetCollateralDocumentandApplicant(
																		state,
																		setState,
																		props
																	);
																}}
															/>
														);
													});
													return section;
												})}
											</div>

											{/* <hr class="bg_lightblue border-0 h-1px" /> */}
											<div className="row mt-3 mr-3">
												<div className="col-sm-12">
													<div className="text-right">
														<Link
															to={`${public_url.co_applicant_status}/${params.leadcode}`}
														>
															<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 mt-2 btn-green">
																Cancel
                              </button>
														</Link>
														{documentSectionStatus && (
															<button
																className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 mt-2 btn-green"
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
										</>
									)}
								</div>
							</section>
						</div>
					</div>
				</section>
			</>
		</>
	);
};
