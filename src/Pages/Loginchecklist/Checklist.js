import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, Input, TextArea } from "../../Component/Input";
import { cloneDeep, find, findKey, set } from "lodash";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";
import {
	postCheckListByLeadCode,
	postcreateOrUpdateChecklist
} from "../../Utility/Services/Logchecklist";
import { ts, te } from "../../Utility/ReduxToaster";
let checkListForm = {
	remark1: "",
	remark2: "",
	remark3: "",
	remark4: "",
	remark5: "",
	remark6: "",
	remark7: "",
	remark8: "",
	remark9: "",
	approveFlag: null,
	errors: {
		remark1: null,
		remark2: null,
		remark3: null,
		remark4: null,
		remark5: null,
		remark6: null,
		remark7: null,
		applicationError: null
	}
};
export class Checklist extends Component {
	state = {
		checklistDetails: {},
		documents: "",
		allData: "",
		agecheck: null,
		checklist: cloneDeep(checkListForm)
	};

	componentDidMount() {
		this.GetchecklistDetails();

	}
	GetchecklistDetails = () => {
		let { match } = this.props;
		// let leadCode = "LAP-0185";
		// let mobileNumber = 9571423215;
		let leadCode = match.params.leadcode;
		let mobileNumber = match.params.comobileno;
		postCheckListByLeadCode(leadCode, mobileNumber, true).then(response => {



			if (response.error === false) {
				this.setState({
					checklistDetails: response.data ? response.data.data : [],
					documents: response.data.docs ? response.data.docs.docMap : [],
					checklist: {
						...response.data.docs,
						errors: this.state.checklist.errors
					},
					allData: response.data ? response.data.applicant : []
				});
			}
		});
	};

	onCheck = e => {
		let { checklist } = this.state;


		let { approveFlag, errors } = this.state.checklist;


		this.setState({
			checklist: { ...checklist, approveFlag: !approveFlag }
		});
	};

	ageproofCheck = e => {
		let { documents } = this.state;

		let ageval = find(documents && documents.AgeProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		let dockey = JSON.parse(
			findKey(documents && documents.AgeProof_AnyOne, ageval)
		);



		let checked = ageval.selected;
		let AgeProof_AnyOne = cloneDeep(documents.AgeProof_AnyOne);
		let selected = { ...ageval, selected: !checked };
		documents.AgeProof_AnyOne[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			AgeProof_AnyOne,
			documents
		});


	};

	addproofCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.AddressProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});


		let dockey = findKey(documents && documents.AddressProof_AnyOne, val);



		let checked = val.selected;
		let AddressProof_AnyOne = cloneDeep(documents.AddressProof_AnyOne);
		let selected = { ...val, selected: !checked };
		documents.AddressProof_AnyOne[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			AddressProof_AnyOne,
			documents
		});


	};
	ownerCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.OwnershipProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		let dockey = JSON.parse(
			findKey(documents && documents.OwnershipProof_AnyOne, val)
		);



		let checked = val.selected;
		let OwnershipProof_AnyOne = cloneDeep(documents.OwnershipProof_AnyOne);
		let selected = { ...val, selected: !checked };
		documents.OwnershipProof_AnyOne[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			OwnershipProof_AnyOne,
			documents
		});


	};

	signatureCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.SignatureVerificationIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(
			documents && documents.SignatureVerificationIndividual,
			val
		);



		let checked = val.selected;
		let SignatureVerificationIndividual = cloneDeep(
			documents.SignatureVerificationIndividual
		);
		let selected = { ...val, selected: !checked };
		documents.SignatureVerificationIndividual[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			SignatureVerificationIndividual,
			documents
		});


	};

	incomeCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.FinancialIncome, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.FinancialIncome, val);



		let checked = val.selected;
		let FinancialIncome = cloneDeep(documents.FinancialIncome);
		let selected = { ...val, selected: !checked };
		documents.FinancialIncome[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			FinancialIncome,
			documents
		});


	};

	idproofCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.IdProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.IdProof_AnyOne, val);



		let checked = val.selected;
		let IdProof_AnyOne = cloneDeep(documents.IdProof_AnyOne);
		let selected = { ...val, selected: !checked };
		documents.IdProof_AnyOne[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			IdProof_AnyOne,
			documents
		});


	};

	nonidproofCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.IdProofNonIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.IdProofNonIndividual, val);



		let checked = val.selected;
		let IdProofNonIndividual = cloneDeep(documents.IdProofNonIndividual);
		let selected = { ...val, selected: !checked };
		documents.IdProofNonIndividual[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			IdProofNonIndividual,
			documents
		});


	};

	gstCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.FinancialGST, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.FinancialGST, val);



		let checked = val.selected;
		let FinancialGST = cloneDeep(documents.FinancialGST);
		let selected = { ...val, selected: !checked };
		documents.FinancialGST[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			FinancialGST,
			documents
		});


	};

	bankCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.Banking, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Banking, val);



		let checked = val.selected;
		let Banking = cloneDeep(documents.Banking);
		let selected = { ...val, selected: !checked };
		documents.Banking[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			Banking,
			documents
		});


	};

	loanCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.Loans, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Loans, val);



		let checked = val.selected;
		let Loans = cloneDeep(documents.Loans);
		let selected = { ...val, selected: !checked };
		documents.Loans[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			Loans,
			documents
		});


	};

	legalCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.Legal, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Legal, val);



		let checked = val.selected;
		let Legal = cloneDeep(documents.Legal);
		let selected = { ...val, selected: !checked };
		documents.Legal[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			Legal,
			documents
		});


	};

	technicalCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.Technical, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Technical, val);



		let checked = val.selected;
		let Technical = cloneDeep(documents.Technical);
		let selected = { ...val, selected: !checked };
		documents.Technical[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			Technical,
			documents
		});


	};

	bussinessCheck = e => {
		let { documents } = this.state;

		let val = find(
			documents && documents.BusinessOwnership_ExistenceProof_AnyOne,
			{
				id: JSON.parse(e.target.value)
			}
		);
		let dockey = findKey(
			documents && documents.BusinessOwnership_ExistenceProof_AnyOne,
			val
		);



		let checked = val.selected;
		let BusinessOwnership_ExistenceProof_AnyOne = cloneDeep(
			documents.BusinessOwnership_ExistenceProof_AnyOne
		);
		let selected = { ...val, selected: !checked };
		documents.BusinessOwnership_ExistenceProof_AnyOne[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			BusinessOwnership_ExistenceProof_AnyOne,
			documents
		});
	};

	applicationCheck = e => {
		let { documents, checklist } = this.state;
		let { errors } = checklist;

		let val = find(documents && documents.ApplicationForm, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.ApplicationForm, val);
		let checked = val.selected;

		let ApplicationForm = cloneDeep(documents.ApplicationForm);
		let selected = { ...val, selected: !checked };
		documents.ApplicationForm[dockey] = selected;

		// if (!selected.selected) {
		//   alert("alert");
		//   ts("You need to check atlaest one checkbox");
		// }
		this.setState({
			selected: !selected.selected,
			ApplicationForm,
			documents
		});


	};

	feesCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.LoginFees, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.LoginFees, val);
		let checked = val.selected;
		let LoginFees = cloneDeep(documents.LoginFees);
		let selected = { ...val, selected: !checked };
		documents.LoginFees[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			LoginFees,
			documents
		});
	};

	nonIndividualsignatureCheck = e => {
		let { documents } = this.state;
		let val = find(documents && documents.SignatureVerificationNonIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(
			documents && documents.SignatureVerificationNonIndividual,
			val
		);

		let checked = val.selected;
		let SignatureVerificationNonIndividual = cloneDeep(
			documents.SignatureVerificationNonIndividual
		);
		let selected = { ...val, selected: !checked };
		documents.SignatureVerificationNonIndividual[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			SignatureVerificationNonIndividual,
			documents
		});
	};

	nonIndividualaddproofCheck = e => {
		let { documents } = this.state;

		let val = find(documents && documents.AddressProofNonIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.AddressProofNonIndividual, val);
		let checked = val.selected;
		let AddressProofNonIndividual = cloneDeep(
			documents.AddressProofNonIndividual
		);
		let selected = { ...val, selected: !checked };
		documents.AddressProofNonIndividual[dockey] = selected;

		this.setState({
			selected: !selected.selected,
			AddressProofNonIndividual,
			documents
		});
	};

	onInputChange = (name, value, error = undefined, checklist) => {
		this.state[checklist][name] = value;
		if (error !== undefined) {
			let { errors } = this.state[checklist];
			this.state[checklist].errors[name] = error;
		}
		this.setState({ [checklist]: this.state[checklist] });
	};

	onInputValidate = (name, error) => {
		let { errors } = this.state.checklist;
		errors[name] = error;
		this.setState({
			checklist: { ...this.state.checklist, errors: errors }
		});
	};

	handleSubmit = () => {
		let { match } = this.props;
		let { documents, checklistDetails, checklist, agecheck } = this.state;
		let ApplicationForm =
			documents &&
			documents.ApplicationForm &&
			documents.ApplicationForm.filter((x, i) => {
				return x.selected;
			}).length;

		// let LoginFees = documents && documents.LoginFees[0].selected === true;
		// 

		let AgeProofvalid =
			documents &&
			documents.AgeProof_AnyOne &&
			documents.AgeProof_AnyOne.filter((x, i) => {
				return x.selected;
			}).length;

		let IdProofvalid =
			documents &&
			documents.IdProof_AnyOne &&
			documents.IdProof_AnyOne.filter((x, i) => {
				return x.selected;
			}).length;

		let {
			remark1,
			remark2,
			remark3,
			remark4,
			remark5,
			remark6,
			remark7,
			remark8,
			remark9,
			id,
			approveFlag
		} = checklist;
		let obj = {
			leadCode: checklistDetails && checklistDetails.leadCode,
			mainapplicant: checklistDetails && checklistDetails.mainapplicant,
			loanAplNumber: null,
			loanRefNumber: checklistDetails && checklistDetails.loannumber,
			applicantName: checklistDetails && checklistDetails.customerName,
			docSubCategoryId: null,
			remark1: remark1,
			remark2: remark2,
			remark3: remark3,
			remark4: remark4,
			remark5: remark5,
			remark6: remark6,
			remark7: remark7,
			remark8: remark8,
			remark9: remark9,
			approveFlag: true,
			mobileNumber: checklistDetails && checklistDetails.mobileNumber,
			docMap: documents,
			id: id,
			ipaddress: checklistDetails && checklistDetails.ipaddress
		};

		if (
			ApplicationForm == 0 ||
			!approveFlag ||
			AgeProofvalid == 0 ||
			IdProofvalid == 0
		) {
			te("Plaese Select Mandatory fields");
			return false;
		}
		if (approveFlag) {
			postcreateOrUpdateChecklist(obj).then(response => {

				if (response.error == false) {
					ts(response.data.message);
					this.props.history.push(
						`${public_url.checklist_view}/${match.params.leadcode}/${match.params.comobileno}`
					);
				} else {
					te(response.data.message);
				}
			});
		}
	};

	render() {

		//alert("cd")
		let { match } = this.props;
		let {
			checklist,
			checklistDetails,
			documents,
			selected,
			IdProof,
			allData,
			agecheck
		} = this.state;
		
		// let ApplicationForm =
		//   documents &&
		//   documents.ApplicationForm.filter((x, i) => {
		//     return x.selected;
		//   }).length;
		// 

		let AgeProofvalid =
			documents && documents.AgeProof_AnyOne
				? documents && documents.AgeProof_AnyOne[0].selected === true
				: null;


		let { errors, remark1, approveFlag } = checklist;
		let coApplicantList = "";
		if (allData && allData) {
			coApplicantList = allData.coApplicantList;
		}
		let RmName = "";
		if (this.props.login.isLogin && this.props.login.data) {
			RmName = this.props.login.data.employeeName;
		}
		return (
			<React.Fragment>
				<div className="backToDashboard py-3">
					<div
						className="container-fluid fw-700 ml-4"
						style={{ color: "white" }}
					>
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
									{allData && allData.loannumber}
								</p>
							</div>
						</div>
					</div>
				</section>

				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div className="bg-white p-md-4 p-1">
							<div className="">
								<button
									className={`btn btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 `}
								>
									Applicant
                </button>
								{coApplicantList &&
									coApplicantList.map(res => {
										return (
											<Link
												to={`${public_url.co_applicant_checklist}/${res.leadCode}/${res.mobileNumber}`}
											>
												<button
													className={`btn btn-primary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 `}
												// onClick={() => {
												//   this.SelectApplicant(res);
												// }}
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
										{allData && allData.firmName ? allData.firmName : allData.customerName}
									</p>
									<p className="text-green fw-500 ml-5">
										({allData && allData.typeOfEntity})
                  </p>
								</div>
								<p className="text-primary fw-700 ">Case Login Credentials</p>

								<div className="row pl-5  mt-4">
									<div className="col-lg-8 col-md-6 ">
										{documents &&
											documents.ApplicationForm.map(res => (
												<div class="custom-control custom-checkbox">
													<input
														type="checkbox"
														class="custom-control-input"
														disabled={true}
														id={res.id}
														value={res.id}
														checked={res.selected}
														onChange={e => {
															this.applicationCheck(e);
														}}
														isReq={true}
													/>
													<label
														class="custom-control-label text-l-priamry"
														for={res.id}
													>
														{res.docTypeDesc}{" "}
														<span className="fw-700" style={{ color: "red" }}>
															*
                            </span>
													</label>
												</div>
											))}
									</div>
									<div className="col-md-6 col-lg-4 pr-5">
										<div style={{ float: "right" }} className="mr-5">
											<p className="text-primary fw-500 mb-1">
												Application Form
                      </p>
											<p className="text-l-priamry" style={{ float: "right" }}>
												Remarks
                      </p>
										</div>

										<TextArea
											title="remark1"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											placeholder="Type here...."
											name="remark1"
											onChangeFunc={(name, value, error) => {
												this.onInputChange(name, value, error, "checklist");
											}}
											error={errors.remark1}
											validationFunc={this.onInputValidate}
											value={checklist.remark1}
										/>
									</div>
									<div className="col-12">
										<hr className="bg_d-primary border-0 h-1px mt-0" />
									</div>
								</div>
								{/* 2nd row */}
								<div className="row pl-5  mt-2">
									<div className="col-lg-8 col-md-6 mt-2">
										{documents &&
											documents.LoginFees.map(res => (
												<div className="custom-control custom-checkbox">
													<input
														type="checkbox"
														className="custom-control-input"
														disabled={true}
														id={res.id}
														value={res.id}
														checked={res.selected}
														onChange={e => {
															this.feesCheck(e);
														}}
													/>
													<label
														className="custom-control-label text-l-priamry"
														for={res.id}
													>
														{res.mandatoryFlag === true ? (
															<span>
																{res.docTypeDesc}{" "}
																<span
																	className="fw-700"
																	style={{ color: "red" }}
																>
																	*
                                </span>{" "}
															</span>
														) : (
																res.docTypeDesc
															)}
													</label>
												</div>
											))}
									</div>

									<div className="col-md-6 col-lg-4 pr-5">
										<div style={{ float: "right" }} className="mr-5">
											<p className="text-primary fw-500 mb-1">Login Fees</p>
											<p className="text-l-priamry" style={{ float: "right" }}>
												Remarks
                      </p>
										</div>

										<TextArea
											title="remark2"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
											placeholder="Type here"
											name="remark2"
											onChangeFunc={(name, value, error) => {
												this.onInputChange(name, value, error, "checklist");
											}}
											error={errors.remark2}
											validationFunc={this.onInputValidate}
											value={checklist.remark2}
										/>
									</div>
									<div className="col-12">
										<hr className="bg_d-primary border-0 h-1px mt-0" />
									</div>
								</div>
							</div>
							{/* start */}

							<div className="row pl-5  mt-3">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Address Proof Received
                  </p>
								</div>

								<div className="col-lg-6">
									{documents && documents.AddressProof_AnyOne
										? documents &&
										documents.AddressProof_AnyOne.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													disabled={true}
													className="custom-control-input"
													id={res.id}
													value={res.id}
													checked={res.selected}
													onChange={e => {
														this.addproofCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))
										: null}

									{documents && documents.AddressProofNonIndividual
										? documents &&
										documents.AddressProofNonIndividual.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													disabled={true}
													id={res.id}
													value={res.id}
													checked={res.selected}
													onChange={e => {
														this.nonIndividualaddproofCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))
										: null}
								</div>
								<div className="col-md-6 col-lg-4 pr-5">
									<div style={{ float: "right" }} className="mr-5">
										<p className="text-primary fw-500 mb-1">KYC Documents</p>
										<p className="text-l-priamry" style={{ float: "right" }}>
											Remarks
                    </p>
									</div>

									<TextArea
										title="remark3"
										className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
										placeholder="Type here"
										name="remark3"
										onChangeFunc={(name, value, error) => {
											this.onInputChange(name, value, error, "checklist");
										}}
										value={checklist.remark3}
									/>
								</div>
							</div>

							{/* end */}
							<div className="row pl-5  mt-2">
								{documents && documents.AgeProof_AnyOne && (
									<div className="col-lg-2">
										<p className="text-primary">Select age Proof Received</p>
									</div>
								)}
								<div className="col-lg-6">
									{documents && documents.AgeProof_AnyOne
										? documents &&
										documents.AgeProof_AnyOne.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													checked={res.selected}
													onClick={e => {
														this.ageproofCheck(e);
													}}
													value={res.id}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.mandatoryFlag === true ? (
														<span>
															{res.docTypeDesc}{" "}
															<span
																className="fw-700"
																style={{ color: "red" }}
															></span>{" "}
														</span>
													) : (
															res.docTypeDesc
														)}
												</label>
											</div>
										))
										: null}
								</div>
							</div>
							{/* end */}
							<div className="row pl-5  mt-2 ">
								{documents && documents.IdProof_AnyOne && (
									<div className="col-lg-2">
										<p className="text-primary mt-1">
											Select ID Proof Received
                    </p>
									</div>
								)}

								<div className="col-lg-6">
									{documents && documents.IdProof_AnyOne
										? documents &&
										documents.IdProof_AnyOne.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													onChange={e => {
														this.idproofCheck(e);
													}}
													value={res.id}
													checked={res.selected}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.mandatoryFlag === true ? (
														<span>
															{res.docTypeDesc}{" "}
															<span
																className="fw-700"
																style={{ color: "red" }}
															></span>{" "}
														</span>
													) : (
															res.docTypeDesc
														)}
												</label>
											</div>
										))
										: null}
								</div>
							</div>
							{/* end  */}
							{/* start */}
							<div className="row pl-5  mt-2 ">
								{documents && documents.IdProofNonIndividual && (
									<div className="col-lg-2">
										<p className="text-primary mt-1">
											Select ID Proof Received
                    </p>
									</div>
								)}

								<div className="col-lg-6">
									{documents && documents.IdProofNonIndividual
										? documents &&
										documents.IdProofNonIndividual.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													onChange={e => {
														this.nonidproofCheck(e);
													}}
													value={res.id}
													checked={res.selected}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))
										: null}
								</div>
							</div>

							{/* end */}

							{/* end */}

							<div className="row pl-5  mt-3">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Signature Proof Received
                  </p>
								</div>

								<div className="col-lg-7">
									{documents && documents.SignatureVerificationIndividual
										? documents &&
										documents.SignatureVerificationIndividual.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													value={res.id}
													checked={res.selected}
													onClick={e => {
														this.signatureCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))
										: null}

									{documents && documents.SignatureVerificationNonIndividual
										? documents &&
										documents.SignatureVerificationNonIndividual.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													value={res.id}
													checked={res.selected}
													onClick={e => {
														this.nonIndividualsignatureCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))
										: null}
								</div>
							</div>
							<div className="col-12 mt-4">
								<hr className="bg_d-primary border-0 h-1px " />
							</div>
							{/* start */}
							<div className="row pl-5  mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Business ownership & existence proof
                  </p>
								</div>
								<div className="col-lg-6">
									{documents &&
										documents.BusinessOwnership_ExistenceProof_AnyOne.map(
											res => (
												<div className="custom-control custom-checkbox mt-2">
													<input
														type="checkbox"
														className="custom-control-input"
														id={res.id}
														disabled={true}
														value={res.id}
														checked={res.selected}
														onChange={e => {
															this.bussinessCheck(e);
														}}
													/>
													<label
														className="custom-control-label text-l-priamry"
														for={res.id}
													>
														{res.docTypeDesc}
													</label>
												</div>
											)
										)}
								</div>
								<div className="col-md-6 col-lg-4 pr-5">
									<div style={{ float: "right" }} className="mr-5">
										<p className="text-primary fw-500 mb-1">
											Business ownership & existence proof
                    </p>
										<p className="text-l-priamry" style={{ float: "right" }}>
											Remarks
                    </p>
									</div>

									<TextArea
										title="remark9"
										className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
										placeholder="Type here"
										name="remark9"
										onChangeFunc={(name, value, error) => {
											this.onInputChange(name, value, error, "checklist");
										}}
										value={checklist.remark9}
									/>
								</div>
							</div>
							<div className="col-12">
								<hr className="bg_d-primary border-0 h-1px " />
							</div>

							{/* end */}

							{/* start */}
							<div className="row pl-5  mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-1">Select Ownership Proof</p>
								</div>
								<div className="col-lg-6">
									{documents &&
										documents.OwnershipProof_AnyOne && documents.OwnershipProof_AnyOne.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													onChange={e => {
														this.ownerCheck(e);
													}}
													value={res.id}
													checked={res.selected}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
								<div className="col-md-6 col-lg-4 pr-5">
									<div style={{ float: "right" }} className="mr-5">
										<p className="text-primary fw-500 mb-1">Ownership Proof</p>
										<p className="text-l-priamry" style={{ float: "right" }}>
											Remarks
                    </p>
									</div>

									<TextArea
										title="remark8"
										className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
										placeholder="Type here"
										name="remark8"
										onChangeFunc={(name, value, error) => {
											this.onInputChange(name, value, error, "checklist");
										}}
										value={checklist.remark8}
									/>
								</div>
							</div>
							<div className="col-12">
								<hr className="bg_d-primary border-0 h-1px " />
							</div>

							{/* end */}

							<div className="row pl-5  mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Income Proof Received
                  </p>
								</div>
								<div className="col-lg-6">
									{documents &&
										documents.FinancialIncome.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													value={res.id}
													checked={res.selected}
													onChange={e => {
														this.incomeCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
								<div className="col-md-6 col-lg-4 pr-5">
									<div style={{ float: "right" }} className="mr-5">
										<p className="text-primary fw-500 mb-1">Financials</p>
										<p className="text-l-priamry" style={{ float: "right" }}>
											Remarks
                    </p>
									</div>

									<TextArea
										title="remark4"
										className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
										placeholder="Type here"
										value={checklist.remark4}
										name="remark4"
										onChangeFunc={(name, value, error) => {
											this.onInputChange(name, value, error, "checklist");
										}}
									/>
								</div>
							</div>

							<div className="row pl-5 mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-2">
										Select GST Documents Received
                  </p>
								</div>

								<div className="col-lg-7">
									{documents &&
										documents.FinancialGST.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													value={res.id}
													checked={res.selected}
													onChange={e => {
														this.gstCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
							</div>
							<div className="row pl-5  mt-3">
								<div className="col-lg-2">
									<p className="text-primary mt-2">
										Select Banking Documents Received
                  </p>
								</div>

								<div className="col-lg-7">
									{documents &&
										documents.Banking.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													value={res.id}
													disabled={true}
													checked={res.selected}
													onChange={e => {
														this.bankCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
							</div>
							<div className="col-12 mt-4">
								<hr className="bg_d-primary border-0 h-1px " />
							</div>
							{/* end hr */}

							<div className="row pl-5  mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Loan Documents Received
                  </p>
								</div>
								<div className="col-lg-6">
									{documents &&
										documents.Loans.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													value={res.id}
													disabled={true}
													checked={res.selected}
													onChange={e => {
														this.loanCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
								<div className="col-md-6 col-lg-4 pr-5">
									<div style={{ float: "right" }} className="mr-5">
										<p className="text-primary fw-500 mb-1">
											Repayment Track record
                    </p>
										<p className="text-l-priamry" style={{ float: "right" }}>
											Remarks
                    </p>
									</div>

									<TextArea
										title="remark5"
										className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
										placeholder="Type here"
										name="remark5"
										onChangeFunc={(name, value, error) => {
											this.onInputChange(name, value, error, "checklist");
										}}
										value={checklist.remark5}
									/>
								</div>
							</div>
							<div className="col-12">
								<hr className="bg_d-primary border-0 h-1px " />
							</div>
							{/* end */}
							<div className="row pl-5  mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Legal Documents Received
                  </p>
								</div>

								<div className="col-lg-6">
									{documents &&
										documents.Legal.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													value={res.id}
													checked={res.selected}
													onChange={e => {
														this.legalCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
								<div className="col-md-6 col-lg-4 pr-5">
									<div style={{ float: "right" }} className="mr-5">
										<p className="text-primary fw-500 mb-1">
											Propety Documents
                    </p>
										<p className="text-l-priamry" style={{ float: "right" }}>
											Remarks
                    </p>
									</div>
									<TextArea
										title="remark6"
										className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
										placeholder="Type here"
										name="remark6"
										onChangeFunc={(name, value, error) => {
											this.onInputChange(name, value, error, "checklist");
										}}
										value={checklist.remark6}
									/>
								</div>
							</div>
							<div className="row pl-5  mt-4">
								<div className="col-lg-2">
									<p className="text-primary mt-2">
										Select Technical Documents Received
                  </p>
								</div>

								<div className="col-lg-7">
									{documents &&
										documents.Technical.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													className="custom-control-input"
													id={res.id}
													disabled={true}
													value={res.id}
													checked={res.selected}
													onChange={e => {
														this.technicalCheck(e);
													}}
												/>
												<label
													className="custom-control-label text-l-priamry"
													for={res.id}
												>
													{res.docTypeDesc}
												</label>
											</div>
										))}
								</div>
							</div>

							<div className="row pl-5  mt-5">
								<div className="col-lg-2">
									<p className="text-primary mt-1">Additional Note</p>
								</div>
								<div className="col-lg-5">
									<div className="ml-2">
										<TextArea
											title="remark7"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 "
											placeholder="Type here"
											name="remark7"
											onChangeFunc={(name, value, error) => {
												this.onInputChange(name, value, error, "checklist");
											}}
											value={checklist.remark7}
										/>
									</div>
								</div>
							</div>

							<div className="row pl-5  mt-2 ">
								<div className="custom-control custom-checkbox ml-2">
									<input
										type="checkbox"
										className="custom-control-input"
										name="approveFlag"
										id="defaultUnchecked"
										value={approveFlag}
										checked={approveFlag}
										onChange={e => {
											this.onCheck(e);
										}}
									/>
									<label
										className="custom-control-label text-l-priamry"
										for="defaultUnchecked"
									>
										I {RmName}, have performed with due dilligence in
                    understanding, the customer details as per the bank
                    guidlines while performing the case login. I agree to the{" "}
										<span className="text-green">Terms & conditions</span> and
                    Confirm that I have followed the mentioned{" "}
										<span className="text-green">guidlines </span>
										attached herewith.{" "}
										<span className="fw-700" style={{ color: "red" }}>
											*
                    </span>
									</label>
								</div>
							</div>

							<div className="row justify-content-end mt-3 pr-0 ">
								<Link
									to={`${public_url.co_applicant_status}/${match.params.leadcode}`}
								>
									<button className="btn btn-green btn-rounded ls-1 py-1 px-5 text-white cursor-pointer fs-16 mr-3">
										Cancel
                  </button>
								</Link>
								<button
									className="btn btn-green btn-rounded ls-1 py-1 px-5 text-white cursor-pointer fs-16 mr-3"
									onClick={this.handleSubmit}
								>
									Save
                </button>
							</div>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default connect(state => state, null)(Checklist);
