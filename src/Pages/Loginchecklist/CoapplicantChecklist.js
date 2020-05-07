import React, { Component } from "react";
import { Select, Input, TextArea } from "../../Component/Input";
import { cloneDeep, find, findKey, set } from "lodash";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
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
		remark7: null
	}
};
export class CoapplicantChecklist extends Component {
	state = {
		checklistDetails: {},
		documents: "",
		allData: "",
		checklist: cloneDeep(checkListForm),
	};

	// componentWillMount() {
	//   let { match } = this.props;
	//   console.log("match", match);
	// }

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
		// let leadCode = "LAP-0185";
		// let mobileNumber = 9571423215;
		let leadCode = match.params.leadcode;
		let mobileNumber = match.params.mobileno;
		postCheckListByLeadCode(leadCode, mobileNumber, false).then(response => {
			console.log("response of checklist", response.data && response.data.data);
			console.log("response of Document", response.data && response.data.docs);

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
		console.log("checklist", checklist);

		let { approveFlag, errors } = this.state.checklist;
		console.log("approveFlag.....", approveFlag);

		this.setState({
			checklist: { ...checklist, approveFlag: !approveFlag }
		});
	};

	ageproofCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let ageval = find(documents && documents.AgeProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		let dockey = JSON.parse(
			findKey(documents && documents.AgeProof_AnyOne, ageval)
		);
		console.log("dockey", dockey);

		console.log("ageval...", ageval);
		let checked = ageval.selected;
		let AgeProof_AnyOne = cloneDeep(documents.AgeProof_AnyOne);
		let selected = { ...ageval, selected: !checked };
		documents.AgeProof_AnyOne[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			AgeProof_AnyOne,
			documents
		});
		console.log("documnets", documents);
		console.log("AgeProof", AgeProof_AnyOne);
	};

	addproofCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.AddressProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		console.log("perfect val", val);

		let dockey = findKey(documents && documents.AddressProof_AnyOne, val);
		console.log("dockey", dockey);

