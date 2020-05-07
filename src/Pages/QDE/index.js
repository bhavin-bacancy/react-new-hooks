import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import LeadDetail from "./LeadDetail";
import PanGST from "./PanGst";
import { withRouter } from "react-router-dom";
import AdditionalDetail from "./AdditionalDetail/index";
import AdharDetail from "./AdharDetail";
import ProfessionalDetail from "./ProfessionalDetail.js";
import PersonalDetails from "./ProfessionalDetail.js/PersonalDetails";
import LoanDetail from "./LoanDetail";
import Extra from "./Extra";
import { find } from "lodash";
import {
	postLeadDetail,
	postLoanDetailAsProductDetail
} from "../../Utility/Services/QDE";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { ts, te } from "../../Utility/ReduxToaster";
import { postCoApplicantDetailDetail, addCoapplicantIndNonIndDetails } from "../../Utility/Services/CoApplicant";
import Tan from "./TAN";
import PanGstNonIndividual from "./PanGstNonIndividual";
import TanNonIndividual from "./TAN/TanNonIndividual";
import ExtraNonIndividual from "./ExtraNonIndividual";
import ProfessionalNonIndividual from "./ProfessionalDetail.js/ProfessionalNonIndividual";
export default class QDE extends React.Component {
	constructor() {
		super();
		this.state = {
			selectedEntity: "",
			checkData: "",
			leadDetail: {},
			coApplicantFlagData : {},
			loanDetail: "",
			applicantOpen: false,
			currentAddress: "",
			commonData: {},
			guaranteedFlag: false,
			indNonIndFlag: ""
		};
	}
	applicantOpen = () => {
		let { applicantOpen } = this.state;
		this.setState({ applicantOpen: !applicantOpen });
	};
	OnChange = (name, value) => {		
		this.setState({ [name]: value });
	};
	componentDidMount() {
		let { match, history } = this.props;
		let { params } = match;
		if (
			!history.location.pathname.startsWith(
				public_url.co_applicant_update_profile
			)
		) {
			this.GetLeadDetail();
		}
		else{
			this.GetCoapplicantDetail();
		}
	}

