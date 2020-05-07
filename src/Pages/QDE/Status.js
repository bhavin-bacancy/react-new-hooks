import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import { getLeadDetail, postCreateLoan } from "../../Utility/Services/QDE";
import { te, ts } from "../../Utility/ReduxToaster";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { cloneDeep } from "lodash";
import Modal from "react-responsive-modal";
export default class CoApplicantStatus extends React.Component {
	constructor() {
		super();
		this.state = {
			leadDetail: "",
			status: "",
			profileOpen: true,
			paymentOpen: true,
			documentOpen: true,
			checklistOpen: true,
			CollateralOpen: true,
			PromoterOpen: true,

			frankingOpen: true,

			InsuranceOpen: true,
			SanctionOpen: true,
			DisbursalChecklistOpen: true,
			disbersalDocOpen: true,
			loading: false,
			selectedAppicant: "",
			selectedNumber: "",
			paymentFlag: "",
			collateralDocumentOpen: true,
			signatoryOpen: true,
			profileLoading: false
		};
	}
	profileOpen = () => {
		let { profileOpen } = this.state;
		this.setState({ profileOpen: !profileOpen });
	};
	signatoryOpen = () => {
		let { signatoryOpen } = this.state;
		this.setState({ signatoryOpen: !signatoryOpen });
	};
	paymentOpen = () => {
		let { paymentOpen } = this.state;
		this.setState({ paymentOpen: !paymentOpen });
	};
	documentOpen = () => {
		let { documentOpen } = this.state;
		this.setState({ documentOpen: !documentOpen });
	};
	checklistOpen = () => {
		let { checklistOpen } = this.state;
		this.setState({ checklistOpen: !checklistOpen });
	};

	CollateralOpen = () => {
		let { CollateralOpen } = this.state;
		this.setState({ CollateralOpen: !CollateralOpen });
	};

	PromoterOpen = () => {
		let { PromoterOpen } = this.state;
		this.setState({ PromoterOpen: !PromoterOpen });
	};
	frankingOpen = () => {
		let { frankingOpen } = this.state;
		this.setState({ frankingOpen: !frankingOpen });
	};

	DisbursalChecklistOpen = () => {
		let { DisbursalChecklistOpen } = this.state;
		this.setState({ DisbursalChecklistOpen: !DisbursalChecklistOpen });
	};

	DisbersalDocOpen = () => {
		let { disbersalDocOpen } = this.state;
		this.setState({ disbersalDocOpen: !disbersalDocOpen });
	};

