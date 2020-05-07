import React, { Component } from "react";
import { Select, Input, TextArea } from "../../Component/Input";
import { postCheckListByLeadCode } from "../../Utility/Services/Logchecklist";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";

export class CoapplicantChecklistview extends Component {
	state = {
		checklistDetails: {},
		documents: "",
		docs: "",
		allData: ""
	};

	componentDidUpdate(preProps) {
		let { match } = this.props;
		console.log("match", match);

		console.log("preProps", preProps);
		if (match.params != preProps.match.params) {
			this.GetchecklistDetails();
			return;
		}
	}

	componentDidMount() {
		this.GetchecklistDetails();
	}
	GetchecklistDetails = () => {
		let { match } = this.props;
		console.log("match", match);

		// let leadCode = "LAP-0185";
		// let mobileNumber = 9571423215;
		let leadCode = match.params && match.params.leadcode;
		let mobileNumber = match.params.mobileno;
		postCheckListByLeadCode(leadCode, mobileNumber, false).then(response => {
			console.log("response of checklist", response.data.data);
			console.log("response of Document", response.data.docs);

			if (response.error === false) {
				this.setState({
					checklistDetails: response.data && response.data.data,
					docs: response.data && response.data.docs,
					documents: response.data.docs && response.data.docs.docMap,
					allData:
						response.data && response.data.applicant
							? response.data && response.data.applicant
							: []
				});
			}
		});
	};