	GetCoapplicantDetail = () => {
		let { match } = this.props;
		postCoApplicantDetailDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			this.setState({ leadDetail: res.data.data });
			postLoanDetailAsProductDetail(res.data.data.productId).then(res => {
				if (res.error) return;
				this.setState({ loanDetail: res.data.data });
				let Data = "";
				if (this.state.leadDetail) {
					Data = find(this.state.leadDetail.coApplicantList, {
						custcode: match.params.custcode
					});
					this.setState({
						indNonIndFlag: Data && Data.indNonIndFlag ? Data.indNonIndFlag : "individual",
						guaranteedFlag: Data && Data.guaranteedFlag
					})
				}
			});
		});
	};

	GetLeadDetail = () => {
		let { match } = this.props;
		let { params } = match;
		postLeadDetail(params.leadcode, params.mobileno).then(res => {
			if (res.error) return;
			this.setState({ leadDetail: res.data.data });
			postLoanDetailAsProductDetail(res.data.data.productId).then(res => {
				if (res.error) return;
				this.setState({ loanDetail: res.data.data });
			});
		});
	};

	FlagUpdate = name => {
		let { leadDetail } = this.state;
		this.setState({ leadDetail: { ...leadDetail, [name]: ![name] } });
	};

	handleCheckChange = e => {
		let { guaranteedFlag } = this.state;
		this.setState({
			guaranteedFlag: !guaranteedFlag
		});
	};

	onCheck = val => {
		let { indNonIndFlag, leadDetail } = this.state;
		this.setState({
			indNonIndFlag: val
		});
	};

	onSaveGurantor = () => {
		let { match } = this.props;
		let { params } = match;
		let obj = {
			leadCode: params.leadcode,
			custcode: params.custcode,
			indNonIndFlag: this.state.indNonIndFlag,
			guaranteedFlag: this.state.guaranteedFlag
		}
		addCoapplicantIndNonIndDetails(obj).then(res => {
		if (res.error) return;

		if (!res.error) {
			ts(res.data.message)
			this.setState({ coApplicantFlagData: res.data.data });
			this.GetCoapplicantDetail()
		}
		});
	}

	render() {
		let {
			selectedEntity,
			checkData,
			leadDetail,
			loanDetail,
			applicantOpen,
			commonData,
			guaranteedFlag,
			indNonIndFlag,
			coApplicantFlagData
		} = this.state;
		let { match, history, location } = this.props;
		let previousPage = "";
		let { state } = location;
		if (state) {
			previousPage = state.pathname;
		}
		let { params } = match;
		let coApplicantData = "";
		if (leadDetail) {
			coApplicantData = find(leadDetail.coApplicantList, {
				custcode: params.custcode
			});
		}
		return (
			<React.Fragment>
				{" "}
				<div className="backToDashboard py-3">
					<div className="container-fluid">
						<Link to={public_url.lead_list}>Home</Link>
					</div>
				</div>
				<BreadCrumbs leadDetail={leadDetail} />
				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div class="d-flex justify-content-start align-items-center">
							<section class="py-4 position-relative bg_l-secondary w-100 ">
								<div class="pb-5 bg-white">
									{
										<React.Fragment>
											<LeadDetail leadDetail={leadDetail} />
											<div className="gAccordion">
												<div
													className="gAccordion__title d-flex justify-content-between"
													onClick={() => {
														!history.location.pathname.startsWith(
															public_url.co_applicant_update_profile
														) && this.applicantOpen();
													}}
												>
													<div className="applicant-name font-weight-bold mb-2">
														{" "}
														<i className="icon">+</i>
														{leadDetail && leadDetail.leadcustname}
													</div>{" "}
													{history.location.pathname.startsWith(
														public_url.co_applicant_update_profile
													) && (
															<>
																<span className="text-success  profile-completed">
																	<i className="iconCircleTick"></i> Your profile
                                is completed{" "}
																</span>
																<Link
																	to={`${public_url.update_profile}/${match.params.leadcode}/${leadDetail.mobileNumber}`}
																>
																	<button
																		className={`btn btn-rounded ls-1 cursor-pointer fs-16 mr-cutom-21px edit-button btn-green bg-green text-white`}
																	>
																		{" "}
																		Edit
                                </button>
																</Link>
															</>
														)}
												</div>

												{(applicantOpen ||
													history.location.pathname.startsWith(
														public_url.update_profile
													)) && (
														<div
															className={`${history.location.pathname.startsWith(
																public_url.co_applicant_update_profile
															) && "gAccordion__body"}`}
														>
															<PanGST
																OnChange={this.OnChange}
																leadDetail={leadDetail}
																GetLeadDetail={this.GetLeadDetail}
																FlagUpdate={this.FlagUpdate}
																commonData={commonData}
															/>
															{leadDetail &&
																leadDetail.pansectionflag &&
																selectedEntity && (
																	<React.Fragment>
																		<AdditionalDetail
																			selectedEntity={selectedEntity}
																			leadDetail={leadDetail}
																			GetLeadDetail={this.GetLeadDetail}
																			FlagUpdate={this.FlagUpdate}
																			commonData={commonData}
																			OnChange={this.OnChange}
																		/>
																		{leadDetail &&
																			leadDetail.pansectionflag &&
																			selectedEntity == 1 && (
																				<AdharDetail
																					leadDetail={leadDetail}
																					GetLeadDetail={this.GetLeadDetail}
																					FlagUpdate={this.FlagUpdate}
																				/>
																			)}
																		{leadDetail && leadDetail.pansectionflag && (
																			<Tan
																				leadDetail={leadDetail}
																				GetLeadDetail={this.GetLeadDetail}
																			/>
																		)}
																		{leadDetail && leadDetail.pansectionflag && (
																			<ProfessionalDetail
																				checkData={checkData}
																				selectedEntity={selectedEntity}
																				leadDetail={leadDetail}
																				GetLeadDetail={this.GetLeadDetail}
																				FlagUpdate={this.FlagUpdate}
																			/>
																		)}

																		{leadDetail &&
																			leadDetail.pansectionflag &&
																			selectedEntity != 1 && (
																				<LoanDetail
																					selectedEntity
																					leadDetail={leadDetail}
																					loanDetail={loanDetail}
																					GetLeadDetail={this.GetLeadDetail}
																					FlagUpdate={this.FlagUpdate}
																				/>
																			)}
																		{leadDetail && leadDetail.pansectionflag && (
																			<Extra
																				selectedEntity={selectedEntity}
																				leadDetail={leadDetail}
																				GetLeadDetail={this.GetLeadDetail}
																				FlagUpdate={this.FlagUpdate}
																			/>
																		)}
																	</React.Fragment>
																)}
														</div>
													)}
											</div>
										</React.Fragment>
									}
									
									{history.location.pathname.startsWith(
												public_url.co_applicant_update_profile
											)  &&
												 (
													<div className="gAccordion">
														<div className="gAccordion__title">
															<i className="icon">-</i> Co-applicant
		
															<div className="c_radiobtn row pl-5 ml-4">
																<label className="main styleGreen text-primary pl-3 my-lg-2 ">
																	<input
																		type="radio"
																		name="individual"
																		value="individual"
																		id="individual"
																		onChange={() => this.onCheck("individual")}
																		disabled={coApplicantData && !coApplicantData.indNonIndFlag ? false : true}
																		checked={indNonIndFlag == "individual"}
																	/>
																	<label className="fw-500" htmlFor="individual">
																		Individual
                     							 </label>
																</label>
													<label className="main styleGreen text-primary my-lg-2">
														<input
															type="radio"
															name="non-individual"
															value="non-individual"
															id="non-individual"
															disabled={coApplicantData && !coApplicantData.indNonIndFlag ? false : true}
															onChange={() => this.onCheck("non-individual")}
															checked={indNonIndFlag == "non-individual"}
														/>
														<label className="fw-500" htmlFor="non-individual">
															Non-Individual
                     				</label>								
														</label>
														</div>

															<div className="row pl-9">
																<label className="main styleGreen text-primary pl-4 my-lg-3">
																	<input
																		type="checkbox"
																		name="guaranteedFlag"
																		value="guaranteedFlag"
																		disabled={coApplicantData && !coApplicantData.indNonIndFlag ? false : true}
																		onChange={this.handleCheckChange}
																		checked={guaranteedFlag == true}
																	/>
																	<span className="geekmark"></span>
																	<span className="checkboxText">Is Guarantor</span>
																</label>
															</div>
															{
																coApplicantData && !coApplicantData.indNonIndFlag &&
																<div className="d-flex justify-content-end">
																	<button onClick={this.onSaveGurantor} className={`btn btn-rounded ls-1 cursor-pointer fs-16 mr-cutom-21px edit-button btn-green bg-green text-white`}>
																		Save
																	</button>
																</div>
															}
														</div>

													{
														 coApplicantData && coApplicantData.indNonIndFlag == "individual" &&
														<div className="gAccordion__body">
															<PanGST
																OnChange={this.OnChange}
																leadDetail={coApplicantData && coApplicantData}
																GetLeadDetail={this.GetCoapplicantDetail}
																FlagUpdate={this.FlagUpdate}
																selectedEntity="1"
																commonData={commonData}
															/>
															{coApplicantData &&
																coApplicantData.pansectionflag &&
																selectedEntity && (
																	<React.Fragment>
																		<AdditionalDetail
																			selectedEntity={1}
																			leadDetail={coApplicantData && coApplicantData}
																			GetLeadDetail={this.GetCoapplicantDetail}
																			FlagUpdate={this.FlagUpdate}
																			custcode={params.custcode}
																			commonData={commonData}
																			OnChange={this.OnChange}
																		/>
																		<AdharDetail
																			OnChange={this.OnChange}
																			leadDetail={coApplicantData && coApplicantData}
																			GetLeadDetail={this.GetCoapplicantDetail}
																			FlagUpdate={this.FlagUpdate}
																			selectedEntity="1"
																		/>
																		<Tan
																			leadDetail={coApplicantData && coApplicantData}
																			GetLeadDetail={this.GetCoapplicantDetail}
																			selectedEntity={1}
																		/>
																		<ProfessionalDetail
																			checkData={checkData}
																			selectedEntity={1}
																			leadDetail={coApplicantData && coApplicantData}
																			GetLeadDetail={this.GetCoapplicantDetail}
																			FlagUpdate={this.FlagUpdate}
																		/>
																		<PersonalDetails
																			checkData={checkData}
																			selectedEntity={1}
																			leadDetail={coApplicantData && coApplicantData}
																			GetLeadDetail={this.GetCoapplicantDetail}
																			FlagUpdate={this.FlagUpdate}
																		/>
																		<Extra
																			selectedEntity="1"
																			leadDetail={coApplicantData && coApplicantData}
																			GetLeadDetail={this.GetCoapplicantDetail}
																			FlagUpdate={this.FlagUpdate}
																		/>
																	</React.Fragment>
																)}
														</div>
													}
													{
														 coApplicantData && coApplicantData.indNonIndFlag == "non-individual" &&
														<div className="gAccordion__body">
															<PanGstNonIndividual
																OnChange={this.OnChange}
																leadDetail={coApplicantData && coApplicantData}
																GetLeadDetail={this.GetCoapplicantDetail}
																FlagUpdate={this.FlagUpdate}
																commonData={commonData}
															/>
													{coApplicantData &&
														coApplicantData.pansectionflag &&
														(
															<React.Fragment>
																<AdditionalDetail
																	leadDetail={coApplicantData && coApplicantData}
																	GetLeadDetail={this.GetCoapplicantDetail}
																	FlagUpdate={this.FlagUpdate}
																	custcode={params.custcode}
																	commonData={commonData}
																	OnChange={this.OnChange}
																	coApplicantFlagData={coApplicantFlagData}
																/>
																<TanNonIndividual
																	leadDetail={coApplicantData && coApplicantData}
																	GetLeadDetail={this.GetCoapplicantDetail}
																/>
																<ProfessionalNonIndividual
																	checkData={checkData}
																	leadDetail={coApplicantData && coApplicantData}
																	GetLeadDetail={this.GetCoapplicantDetail}
																	FlagUpdate={this.FlagUpdate}
																	selectedEntity={selectedEntity}
																/>
																<ExtraNonIndividual
																	leadDetail={coApplicantData && coApplicantData}
																	GetLeadDetail={this.GetCoapplicantDetail}
																	FlagUpdate={this.FlagUpdate}
																/>
															</React.Fragment>
														)}
														</div>
													}
													</div>
												)}
											<div className="gAccordion">
												<div className="mr-4px">
													<div class="row justify-content-end mt-5 mx-0  ">
														{history.location.pathname.startsWith(
															public_url.co_applicant_update_profile
														) && (
																<Link
																	to={
																		previousPage
																			? previousPage
																			: public_url.prospect_list
																	}
																>
																	<button
																		className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green mr-3 `}
																	>
																		Cancel
                            </button>
																</Link>
															)}
														{history.location.pathname.startsWith(
															public_url.co_applicant_update_profile
														) &&
															coApplicantData &&
															// coApplicantData.adhardtlsflag && //commented addhar flag as per kirti and vivek
														  coApplicantData.personaldtlsflag &&
															coApplicantData.professionaldtlsflag &&
															//coApplicantData.altcntflag &&
															coApplicantData.curraddflag &&
															coApplicantData.pansectionflag &&
															coApplicantData.tanDetailsFlag &&
															//coApplicantData.loandtlsflag &&
															coApplicantData.commaddflag && (
																<Link
																	to={`${public_url.co_applicant_summary_page}/${params.leadcode}/${params.comobileno}/${params.custcode}`}
																>
																	<button className="btn text-white btn-rounded ls-1 py-1 px-5 cursor-pointer fs-16 bg-green btn-green mr-3">
																		Next
                              </button>
																</Link>
															)}
																{history.location.pathname.startsWith(
															public_url.co_applicant_update_profile
														) &&
															coApplicantData && coApplicantData.indNonIndFlag == "non-individual" &&
															// coApplicantData.adhardtlsflag && //commented addhar flag as per kirti and vivek
															coApplicantData.professionaldtlsflag &&
															//coApplicantData.altcntflag &&
															coApplicantData.curraddflag &&
															coApplicantData.pansectionflag &&
															coApplicantData.tanDetailsFlag &&
															//coApplicantData.loandtlsflag &&
															coApplicantData.commaddflag && (
																<Link
																	to={`${public_url.co_applicant_summary_page}/${params.leadcode}/${params.comobileno}/${params.custcode}`}
																>
																	<button className="btn text-white btn-rounded ls-1 py-1 px-5 cursor-pointer fs-16 bg-green btn-green mr-3">
																		Next
                              </button>
																</Link>
															)}
													</div>
												</div>
											</div>
											<div className="gAccordion">
												<div class="row justify-content-end mt-4 mx-0 ">
													<div className="col-sm-12 text-right">
														{!history.location.pathname.startsWith(
															public_url.co_applicant_update_profile
														) && (
																<Link
																	to={
																		previousPage ? previousPage : public_url.lead_list
																	}
																>
																	<button
																		className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green  mr-5px `}
																	>
																		Cancel
                            </button>
																</Link>
															)}
														{!history.location.pathname.startsWith(
															public_url.co_applicant_update_profile
														) &&
															selectedEntity != 1 &&
															leadDetail &&
															leadDetail.pansectionflag &&
															leadDetail.addressFlag &&
															leadDetail.professionaldtlsflag &&
															leadDetail.tanDetailsFlag &&
															//leadDetail.altcntflag &&
															leadDetail.curraddflag &&
															leadDetail.loandtlsflag &&
															leadDetail.commaddflag && (
																<Link
																	to={`${public_url.update_profile_summary}/${params.leadcode}/${params.mobileno}`}
																>
																	<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green mr-5px ml-cutom-11px">
																		Next
                              </button>
																</Link>
															)}
													</div>
												</div>
											</div>
										</div>
							</section>
						</div>
					</div>
				</section>
			</React.Fragment>
					);
					return (
			<React.Fragment>
						<div className="backToDashboard py-3">
							<div className="container-fluid">
								<a href="#">Back to Dashboard</a>
							</div>
						</div>
						{/* <BreadCrumb /> */}
						<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
							<div className="container">
								<div className="bg-white p-md-4 p-3">
									<div className="d-flex flex-wrap align-items-center mb-4">
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3">
											- Mr. Shashannk Dighe
                </h2>
										<button className="btn btn-secondary btn-rounded text-primary ls-1 cursor-pointer fs-18 ">
											Edit
                </button>
									</div>
									<div className="row">
										<div className="col-md-6 pl-lg-5">
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														Contact details
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														PAN and GST verification
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														Additional Details
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														Aadhaar Details
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														Professional Profile
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														Loan Details
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
											<div className="row mb-3">
												<div className="col-10 col-md-5">
													<label className="fs-14 mb-0 gTextPrimary fw-700">
														Extras
                      </label>
												</div>
												<div className="col-2 col-md-2">
													<i className="iconCircleTick"></i>
												</div>
											</div>
										</div>
										<div className="col-md-6 align-items-center justify-content-center d-flex">
											<p className="colorGreen">Your profile is completed!</p>
										</div>
										<div className="col-12 text-sm-right">
											<button className="btn mr-3 btn-navy-blue btn-rounded fs-16 mb-md-0 mb-2">
												Add Co-applicant
                  </button>
											<button className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2">
												Create Loan
                  </button>
										</div>
									</div>
								</div>

								{/* Congratulations Box */}
								<div className="bg-white p-md-4 p-3 text-center mt-5">
									<h2 className="colorGreen fs-18 mb-md-5 mb-4 my-3">
										Congratulations!!
              </h2>
									<h2 className="mr-auto text-primary fs-20 mb-md-5 mb-4 fs-900">
										- Mr. Shashannk Dighe
              </h2>
									<p className="mr-auto text-primary fs-18 mb-md-5 mb-4">
										Your Reference ID has been <br /> creaetd
              </p>
									<h2 className="colorGreen fs-20 mb-md-5 mb-4 my-3">
										XXXXXXXXXXX
              </h2>

									<div className="text-sm-right">
										<button className="btn btn-secondary mr-3 text-primary btn-rounded fs-16 mb-md-0 mb-2">
											Previous
                </button>
										<button className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2">
											Next
                </button>
									</div>
								</div>
							</div>
						</section>
					</React.Fragment>
					);
				}
			}