	InsuranceOpen = () => {
		let { InsuranceOpen } = this.state;
		this.setState({ InsuranceOpen: !InsuranceOpen });
	};
	SanctionOpen = () => {
		let { SanctionOpen } = this.state;
		this.setState({ SanctionOpen: !SanctionOpen });
	};
	CollateralDocumentOpen = () => {
		let { collateralDocumentOpen } = this.state;
		this.setState({ collateralDocumentOpen: !collateralDocumentOpen });
	};
	componentDidMount() {
		this.GetLeadDetail();
	}
	SelectApplicant = data => {
		this.setState({
			status: data,
			selectedAppicant: data.custcode ? data.custcode : data.mobileNumber,
			selectedNumber: data.mobileNumber
		});
	};
	GetLeadDetail = () => {
		let { match } = this.props;
		this.setState({ profileLoading: true });
		getLeadDetail(match.params.leadcode).then(res => {
			if (res.error) {
				this.setState({ profileLoading: false });
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				this.setState({ profileLoading: false });
			} else {
				res.data.data.mainapplicant.type = "applicant";
				this.setState({
					leadDetail: res.data.data,
					status: res.data.data.mainapplicant,
					selectedAppicant: res.data.data.mainapplicant.mobileNumber,
					paymentFlag: res.data.data.mainapplicant.paymentflag,
					profileLoading: false
				});
			}
		});
	};
	CreateLoan = (obj, status) => {
		let { leadDetail } = this.state;
		let { match } = this.props;
		this.setState({ loading: true });
		postCreateLoan(obj).then(res => {
			if (res.error) {
				this.setState({ loading: false });
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				this.setState({ loading: false });
			} else {
				ts(res.data.message);
			}

			if (res.data.data.nextpage == "DDE") {
				this.props.history.push(
					`${public_url.documents}/${match.params.leadcode}/${
					res.data.data.loanreferencenumber != "N/A"
						? res.data.data.loanreferencenumber
						: "not-available"
					}`
				);
			} else if (res.data.data.nextpage == "QDE") {
				this.props.history.push(
					`${
					status.type == "applicant"
						? `${public_url.update_profile}/${match.params.leadcode}/${leadDetail.mainapplicant.mobileNumber}`
						: `${public_url.co_applicant_update_profile}/${match.params.leadcode}/${status.mobileNumber}/${status.custcode}`
					}`
				);
			} else if (res.data.data.nextpage == "GO/NOGO") {
				if (res.data.data.loanstatus == "NOGO") {
					this.setState({ loading: false });
					if (status.type == "applicant") {
						if (res.data.data.loanreferencenumber == "N/A") {
							this.setState({ loading: false });
							te("Loan refrence generation has been failed.");
							return;
						}
						this.props.history.push(
							`${public_url.update_profile_refrence_number}/${
							match.params.leadcode
							}/${status.mobileNumber}/${
							res.data.data.loanreferencenumber == "N/A"
								? "not-available"
								: res.data.data.loanreferencenumber
							}/No`
						);
					} else {
						this.props.history.push(
							`${public_url.co_applicant_reference_page}/${
							match.params.leadcode
							}/${status.mobileNumber}/${status.custcode}/${
							res.data.data.loanreferencenumber != "N/A"
								? res.data.data.loanreferencenumber
								: "not-available"
							}/no`
						);
					}
				} else if (res.data.data.loanstatus == "GO") {
					this.setState({ loading: false });
					if (status.type == "applicant") {
						this.props.history.push(
							`${public_url.update_profile_refrence_number}/${
							match.params.leadcode
							}/${leadDetail && leadDetail.mainapplicant.mobileNumber}/${
							leadDetail && res.data.data.loanreferencenumber != "N/A"
								? res.data.data.loanreferencenumber
								: "not-available"
							}`
						);
					} else {
						this.props.history.push(
							`${public_url.co_applicant_reference_page}/${
							match.params.leadcode
							}/${status.mobileNumber}/${status.custcode}/${
							res.data.data.loanreferencenumber != "N/A"
								? res.data.data.loanreferencenumber
								: "not-available"
							}`
						);
					}
				}
			} else if (res.data.data.nextpage == "Payment") {
				this.props.history.push(
					`${public_url.payment_methods}/${match.params.leadcode}/${
					leadDetail.mainapplicant.mobileNumber
					}/${
					res.data.data.loanreferencenumber != "N/A"
						? res.data.data.loanreferencenumber
						: "not-available"
					}`
				);
			} else if (res.data.data.nextpage == "Pre Qual") {
				// this.props.history.push(public_url.smsVerification);
				this.props.history.push(
					`${public_url.userinfocom}/${
					res.data.data.loanreferencenumber != "N/A"
						? res.data.data.loanreferencenumber
						: "not-available"
					}/${match.params.leadcode}/${status.mobileNumber}/${status.type}`
				);
			}
		});
	};
	render() {
		let {
			leadDetail,
			status,
			profileOpen,
			paymentOpen,
			documentOpen,
			checklistOpen,
			selectedAppicant,
			loading,
			selectedNumber,
			CollateralOpen,
			PromoterOpen,
			frankingOpen,
			InsuranceOpen,
			SanctionOpen,
			DisbursalChecklistOpen,
			collateralDocumentOpen,
			disbersalDocOpen,
			signatoryOpen,
			profileLoading
		} = this.state;

		let { match } = this.props;
		let mainApplicant = "";
		let coApplicant = "";
		if (leadDetail) {
			mainApplicant = cloneDeep(
				leadDetail.mainapplicant && leadDetail.mainapplicant
			);
			coApplicant = leadDetail.coapplicantlist;
		}
		// console.log("sadsadad",mainApplicant)
		return (
			<React.Fragment>
				<div className="backToDashboard py-3">
					<div className="container-fluid">
						<Link to={public_url.lead_list}>Home</Link>
					</div>
				</div>
				<BreadCrumbs
					leadDetail={mainApplicant && mainApplicant}
					status={status}
				/>
				{profileLoading ? (
					<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
						<div className="container">
							<div className="bg-white p-md-4 p-3">
								<div className="row">
									<div className="col-lg-12 mt-3">
										<h3 className="font-weight-bold text-primary ml-3 mb-4 text-center">
											<i className="fa fa-spinner fa-spin mr-2" />
											Loading...
              			</h3>
									</div>
								</div>
							</div>
						</div>
					</section>
				)
					:
					<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
						<div className="container">
							<div className="bg-white p-md-4 p-3">
								<div className="">
									<button
										className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${mainApplicant &&
											selectedAppicant == mainApplicant.mobileNumber &&
											"btn-green"}`}
										onClick={() => {
											mainApplicant.type = "applicant";
											this.SelectApplicant(mainApplicant);
										}}
									>
										Applicant(CIF : {mainApplicant.cif})
                </button>
									{coApplicant &&
										coApplicant.map(res => {
											return (
												<button
													className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 mt-2 ${selectedAppicant ==
														res.custcode && "btn-green"}`}
													onClick={() => {
														res.type = "co-applicant";
														this.SelectApplicant(res);
													}}
												>
													Co-applicant(CIF : {res.cif})
                      </button>
											);
										})}
									<br />
								</div>
								<div
									className="d-flex flex-wrap align-items-center mb-4 mt-4"
									onClick={this.profileOpen}
								>
									<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
										{profileOpen ? " - " : " + "}
										{status.type == "applicant" && status.firmName ? status.firmName : status.customerName}
										{status.type != "applicant" && status.firmName ? status.firmName : status.firstname}
									</h2>
									{!profileOpen &&
										status.type == "applicant" &&
										status.pansectionflag &&
										status.curraddflag &&
										status.tanDetailsFlag &&
										status.commaddflag &&
										status.professionaldtlsflag &&
										status.loandtlsflag && (
											<span className="mr-5 d-flex align-items-center colorGreen">
												{" "}
												<i className="iconCircleTick mr-2"></i>Profile fully updated
                    </span>
										)}
									{!profileOpen &&
										status.type == "co-applicant" &&
										status.pansectionflag &&
										status.contdtlsflag &&
										status.adhardtlsflag &&
										status.personaldtlsflag &&
										status.tanDetailsFlag &&
										status.curraddflag &&
										status.commaddflag &&
										status.professionaldtlsflag &&
										status.loandtlsflag && (
											<span className="mr-5 d-flex align-items-center colorGreen">
												{" "}
												<i className="iconCircleTick mr-2"></i>Profile fully
												updated
                    </span>
										)}
									<br />
								</div>
								{profileOpen && (
									<>
										<div className="row">
											<div className="col-md-12 pl-lg-5">
												{status.type != "applicant" && (
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Contact Details
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.contdtlsflag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
												)}

												<div className="row mb-3">
													<div className="col-10 col-md-5">
														<label className="fs-14 mb-0 gTextPrimary fw-700">
															PAN verification
                          </label>
													</div>
													<div className="col-2 col-md-2">
														{status && status.pansectionflag ? (
															<i className="iconCircleTick"></i>
														) : (
																"X"
															)}
													</div>
												</div>
												{status && status.gstFlag && (
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																GST verification
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.gstFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
												)}

												<div className="row mb-3">
													<div className="col-10 col-md-5">
														<label className="fs-14 mb-0 gTextPrimary fw-700">
															TAN verification
                          </label>
													</div>
													<div className="col-2 col-md-2">
														{status && status.tanDetailsFlag ? (
															<i className="iconCircleTick"></i>
														) : (
																"X"
															)}
													</div>
												</div>

												{
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
												}
												{/* {status.type != "applicant" && (
                        <div className="row mb-3">
                          <div className="col-10 col-md-5">
                            <label className="fs-14 mb-0 gTextPrimary fw-700">
                              Aadhaar Details
                            </label>
                          </div>
                          <div className="col-2 col-md-2">
                            {status && status.adhardtlsflag ? (
                              <i className="iconCircleTick"></i>
                            ) : (
                              "X"
                            )}
                          </div>
                        </div>
                      )} */}

												{/* <div className="row mb-3">
                        <div className="col-10 col-md-5">
                          <label className="fs-14 mb-0 gTextPrimary fw-700">
                            Professional Profile
                          </label>
													</div>
													<div className="col-2 col-md-2">
														<i className="iconCircleTick"></i>
													</div>
												</div> */}

												{status.type != "applicant" && status.indNonIndFlag == "individual" && (
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Aadhaar Details
                          </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.adhardtlsflag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
												)}

												<div className="row mb-3">
													<div className="col-10 col-md-5">
														<label className="fs-14 mb-0 gTextPrimary fw-700">
															Professional Profile
                        </label>
													</div>
													<div className="col-2 col-md-2">
														{status && status.professionaldtlsflag ? (
															<i className="iconCircleTick"></i>
														) : (
																"X"
															)}
													</div>
												</div>
												{
													status.type == "co-applicant" && status.indNonIndFlag == "individual" &&
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Personal Profile
                        </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.personaldtlsflag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
												}
												{
													status.type === "applicant" && (
														<div className="row mb-3">
															<div className="col-10 col-md-5">
																<label className="fs-14 mb-0 gTextPrimary fw-700">
																	Loan Details
                        </label>
															</div>
															<div className="col-2 col-md-2">
																{status && status.loandtlsflag ? (
																	<i className="iconCircleTick"></i>
																) : (
																		"X"
																	)}
															</div>
														</div>
													)}
												<div className="row mb-3">
													<div className="col-10 col-md-5">
														<label className="fs-14 mb-0 gTextPrimary fw-700">
															Extras
                        </label>
													</div>
													<div className="col-2 col-md-2">
														{status && status.extrasflag ? (
															<i className="iconCircleTick"></i>
														) : (
																"X"
															)}
													</div>

													{status.status == "Consent Pending" ? (
														<div className="col-2 col-md-5 text-right">
															<Link
																to={`${
																	status.type == "applicant"
																		? `${public_url.update_profile}/${match.params.leadcode}/${mainApplicant.mobileNumber}`
																		: `${public_url.co_applicant_otp_verify}/${status.custcode}/${match.params.leadcode}`
																	}`}
															>
																<button className="btn btn-secondary mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2 btn-green">
																	Edit
                              </button>
															</Link>
														</div>
													) : (
															<div className="col-2 col-md-5 text-right">
																<Link
																	to={{
																		pathname: `${
																			status.type == "applicant"
																				? `${public_url.update_profile}/${match.params.leadcode}/${mainApplicant.mobileNumber}`
																				: `${public_url.co_applicant_update_profile}/${match.params.leadcode}/${status.mobileNumber}/${status.custcode}`
																			}`,
																		state: { pathname: window.location.pathname }
																	}}
																>
																	<button className="btn btn-secondary mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2 btn-green">
																		Edit
                              </button>
																</Link>
															</div>
														)}
												</div>
											</div>
											{/* <div className="col-md-6 align-items-center justify-content-center d-flex">
                  <p className="colorGreen">Your profile is completed!</p>
                </div> */}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</>
								)}
								{status && status.type === "applicant" && status.paymentflag && (
									<>
										<div
											className="d-flex flex-wrap align-items-center mt-4 mb-4"
											onClick={this.paymentOpen}
										>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
												{paymentOpen ? " - " : " + "} IMD Payment
                    </h2>
											{!paymentOpen && status.paymentflag && (
												<span className="mr-5 d-flex align-items-center colorGreen">
													{" "}
													<i className="iconCircleTick mr-2"></i>Payment Completed
                      </span>
											)}
											<br />
										</div>
										{paymentOpen && (
											<div className="row">
												<div className="px-lg-5 col-lg-12">
													<div className="d-lg-flex justify-content-md-between">
														<div className="text-primary">
															Payment Mode :{" "}
															<lable className="colorGreen">
																{mainApplicant &&
																	mainApplicant.paymentdetails &&
																	mainApplicant.paymentdetails.paymentType}
															</lable>
														</div>
														<div className="text-primary">
															Payment Completed :{" "}
															<lable className="colorGreen">
																{mainApplicant &&
																	mainApplicant.paymentdetails &&
																	mainApplicant.paymentdetails.createdDate}
															</lable>
														</div>
													</div>
													<div className="d-flex flex-wrap border py-3 justify-content-md-around mb-3 mt-2">
														<div className="row justify-content-left w-100 text-left">
															<div className="col-md-2">
																<label className="text-primary "> Amount:</label>
															</div>
															<div className="col-md-4">
																<label className="colorGreen ">
																	&#2352;{" "}
																	{mainApplicant &&
																		mainApplicant.paymentdetails &&
																		mainApplicant.paymentdetails.amount}
																</label>
															</div>
															<div className="col-md-4">
																<label className="text-primary">
																	fulfilled By:
                              </label>
															</div>
															<div className="col-md-2">
																<label className="">-</label>
															</div>
														</div>
													</div>
												</div>
											</div>
										)}
										<hr class="bg_lightblue border-0 h-1px" />
									</>
								)}
								{(status && status.type == "co-applicant" &&
									(status.indNonIndFlag == "individual" && status.cif != "N/A" && mainApplicant.paymentflag && status.financialstatus != "non-financial") &&
									<>
										<div
											className="d-flex flex-wrap align-items-center mb-4 mt-4"
											onClick={this.documentOpen}
										>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
												{documentOpen ? " - " : " + "} Document Upload
                    </h2>
											{!documentOpen &&
												status.itrFlag &&
												status.bnkstmtFlag &&
												status.gstFlag && (
													<span className="mr-5 d-flex align-items-center colorGreen">
														{" "}
														<i className="iconCircleTick mr-2"></i>Payment
														Completed
                        </span>
												)}
											<br />
										</div>
										{documentOpen && (
											<div className="row">
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																GST Verification
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.gstFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																ITR Upload
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.itrFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>

													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Bank Details
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.bnkstmtFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Financial Statement
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.finstmtFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															<Link
																to={`${
																	status.type == "applicant"
																		? `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
																		: `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
																	}`}
															>
																<button className="btn  mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2 bg-green btn-green">
																	Edit
                              </button>
															</Link>
														</div>
													</div>
												</div>
											</div>
										)}

										<hr class="bg_lightblue border-0 h-1px mb-2" />
									</>
								)}
								{(status && status.type === "co-applicant" && mainApplicant.paymentflag && status.cif != "N/A" &&
									status.indNonIndFlag === "non-individual" &&
									<>
										<div
											className="d-flex flex-wrap align-items-center mb-4 mt-4"
											onClick={this.documentOpen}
										>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
												{documentOpen ? " - " : " + "} Document Upload
                    </h2>
											{!documentOpen &&
												status.itrFlag &&
												status.bnkstmtFlag &&
												status.gstFlag && (
													<span className="mr-5 d-flex align-items-center colorGreen">
														{" "}
														<i className="iconCircleTick mr-2"></i>Payment
														Completed
                        </span>
												)}
											<br />
										</div>
										{documentOpen && (
											<div className="row">
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																GST Verification
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.gstFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																ITR Upload
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.itrFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Bank Details
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.bnkstmtFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Financial Statement
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.finstmtFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															<Link
																to={`${
																	status.type == "applicant"
																		? `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
																		: `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
																	}`}
															>
																<button className="btn  mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2 bg-green btn-green">
																	Edit
                              </button>
															</Link>
														</div>
													</div>
												</div>
											</div>
										)}

										<hr class="bg_lightblue border-0 h-1px mb-2" />
									</>
								)}
								{(status && status.type === "applicant" && status.paymentflag &&
									<>
										<div
											className="d-flex flex-wrap align-items-center mb-4 mt-4"
											onClick={this.documentOpen}
										>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
												{documentOpen ? " - " : " + "} Document Upload
                    </h2>
											{!documentOpen &&
												status.itrFlag &&
												status.bnkstmtFlag &&
												status.gstFlag && (
													<span className="mr-5 d-flex align-items-center colorGreen">
														{" "}
														<i className="iconCircleTick mr-2"></i>Payment
														Completed
                        </span>
												)}
											<br />
										</div>
										{documentOpen && (
											<div className="row">
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																GST Verification
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.gstFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																ITR Upload
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.itrFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Bank Details
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.bnkstmtFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
													</div>
													<div className="row mb-3">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Financial Statement
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.finstmtFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															<Link
																to={`${
																	status.type == "applicant"
																		? `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
																		: `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
																	}`}
															>
																<button className="btn  mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2 bg-green btn-green">
																	Edit
                              </button>
															</Link>
														</div>
													</div>
												</div>
											</div>
										)}
										<hr class="bg_lightblue border-0 h-1px mb-2" />
									</>
								)}

								{/* start */}
								{status && mainApplicant.paymentflag
									&& mainApplicant.typeOfEntity != "Sole Proprietory Concern" && coApplicant.typeOfEntity != "Sole Proprietory Concern"
									&& (
										<div className="mb-4 mt-4" onClick={this.PromoterOpen}>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
												{PromoterOpen ? " - " : " + "} Promoter Details
                  </h2>
											<br></br>
											<div className="row">
												{PromoterOpen && (
													<div className="col-md-6 pl-lg-5 col-lg-12">
														<div className="row mb-4">
															<div className="col-10 col-md-5">
																<label className="fs-14 mb-0 gTextPrimary fw-700">
																	Promoter Details
                            </label>
															</div>
															<div className="col-2 col-md-2">
																{leadDetail && leadDetail.promoterflag ? (
																	<i className="iconCircleTick"></i>
																) : (
																		"X"
																	)}
															</div>
															<div className="col-2 col-md-5 text-right">
																{status && status.type === "applicant" ? (
																	<Link
																		to={`${public_url.promoter_detail}/${match.params.leadcode}`}
																	>
																		<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																			Edit
                                </button>
																	</Link>
																) : (
																		<Link
																			// to={`${public_url.co_applicant_checklistview}/${match.params.leadcode}/${status.mobileNumber}`}
																			to={`${public_url.promoter_detail}/${match.params.leadcode}`}
																		>
																			<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																				Edit
                                </button>
																		</Link>
																	)}
															</div>
														</div>
													</div>
												)}
											</div>
											<hr class="bg_lightblue border-0 h-1px" />
										</div>
									)}
								{/* end */}

								{/* start */}
								{status && status.collateralFlag && (
									<div className="mb-4 mt-4" onClick={this.CollateralOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{CollateralOpen ? " - " : " + "} Collateral Details
                  </h2>
										<br></br>
										<div className="row">
											{CollateralOpen && (
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Collateral Details
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.collateralFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															{status && status.type === "applicant" ? (
																<Link
																	to={`${public_url.collateral_detail}/${match.params.leadcode}`}
																>
																	<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																		Edit
                                </button>
																</Link>
															) : (
																	<Link
																		// to={`${public_url.co_applicant_checklistview}/${match.params.leadcode}/${status.mobileNumber}`}
																		to={`${public_url.collateral_detail}/${match.params.leadcode}`}
																	>
																		<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																			Edit
                                </button>
																	</Link>
																)}
														</div>
													</div>
												</div>
											)}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}
								{/* end */}
								{/* start */}
								{status && status.insuranceFlag && (
									<div className=" mb-4" onClick={this.InsuranceOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{InsuranceOpen ? " - " : " + "} Insurance Details
                  </h2>
										<br></br>
										<div className="row">
											{InsuranceOpen && (
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Insurance Details
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.insuranceFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															{status && status.type === "applicant" ? (
																<Link
																	// to={`${public_url.checklist_view}/${match.params.leadcode}/${status.mobileNumber}`}
																	to={`${public_url.insurance_detail}/${match.params.leadcode}`}
																>
																	<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																		Edit
                                </button>
																</Link>
															) : (
																	<Link
																		// to={`${public_url.co_applicant_checklistview}/${match.params.leadcode}/${status.mobileNumber}`}
																		to={`${public_url.insurance_detail}/${match.params.leadcode}`}
																	>
																		<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																			Edit
                                </button>
																	</Link>
																)}
														</div>
													</div>
												</div>
											)}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}
								{/* end */}
								{status && status.loginDoc && (
									<div className=" mb-4" onClick={this.CollateralDocumentOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{collateralDocumentOpen ? " - " : " + "} Login Documents
                  </h2>
										<br></br>
										{collateralDocumentOpen && (
											<div className="row">
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Login Documents
                            </label>
														</div>

														<div className="col-2 col-md-2">
															<i className="iconCircleTick"></i>
														</div>
														<div className="col-2 col-md-5 text-right">
															{status && status.type === "applicant" && (
																<Link
																	// to={`${public_url.checklist_view}/${match.params.leadcode}/${status.mobileNumber}`}
																	to={`${public_url.collateral_document_upload}/${match.params.leadcode}/${status.mobileNumber}`}
																>
																	<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																		Edit
                                </button>
																</Link>
															)}
														</div>
													</div>
												</div>
											</div>
										)}
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}
								{status && status.loginDoc && status.checkListflag && (
									<div className="mb-4 mt-4" onClick={this.checklistOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{checklistOpen ? " - " : " + "} Login Checklist
                  </h2>
										<br></br>
										<div className="row">
											{checklistOpen && (
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Login CheckList
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.checkListflag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															{status && status.type === "applicant" ? (
																<Link
																	to={`${public_url.checklist_view}/${match.params.leadcode}/${status.mobileNumber}`}
																>
																	<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																		Edit
                                </button>
																</Link>
															) : (
																	<Link
																		to={`${public_url.co_applicant_checklistview}/${match.params.leadcode}/${status.mobileNumber}`}
																	>
																		<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																			Edit
                                </button>
																	</Link>
																)}
														</div>
													</div>
												</div>
											)}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}
								{status && status.checkListflag && (
									<div className="mb-4 mt-4" onClick={this.signatoryOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{signatoryOpen ? " - " : " + "} Signatory
                  </h2>
										<br></br>
										<div className="row">
											{signatoryOpen && (
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Signatory
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.signatoryDetailsFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															{status && status.type === "applicant" ? (
																<Link
																	to={`${public_url.signtory_section}/${status.loanrefnumber}/${match.params.leadcode}/${status.mobileNumber}`}
																>
																	<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																		Edit
                                </button>
																</Link>
															) : (
																	<Link
																		to={`${public_url.signtory_section}/${status.loanrefnumber}/${match.params.leadcode}/${status.mobileNumber}`}
																	>
																		<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																			Edit
                                </button>
																	</Link>
																)}
														</div>
													</div>
												</div>
											)}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}
								{status && status.type === "applicant" && status.checkListflag && mainApplicant.sanctionHideShow && (
									<div className=" mb-4" onClick={this.SanctionOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{SanctionOpen ? " - " : " + "} Sanction Letter
                  </h2>
										<br></br>
										<div className="row">
											{SanctionOpen && (
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Sanction Letter
                            </label>
														</div>

														<div className="col-2 col-md-2">
															{status && status.sanctionLetterFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															{status && status.type === "applicant" && (
																<Link
																	// to={`${public_url.checklist_view}/${match.params.leadcode}/${status.mobileNumber}`}
																	to={`${public_url.sanction_letter}/${match.params.leadcode}`}
																>
																	<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																		Edit
                                </button>
																</Link>
															)}
														</div>
													</div>
												</div>
											)}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}

								{status.paymentflag && status.sanctionLetterFlag && mainApplicant.sanctionHideShow && (
									<>
										<div className=" mb-4" onClick={this.DisbersalDocOpen}>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3">
												{disbersalDocOpen ? "-" : "+"} Disbursal Document Upload
                  </h2>
											<br></br>
											{disbersalDocOpen && (
												<div className="row">
													<div className="col-md-6 pl-lg-5 col-lg-12">
														<div className="row mb-4">
															<div className="col-10 col-md-5">
																<label className="fs-14 mb-0 gTextPrimary fw-700">
																	Disbursal Document Upload
                            </label>
															</div>

															<div className="col-2 col-md-2">
																{status.disbersalDoc ? (
																	<i className="iconCircleTick"></i>
																) : (
																		"X"
																	)}
															</div>

															{(
																<div className="col-2 col-md-5 text-right">
																	{status && status.type === "applicant" && (
																		<Link
																			// to={`${public_url.checklist_view}/${match.params.leadcode}/${status.mobileNumber}`}
																			to={`${public_url.disbrusal_upload}/${match.params.leadcode}/${status.mobileNumber}`}
																		>
																			<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																				Edit
                                  </button>
																		</Link>
																	)}
																</div>
															)}
														</div>
													</div>
												</div>
											)}

										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</>
								)}

								{/* start */}
								{status && status.disbersalDoc && mainApplicant.sanctionHideShow && (
									<>
										<div
											className="mb-4 mt-4"
											onClick={this.DisbursalChecklistOpen}
										>
											<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3">
												{DisbursalChecklistOpen ? "-" : "+"} Disbursal Checklist
                  </h2>
											<br></br>
											<div className="row">
												{DisbursalChecklistOpen && (
													<div className="col-md-6 pl-lg-5 col-lg-12">
														<div className="row mb-4">
															<div className="col-10 col-md-5">
																<label className="fs-14 mb-0 gTextPrimary fw-700">
																	Disbursal Checklist
                            </label>
															</div>
															<div className="col-2 col-md-2">
																{status && status.disbursalListFlag ? (
																	<i className="iconCircleTick"></i>
																) : (
																		"X"
																	)}
															</div>
															<div className="col-2 col-md-5 text-right">
																{status && status.type === "applicant" ? (
																	<Link
																		to={`${public_url.disbursal_checklist}/${match.params.leadcode}/${status.mobileNumber}`}
																	>
																		<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																			Edit
                                </button>
																	</Link>
																) : (
																		<Link
																			// to={`${public_url.co_applicant_checklistview}/${match.params.leadcode}/${status.mobileNumber}`}
																			to={`${public_url.disbursal_checklist}/${match.params.leadcode}/${status.mobileNumber}`}
																		>
																			<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																				Edit
                                </button>
																		</Link>
																	)}
															</div>
														</div>
													</div>
												)}
											</div>
											<hr class="bg_lightblue border-0 h-1px" />
										</div>

									</>
								)}
								{/* end */}

								{/* start */}
								{status && status.frankingFeeFlag && mainApplicant.sanctionHideShow && (
									<div className="mb-4 mt-4" onClick={this.frankingOpen}>
										<h2 className="mr-auto text-primary fs-20 mb-sm-0 mb-3 cursor-pointer">
											{frankingOpen ? " - " : " + "} Franking Fees
                  </h2>
										<br></br>
										<div className="row">
											{frankingOpen && (
												<div className="col-md-6 pl-lg-5 col-lg-12">
													<div className="row mb-4">
														<div className="col-10 col-md-5">
															<label className="fs-14 mb-0 gTextPrimary fw-700">
																Franking Fees
                            </label>
														</div>
														<div className="col-2 col-md-2">
															{status && status.frankingFeeFlag ? (
																<i className="iconCircleTick"></i>
															) : (
																	"X"
																)}
														</div>
														<div className="col-2 col-md-5 text-right">
															<Link
																to={`${public_url.franking_fees}/${match.params.leadcode}/${status.loanrefnumber}`}
															>
																<button className="btn btn-green mr-3 text-white btn-rounded fs-16 mb-md-0 mb-2">
																	Edit
                              </button>
															</Link>
														</div>
													</div>
												</div>
											)}
										</div>
										<hr class="bg_lightblue border-0 h-1px" />
									</div>
								)}

								{/* end */}

								<div className="row">
									<div className="col-md-12 mt-3 pl-lg-5">
										<div className="col-12 text-sm-right">
											<Link
												to={`${public_url.co_applicant}/${
													match.params.leadcode
													}/${mainApplicant &&
													mainApplicant.mobileNumber}/${mainApplicant &&
													mainApplicant.cif}`}
											>
												<button className="btn mr-3 btn-navy-blue btn-rounded fs-16 mb-md-0 mb-2">
													Add Co-applicant
                      </button>
											</Link>
											{status.status == "Consent Pending" ? (
												<Link
													to={`${
														status.type == "applicant"
															? `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
															: `${public_url.documents}/${match.params.leadcode}/${status.loanrefnumber}`
														}`}
												>
													<button
														disabled={loading}
														className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2"
													>
														{loading ? "Please wait..." : "Next"}
													</button>
												</Link>
											) : (
													<button
														disabled={loading}
														className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2 bg-green text-white"
														onClick={() => {
															this.CreateLoan(
																{
																	leadCode: match.params.leadcode,
																	mobileNumber:
																		mainApplicant && mainApplicant.mobileNumber
																},
																status
															);
														}}
													>
														{loading ? "Please wait..." : "Next"}
													</button>
												)}
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				}
			</React.Fragment>
		);
	}
}