	render() {
		let { checklistDetails, documents, docs, allData } = this.state;
		let { match } = this.props;
		console.log("match", match);

		console.log("documents..", documents && documents);
		console.log("checkListDetails", checklistDetails);
		let FinancialGST =
			documents && documents.FinancialGST.filter(res => res.selected == true);
		let ApplicationForm =
			documents &&
			documents.ApplicationForm.filter(res => res.selected == true);
		console.log("ApplicationForm", ApplicationForm && ApplicationForm.length);
		let LoginFees =
			documents && documents.LoginFees.filter(res => res.selected == true);
		let AgeProof_AnyOne =
			documents && documents.AgeProof_AnyOne
				? documents &&
				documents.AgeProof_AnyOne.filter(res => res.selected == true)
				: null;
		let IdProof_AnyOne =
			documents && documents.IdProof_AnyOne
				? documents &&
				documents.IdProof_AnyOne.filter(res => res.selected == true)
				: null;
		let AddressProof_AnyOne =
			documents && documents.AddressProof_AnyOne
				? documents &&
				documents.AddressProof_AnyOne.filter(res => res.selected == true)
				: null;
		let AddressProofNonIndividual =
			documents && documents.AddressProofNonIndividual
				? documents &&
				documents.AddressProofNonIndividual.filter(
					res => res.selected == true
				)
				: null;
		let SignatureVerificationNonIndividual =
			documents && documents.SignatureVerificationNonIndividual
				? documents &&
				documents.SignatureVerificationNonIndividual.filter(
					res => res.selected == true
				)
				: null;
		let SignatureVerificationIndividual =
			documents && documents.SignatureVerificationIndividual
				? documents &&
				documents.SignatureVerificationIndividual.filter(
					res => res.selected == true
				)
				: null;
		let FinancialIncome =
			documents &&
			documents.FinancialIncome.filter(res => res.selected == true);
		let Banking =
			documents && documents.Banking.filter(res => res.selected == true);
		let Loans =
			documents && documents.Loans.filter(res => res.selected == true);
		let Legal =
			documents && documents.Legal.filter(res => res.selected == true);
		let Technical =
			documents && documents.Technical.filter(res => res.selected == true);
		let BusinessOwnership_ExistenceProof_AnyOne =
			documents &&
			documents.BusinessOwnership_ExistenceProof_AnyOne.filter(
				res => res.selected == true
			);
		let OwnershipProof_AnyOne =
			documents &&
			documents.OwnershipProof_AnyOne && documents.OwnershipProof_AnyOne.filter(res => res.selected == true);

		let coApplicantList = "";
		if (allData && allData) {
			coApplicantList = allData.coApplicantList;
		}
		let coApplicant = {}
		coApplicant = allData && allData.coApplicantList.filter(res => {
			if (res.mobileNumber == match.params.mobileno) {
				return res
			}
		})
		return (
			<React.Fragment>
				<div className="backToDashboard py-3">
					<div className="container-fluid fw-700" style={{ color: "white" }}>
						<Link to={public_url.lead_list}> Home </Link>
					</div>
				</div>
				<section class="py-4 position-relative bg_l-secondary ">
					<div className="container  ">
						<div class="d-flex justify-content-start align-items-center">
							<div className="breadcrums">
								<ul>
									<li className="mr-1" class="active">
										<Link to={public_url.prospect_list}>LAP Prospects</Link>
									</li>
									<li className="mr-1">
										<Link
											to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
										>
											<a href="#">Profile</a>
										</Link>
									</li>
									<li className="mr-1">
										<a href="#">Login Checklist</a>
									</li>
								</ul>
							</div>
							<div className="mt-3 ml-4 d-flex ">
								<p className="text-green fw-700">Refernce ID : </p>
								<p className="text-green fw-700 ml-3">
									{coApplicant[0] && coApplicant[0].loannumber}
								</p>
							</div>
						</div>
					</div>
				</section>

				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div className="bg-white p-md-4 p-1">
							<div className="">
								<Link
									to={`${public_url.checklist_view}/${allData.leadCode}/${allData.mobileNumber}`}
								>
									<button
										className={`btn btn-primary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 `}
									>
										Applicant
                  </button>
								</Link>
								{coApplicantList &&
									coApplicantList.map(res => {
										return (
											<Link
												to={`${public_url.co_applicant_checklistview}/${res.leadCode}/${res.mobileNumber}`}
											>
												<button
													className={`btn btn-primary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${match
														.params.mobileno === res.mobileNumber &&
														"btn-green"} `}
													onClick={this.handleClick}
												>
													Co-applicant
                        </button>
											</Link>
										);
									})}
							</div>

							<div className="p-2">
								<div className="d-flex mt-3">
									<p className="text-green fw-700">
									{coApplicant[0] && coApplicant[0].firmName ? coApplicant[0].firmName : coApplicant[0] && coApplicant[0].customerName}
									</p>
									<p className="text-green ml-5">({coApplicant[0] && coApplicant[0].typeOfEntity})</p>
								</div>
								<div
									className=" d-flex"
									style={{ justifyContent: "space-between" }}
								>
									<p className="text-primary fw-700 ">Case Login Credentials</p>
									<p className="text-primary fw-700 ">
										Sent For Approval: 21st Jan 2020
                  </p>
								</div>
								<div className="pl-4 pr-2 mt-2 case">
									<div className="p-2">
										{/* 3rd */}
										<div className="row">
											<div className="col-lg-8 col-md-6">
												<p className="text-green fw-700 mb-0 mr-5">
													Age Proof Received
                        </p>
												<div className="pl-2">
													{AgeProof_AnyOne && AgeProof_AnyOne.length === 0 ? (
														<li>No Documnets Submitted</li>
													) : (
															AgeProof_AnyOne &&
															AgeProof_AnyOne.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
												<p className="text-green fw-700 mb-0 mr-5 mt-3">
													ID Proof Received
                        </p>
												<div className="pl-2">
													{IdProof_AnyOne && IdProof_AnyOne.length ? (
														<li>No Documents Submitted</li>
													) : (
															IdProof_AnyOne &&
															IdProof_AnyOne.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>

												<p className="text-green fw-700 mb-0 mr-5 mt-3">
													Address Proof Received
                        </p>
												<div className="pl-2">
													{AddressProof_AnyOne &&
														AddressProof_AnyOne.length === 0 ? (
															<li>No Documnets Submitted</li>
														) : (
															AddressProof_AnyOne &&
															AddressProof_AnyOne.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}

													{AddressProofNonIndividual &&
														AddressProofNonIndividual.map(res => (
															<li
																className="text-l-priamry mt-2 mb-2 mybullet"
																style={{ listStyleType: "disc" }}
															>
																{" "}
																{res.docTypeDesc}
															</li>
														))}
												</div>

												<p className="text-green fw-700 mb-0 mr-5 mt-3">
													Signature Proof Received
                        </p>
												<div className="pl-2">
													{SignatureVerificationNonIndividual &&
														SignatureVerificationNonIndividual.map(res => (
															<li
																className="text-l-priamry mt-2 mb-2 mybullet"
																style={{ listStyleType: "disc" }}
															>
																{" "}
																{res.docTypeDesc}
															</li>
														))}
													{SignatureVerificationIndividual &&
														SignatureVerificationIndividual.length === 0 ? (
															<li>No Documents Submitted</li>
														) : (
															SignatureVerificationIndividual &&
															SignatureVerificationIndividual.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}

													<p className="text-l-priamry fw-700 mb-0 mt-3 ml-3">
														Remarks
                          </p>
													<p className="text-l-priamry ml-3">
														{docs && docs.remark3}
													</p>
												</div>
												{/* end  */}
											</div>
											<div className="col-md-6 col-lg-4">
												<div style={{ float: "right" }} className="mr-5">
													<p className="text-primary fw-500 mb-1 mt-2">
														KYC Documents
                          </p>
												</div>
											</div>
											<div className="col-12">
												<hr className="bg_d-primary border-0 h-1px " />
											</div>
										</div>

										{/* start */}
										<div className="row">
											<div className="col-lg-8 col-md-6">
												<p className="text-green fw-700 mb-0 mr-5">
													Business ownership & existence proof Received
                        </p>
												<div className="pl-2">
													{BusinessOwnership_ExistenceProof_AnyOne &&
														BusinessOwnership_ExistenceProof_AnyOne.length ===
														0 ? (
															<li>No Documents Submitted</li>
														) : (
															BusinessOwnership_ExistenceProof_AnyOne &&
															BusinessOwnership_ExistenceProof_AnyOne.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
											</div>
											<div className="col-md-6 col-lg-4">
												<div style={{ float: "right" }} className="mr-5">
													<p className="text-primary fw-500 mb-1 mt-2">
														Business ownership & existence proof
                          </p>
												</div>
											</div>
											<div className="col-12">
												<hr className="bg_d-primary border-0 h-1px " />
											</div>
										</div>

										{/* end */}
										{/* start */}
										<div className="row">
											<div className="col-lg-8 col-md-6">
												<p className="text-green fw-700 mb-0 mr-5">
													Ownership proof Received
                        </p>
												<div className="pl-2">
													{OwnershipProof_AnyOne &&
														OwnershipProof_AnyOne.length === 0 ? (
															<li>No Documents Submitted</li>
														) : (
															OwnershipProof_AnyOne &&
															OwnershipProof_AnyOne.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
											</div>
											<div className="col-md-6 col-lg-4">
												<div style={{ float: "right" }} className="mr-5">
													<p className="text-primary fw-500 mb-1 mt-2">
														Ownership proof
                          </p>
												</div>
											</div>
											<div className="col-12">
												<hr className="bg_d-primary border-0 h-1px " />
											</div>
										</div>

										{/* end */}

										{/* 4th */}
										<div className="row">
											<div className="col-lg-8 col-md-6">
												{checklistDetails &&
													checklistDetails.financialstatus === "financial" && (
														<div>
															<p className="text-green fw-700 mb-0 mr-5">
																Income Proof Received
                              </p>
															<div className="pl-2">
																{FinancialIncome &&
																	FinancialIncome.length === 0 ? (
																		<li>No Documents Submitted</li>
																	) : (
																		FinancialIncome &&
																		FinancialIncome.map(res => (
																			<li
																				className="text-l-priamry mt-2 mb-2 mybullet"
																				style={{ listStyleType: "disc" }}
																			>
																				{" "}
																				{res.docTypeDesc}
																			</li>
																		))
																	)}
															</div>
														</div>
													)}
												{checklistDetails &&
													checklistDetails.financialstatus === "financial" && (
														<div>
															<p className="text-green fw-700 mb-0 mt-3 mr-5">
																GST Documents Received
                              </p>
															<div className="pl-2">
																{FinancialGST && FinancialGST.length === 0 ? (
																	<li>No Documents Submitted</li>
																) : (
																		FinancialGST &&
																		FinancialGST.map(res => (
																			<li
																				className="text-l-priamry mt-2 mb-2 mybullet"
																				style={{ listStyleType: "disc" }}
																			>
																				{" "}
																				{res.docTypeDesc}
																			</li>
																		))
																	)}
															</div>
														</div>
													)}

												<p className="text-green fw-700 mb-0 mt-3 mr-5">
													Banking Documents Received
                        </p>
												<div className="pl-2">
													{Banking && Banking.length === 0 ? (
														<li>No Documents Submitted</li>
													) : (
															Banking &&
															Banking.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
											</div>

											<div className="col-md-6 col-lg-4">
												<div style={{ float: "right" }} className="mr-5">
													<p className="text-primary fw-500 mb-1 mt-2">
														Finance Documents
                          </p>
												</div>
											</div>
											<div className="col-12">
												<hr className="bg_d-primary border-0 h-1px " />
											</div>
										</div>
										<div className="row">
											<div className="col-lg-8 col-md-6">
												<p className="text-green fw-700 mb-0 mr-5">
													Loan Documents Received
                        </p>
												<div className="pl-2">
													{Loans && Loans.length === 0 ? (
														<li>No Documents Submitted</li>
													) : (
															Loans &&
															Loans.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
											</div>
											<div className="col-md-6 col-lg-4">
												<div style={{ float: "right" }} className="mr-5">
													<p className="text-primary fw-500 mb-1 mt-2">
														Repayment Track Record
                          </p>
												</div>
											</div>
											<div className="col-12">
												<hr className="bg_d-primary border-0 h-1px " />
											</div>
										</div>

										<div className="row">
											<div className="col-lg-8 col-md-6">
												<p className="text-green fw-700 mb-0 mr-5">
													Legal Documents Received
                        </p>
												<div className="pl-2">
													{Legal && Legal.length === 0 ? (
														<li>No Documents Submitted</li>
													) : (
															Legal &&
															Legal.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
												<p className="text-green fw-700 mb-0 mr-5">
													Technical Documents Received
                        </p>
												<div className="pl-2">
													{Technical && Technical.length === 0 ? (
														<li>NO Documents Submitted</li>
													) : (
															Technical &&
															Technical.map(res => (
																<li
																	className="text-l-priamry mt-2 mb-2 mybullet"
																	style={{ listStyleType: "disc" }}
																>
																	{" "}
																	{res.docTypeDesc}
																</li>
															))
														)}
												</div>
												<p className="text-green fw-700 mb-0 mr-5 mt-3">
													Additional Notes
                        </p>
												<div className="mt-2">
													<p className="text-l-priamry">
														{docs && docs.remark7}
													</p>
												</div>
											</div>
											<div className="col-md-6 col-lg-4">
												<div style={{ float: "right" }} className="mr-5">
													<p className="text-primary fw-500 mb-1 mt-2">
														Property Documents
                          </p>
												</div>
											</div>
										</div>
										{/* border close */}
									</div>
								</div>
								<div className="row justify-content-end mt-4 pr-0 mb-2">
									{checklistDetails &&
										checklistDetails.mainapplicant === false ? (
											<Link
												to={`${public_url.co_applicant_checklist}/${match.params.leadcode}/${match.params.mobileno}`}
											>
												<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
													Edit
                      </button>
											</Link>
										) : (
											<Link
												to={`${public_url.checklist}/${match.params.leadcode}/${match.params.mobileno}`}
											>
												<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
													Edit
                      </button>
											</Link>
										)}
									<Link
										to={`${public_url.collateral_detail}/${match.params.leadcode}`}
									>
										<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
											Next
                    </button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default CoapplicantChecklistview;