		console.log("val...", val && val);
		let checked = val.selected;
		let AddressProof_AnyOne = cloneDeep(documents.AddressProof_AnyOne);
		let selected = { ...val, selected: !checked };
		documents.AddressProof_AnyOne[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			AddressProof_AnyOne,
			documents
		});
		console.log("documnets", documents);
		console.log("AddressProof_AnyOne", AddressProof_AnyOne);
	};
	ownerCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.OwnershipProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		let dockey = JSON.parse(
			findKey(documents && documents.OwnershipProof_AnyOne, val)
		);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let OwnershipProof_AnyOne = cloneDeep(documents.OwnershipProof_AnyOne);
		let selected = { ...val, selected: !checked };
		documents.OwnershipProof_AnyOne[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			OwnershipProof_AnyOne,
			documents
		});
		console.log("documnets", documents);
		console.log("OwnershipProof_AnyOne", OwnershipProof_AnyOne);
	};

	signatureCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.SignatureVerificationIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(
			documents && documents.SignatureVerificationIndividual,
			val
		);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let SignatureVerificationIndividual = cloneDeep(
			documents.SignatureVerificationIndividual
		);
		let selected = { ...val, selected: !checked };
		documents.SignatureVerificationIndividual[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			SignatureVerificationIndividual,
			documents
		});
		console.log("documnets", documents);
		console.log(
			"SignatureVerificationIndividual",
			SignatureVerificationIndividual
		);
	};

	incomeCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.FinancialIncome, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.FinancialIncome, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let FinancialIncome = cloneDeep(documents.FinancialIncome);
		let selected = { ...val, selected: !checked };
		documents.FinancialIncome[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			FinancialIncome,
			documents
		});
		console.log("documnets", documents);
		console.log("FinancialIncome", FinancialIncome);
	};

	idproofCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.IdProof_AnyOne, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.IdProof_AnyOne, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let IdProof_AnyOne = cloneDeep(documents.IdProof_AnyOne);
		let selected = { ...val, selected: !checked };
		documents.IdProof_AnyOne[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			IdProof_AnyOne,
			documents
		});
		console.log("documnets", documents);
		console.log("IdProof", IdProof_AnyOne);
	};

	gstCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.FinancialGST, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.FinancialGST, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let FinancialGST = cloneDeep(documents.FinancialGST);
		let selected = { ...val, selected: !checked };
		documents.FinancialGST[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			FinancialGST,
			documents
		});
		console.log("documnets", documents);
		console.log("FinancialGST", FinancialGST);
	};

	bankCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.Banking, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Banking, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let Banking = cloneDeep(documents.Banking);
		let selected = { ...val, selected: !checked };
		documents.Banking[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			Banking,
			documents
		});
		console.log("documnets", documents);
		console.log("Banking", Banking);
	};

	loanCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.Loans, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Loans, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let Loans = cloneDeep(documents.Loans);
		let selected = { ...val, selected: !checked };
		documents.Loans[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			Loans,
			documents
		});
		console.log("documnets", documents);
		console.log("Loans", Loans);
	};

	legalCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.Legal, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Legal, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let Legal = cloneDeep(documents.Legal);
		let selected = { ...val, selected: !checked };
		documents.Legal[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			Legal,
			documents
		});
		console.log("documnets", documents);
		console.log("Legal", Legal);
	};

	technicalCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.Technical, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.Technical, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let Technical = cloneDeep(documents.Technical);
		let selected = { ...val, selected: !checked };
		documents.Technical[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			Technical,
			documents
		});
		console.log("documnets", documents);
		console.log("Technical", Technical);
	};

	bussinessCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
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
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let BusinessOwnership_ExistenceProof_AnyOne = cloneDeep(
			documents.BusinessOwnership_ExistenceProof_AnyOne
		);
		let selected = { ...val, selected: !checked };
		documents.BusinessOwnership_ExistenceProof_AnyOne[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			BusinessOwnership_ExistenceProof_AnyOne,
			documents
		});
		console.log("documnets", documents);
		console.log(
			"BusinessOwnership_ExistenceProof_AnyOne",
			BusinessOwnership_ExistenceProof_AnyOne
		);
	};

	applicationCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.ApplicationForm, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.ApplicationForm, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let ApplicationForm = cloneDeep(documents.ApplicationForm);
		let selected = { ...val, selected: !checked };
		documents.ApplicationForm[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			ApplicationForm,
			documents
		});
		console.log("documnets", documents);
		console.log("ApplicationForm", ApplicationForm);
	};

	feesCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.LoginFees, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.LoginFees, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let LoginFees = cloneDeep(documents.LoginFees);
		let selected = { ...val, selected: !checked };
		documents.LoginFees[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			LoginFees,
			documents
		});
		console.log("documnets", documents);
		console.log("LoginFees", LoginFees);
	};

	nonIndividualsignatureCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.SignatureVerificationNonIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(
			documents && documents.SignatureVerificationNonIndividual,
			val
		);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let SignatureVerificationNonIndividual = cloneDeep(
			documents.SignatureVerificationNonIndividual
		);
		let selected = { ...val, selected: !checked };
		documents.SignatureVerificationNonIndividual[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			SignatureVerificationNonIndividual,
			documents
		});
		console.log("documnets", documents);
		console.log(
			"SignatureVerificationNonIndividual",
			SignatureVerificationNonIndividual
		);
	};

	nonIndividualaddproofCheck = e => {
		let { documents } = this.state;
		console.log("value....", e.target.value);
		let val = find(documents && documents.AddressProofNonIndividual, {
			id: JSON.parse(e.target.value)
		});
		let dockey = findKey(documents && documents.AddressProofNonIndividual, val);
		console.log("dockey", dockey);

		console.log("val...", val);
		let checked = val.selected;
		let AddressProofNonIndividual = cloneDeep(
			documents.AddressProofNonIndividual
		);
		let selected = { ...val, selected: !checked };
		documents.AddressProofNonIndividual[dockey] = selected;
		console.log("after ....", selected);
		this.setState({
			selected: !selected.selected,
			AddressProofNonIndividual,
			documents
		});
		console.log("documnets", documents);
		console.log("AddressProofNonIndividual", AddressProofNonIndividual);
	};

	onInputChange = (name, value, error = undefined, checklist) => {
		this.state[checklist][name] = value;
		if (error !== undefined) {
			let { errors } = this.state[checklist];
			this.state[checklist].errors[name] = error;
		}
		this.setState({ [checklist]: this.state[checklist] });
		console.log("checklist", checklist);
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
		let { documents, checklistDetails, checklist } = this.state;
		// let AgeProofvalid =
		//   documents && documents.AgeProof_AnyOne
		//     ? documents && documents.AgeProof_AnyOne[0].selected === true
		//     : null;
		// let IdProofvalid =
		//   documents && documents.IdProof_AnyOne
		//     ? documents && documents.IdProof_AnyOne[0].selected === true
		//     : null;
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
			approveFlag: approveFlag,
			mobileNumber: checklistDetails && checklistDetails.mobileNumber,
			docMap: documents,
			id: id,
			ipaddress: checklistDetails && checklistDetails.ipaddress
		};

		if (!approveFlag) {
			te("Plaese Select Mandatory fields");
			return false;
		}

		if (approveFlag) {
			postcreateOrUpdateChecklist(obj).then(response => {
				console.log("response of save checklist", response);
				if (response.error == false) {
					ts(response.data.message);
					this.props.history.push(
						`${public_url.co_applicant_status}/${match.params.leadcode}`
					);
				} else {
					te(response.data.message);
				}
			});
		} else {
			te("Please Accept Terms and Condition");
		}
	};

	render() {
		let { match } = this.props;
		let {
			checklist,
			checklistDetails,
			documents,
			selected,
			IdProof,
			allData,
			docs,
			coApplicantData
		} = this.state;
		let { errors, remark1, approveFlag } = checklist;
		let RmName = "";
		if (this.props.login.isLogin && this.props.login.data) {
			RmName = this.props.login.data.employeeName;
		}
		let coApplicant = {}
		coApplicant = allData && allData.coApplicantList.filter(res => {
			if (res.mobileNumber == match.params.mobileno) {
				return res
			}
		})

		console.log("checklist", checklist);
		console.log("match", match);
		console.log("approveFlag", approveFlag);

		console.log("checklistDetails", checklistDetails);
		console.log("documents", documents && documents);
		console.log("IdProof", IdProof);
		console.log("allData", allData);

		let coApplicantList = "";
		if (allData) {
			coApplicantList = allData.coApplicantList;
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
									to={`${public_url.checklist}/${allData.leadCode}/${allData.mobileNumber}`}
								>
									<button
										className={`btn btn-primary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${match
											.params.mobileno === allData.mobileNumber &&
											"btn-green"} `}
									>
										Applicant
                  </button>
								</Link>
								{coApplicantList &&
									coApplicantList.map(res => {
										return (
											<Link
												to={`${public_url.co_applicant_checklist}/${res.leadCode}/${res.mobileNumber}`}
											>
												<button
													className={`btn btn-primary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${match
														.params.mobileno === res.mobileNumber &&
														"btn-green"}`}
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
									<p className="text-green ml-5">	({coApplicant[0] && coApplicant[0].typeOfEntity})</p>
								</div>
								<p className="text-primary fw-700 ">Case Login Credentials</p>

								{/* 2nd row */}
								<div className="row pl-5  mt-2">
									{/* <div className="col-lg-8 col-md-6 mt-2">
                    {documents &&
                      documents.LoginFees.map(res => (
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
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
                            {res.docTypeDesc}
                          </label>
                        </div>
                      ))}
                  </div> */}
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
													disabled={true}
													className="custom-control-input"
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
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
															>
																*
                                </span>{" "}
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
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
															>
																*
                                </span>{" "}
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
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
														disabled={true}
														className="custom-control-input"
														id={res.id}
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
									{documents && documents.OwnershipProof_AnyOne &&
										documents.OwnershipProof_AnyOne.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
							{checklistDetails &&
								checklistDetails.financialstatus === "financial" && (
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
															disabled={true}
															className="custom-control-input"
															id={res.id}
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
												<p
													className="text-l-priamry"
													style={{ float: "right" }}
												>
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
								)}

							{checklistDetails &&
								checklistDetails.financialstatus === "financial" && (
									<div className="row pl-5">
										<div className="col-lg-2">
											<p className="text-primary mt-1">
												Select GST Documents Received
                      </p>
										</div>

										<div className="col-lg-7">
											{documents &&
												documents.FinancialGST.map(res => (
													<div className="custom-control custom-checkbox mt-2">
														<input
															type="checkbox"
															disabled={true}
															className="custom-control-input"
															id={res.id}
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
								)}

							<div className="row pl-5  mt-3">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Banking Documents Received
                  </p>
								</div>

								<div className="col-lg-6">
									{documents &&
										documents.Banking.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													disabled={true}
													className="custom-control-input"
													id={res.id}
													value={res.id}
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
													disabled={true}
													className="custom-control-input"
													id={res.id}
													value={res.id}
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
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
							<div className="row pl-5  mt-3">
								<div className="col-lg-2">
									<p className="text-primary mt-1">
										Select Technical Documents Received
                  </p>
								</div>

								<div className="col-lg-7">
									{documents &&
										documents.Technical.map(res => (
											<div className="custom-control custom-checkbox mt-2">
												<input
													type="checkbox"
													disabled={true}
													className="custom-control-input"
													id={res.id}
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
										I {RmName}, have
                    performed with due dilligence in understanding, the customer
                    details as per the bank guidlines while performing the case
                    login. I agree to the{" "}
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
									<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
										Cancel
                  </button>
								</Link>
								<button
									className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3"
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

//export default CoapplicantChecklist;
export default connect(state => state, null)(CoapplicantChecklist);