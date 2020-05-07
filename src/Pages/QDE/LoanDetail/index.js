import React from "react";
import { loadPurpose, tenure } from "../../../Utility/Constant";
import { Select, Input } from "../../../Component/Input";
import { cloneDeep, maxBy } from "lodash";
import { getFormDetails } from "../../../Utility/Helper";
import { postAddLoanDetail } from "../../../Utility/Services/QDE";
import { te, ts } from "../../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";

const initForm = {
	purposeofloan: "Timepass",
	amount: "",
	collateralvalue: "",
	tenure: "",
	yeild: "",
	productName: "LAP",
	existemiobligation: "YES",
	customerstatus: "APPROVED",
	mainapplicant: true,
	createdBy: "VI1000P",
	updatedBy: "VI1000P",
	leadCode: "LAP-0001",
	errors: {
		purposeofloan: null,
		amount: null,
		collateralvalue: null,
		tenure: null,
		yeild: null,
		productName: null,
		existemiobligation: null,
		customerstatus: null
	}
};
class LoanDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			loanDetailOpen: false,
			loanPurposeList: cloneDeep(loadPurpose),
			form: cloneDeep(initForm),
			amountData: [100, 10000],
			collateralData: [1, 5665448],
			tenureList: [],
			saveForm: false,
			loandDetailLoading: false,
			loanDetail: ""
		};
	}
	loanDetailOpen = () => {
		let { loanDetailOpen } = this.state;
		this.setState({ loanDetailOpen: !loanDetailOpen });
	};
	onInputChange = (name, value, error = undefined) => {
		const { form } = this.state;
		form[name] = value;
		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		this.setState({ form });
	};
	// handle validation
	onInputValidate = (name, error) => {
		let { errors } = this.state.form;
		errors[name] = error;
		this.setState({
			form: { ...this.state.form, errors: errors }
		});
	};
	SaveCoForm = () => {
		let { saveForm, form } = this.state;
		let { match } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			obj.leadCode = params.leadcode;
			obj.loandtlsflag = true;
			obj.mobileNumber = params.mobileno;
			this.setState({ loandDetailLoading: true });
			postAddLoanDetail(obj).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, loandDetailLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, loandDetailLoading: false });
				} else {
					ts(res.data.message);
					this.setState(
						{ saveForm: !saveForm, loandDetailLoading: false },
						() => {
							this.props.GetLeadDetail();
						}
					);
				}
			});
		} else {
			this.setState({ saveForm: !saveForm });
		}
	};

	SaveForm = () => {
		let { saveForm, form } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			obj.leadCode = params.leadcode;
			obj.loandtlsflag = true;
			obj.mobileNumber = params.mobileno;
			obj.mainapplicant = true;
			obj.custcode = ""
			this.setState({ loandDetailLoading: true });
			postAddLoanDetail(obj).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, loandDetailLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, loandDetailLoading: false });
				} else {
					ts(res.data.message);
					this.setState(
						{ saveForm: !saveForm, loandDetailLoading: false },
						() => {
							this.props.GetLeadDetail();
						}
					);
				}
			});
		} else {
			this.setState({ saveForm: !saveForm });
		}
	};
	componentDidMount() {
		this.FormUpdate();
	}
	componentDidUpdate(preProps, preState) {
		if (preProps.loanDetail != this.props.loanDetail) {
			this.FormUpdate();
		}
	}
	FormUpdate = () => {
		let { leadDetail } = this.props;
		let { form } = this.state;
		Object.keys(form).map(res => {
			if (leadDetail[res]) {
				form[res] = leadDetail[res];
			}
		});
		this.setState({
			form,
			saveForm: leadDetail.loandtlsflag ? true : false,
			loanDetail: this.props.loanDetail
		});
	};
	AmountFigure = amount => {
		if (amount > 0 && amount <= 99) {
			return "rs";
		} else if (amount > 99 && amount <= 999) {
			return "hundred rs";
		} else if (amount > 999 && amount <= 99999) {
			return "thousand res";
		} else if (amount > 99999 && amount <= 9999999) {
			return "lac rs";
		} else if (amount > 9999999 && amount <= 999999999) {
			return "cr rs";
		} else if (amount > 999999999 && amount <= 99999999999) {
			return "arab rs";
		}
		return "";
	};
	render() {
		let {
			loanDetailOpen,
			form,
			loanPurposeList,
			amountData,
			collateralData,
			tenureList,
			saveForm,
			loandDetailLoading,
			loanDetail
		} = this.state;
		let {
			purposeofloan,
			errors,
			amount,
			collateralvalue,
			tenure,
			yeild
		} = form;
		let { leadDetail } = this.props;
		let loanDetailFormStatus = false;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && !form[res]) return res;
		});
		let formStatus = getFormDetails(form, () => { });

		if (CheckForm.length == 0 && formStatus) {
			loanDetailFormStatus = true;
		}
		let tenList = [];
		if (loanDetail)
			for (let i = 60; i <= loanDetail.loandetails.maxtenure; i++) {
				tenList.push({ value: i, label: i });
			}
		let amuntFigure = this.AmountFigure(amount);
		let CollateralFigure = this.AmountFigure(collateralvalue);
		return (
			<React.Fragment>
				<div className="gAccordion">
					<div className="gAccordion__title" onClick={this.loanDetailOpen}>
						<i class="icon">{loanDetailOpen ? "-" : "+"}</i> Loan Details
            (Mandatory)
          </div>
					{loanDetailOpen && (
						<div className="gAccordion__body">
							<div className="row align-items-center pr-lg-5 mt-3">
								<div className="col-12 mb-3">
									<label class="fs-14 mb-0 gTextPrimary fw-700">
										Loan against property
                  </label>
								</div>
								<div class="col-md-4 col-lg-2 d-flex align-items-center">
									<label class="fs-14 mb-0 gTextPrimary fw-500">
										Purpose of Loan
                  </label>
								</div>
								<div class="col-md-8 col-lg-4 mt-2 mt-lg-0 mr-auto">
									<div class="select">
										{!saveForm ? (
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={loanDetail && loanDetail.purposelist}
												value={purposeofloan}
												title="Purpose of Loan"
												name="purposeofloan"
												onChangeFunc={(name, value, error) => {
													this.onInputChange(name, value, error);
												}}
												isReq={true}
												error={errors.purposeofloan}
												valueKey="subcatId"
												labelKey="loanpurpose"
											/>
										) : (
												loanDetail && loanDetail.purposelist.map(res => {
													if (res.subcatId == purposeofloan) {
														return res.loanpurpose;
													}
												})
											)}
									</div>
								</div>
							</div>
							<div className="row align-items-center pr-lg-5 mt-3">
								<div class="col-md-4 col-lg-2 d-flex align-items-center">
									<label class="fs-14 mb-0 gTextPrimary fw-500">
										Amount Required
                  </label>
								</div>
								<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
									{!saveForm ? (
										<Input
											//type="number"
											error={errors.amount}
											reqType="Amount"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											value={amount}
											name="amount"
											title="amount"
											maxLength="18"
											onChangeFunc={(name, value, error) => {
												if (
													loanDetail && loanDetail.loandetails.maxloanamt >= value
												)
													this.onInputChange(name, value, error);
											}}
											validationFunc={(name, error) => {
												if (amount < loanDetail.loandetails.minloanamt) {
													error = `Minimum Amount should be ${loanDetail.loandetails.minloanamt}`;
												}
												if (amount > loanDetail.loandetails.maxloanamt) {
													error = `Maximum Amount should be ${loanDetail.loandetails.maxloanamt}`;
												}
												if (parseFloat(collateralvalue) < parseFloat(amount)) {

													this.onInputValidate("collateralvalue", "Collateral value should be greater than Amount required");
												}
												this.onInputValidate(name, error);
											}}
											isReq={true}
										/>
									) : (
											amount
										)}
								</div>
								<div class="col-md-8 col-lg-5 d-flex align-items-center mt-lg-0 mt-3 offset-md-4 offset-lg-0">
									<div class="progressWrap w-100">
										<span className="amount colorGreen" style={{ left: "50%" }}>
											{amount} {amuntFigure}
										</span>
										{loanDetail && (
											<div class="progress w-100">
												<div
													class="progress-bar"
													role="progressbar"
													style={{
														width:
															parseFloat(amount * 100) /
															loanDetail.loandetails.maxloanamt +
															"%"
													}}
													aria-valuenow="50"
													aria-valuemin="0"
													aria-valuemax="100"
												></div>
											</div>
										)}
										<span className="valueMin">
											{loanDetail && loanDetail.loandetails.minloanamt}
										</span>
										<span className="valueMax">
											{loanDetail && loanDetail.loandetails.maxloanamt}
										</span>
									</div>
								</div>
							</div>
							<div className="row align-items-center pr-lg-5 mt-3">
								<div class="col-md-4 col-lg-2 d-flex align-items-center">
									<label class="fs-14 mb-0 gTextPrimary fw-500">
										Collateral Declared Value
                  </label>
								</div>
								<div class="col-md-8 col-lg-3 mt-2 mt-lg-0 mr-auto">
									{!saveForm ? (
										<Input
											//type="number"
											error={errors.collateralvalue}
											reqType="Amount"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											value={collateralvalue}
											name="collateralvalue"
											title="Collateral value"
											maxLength="18"
											onChangeFunc={(name, value, error) => {
												if (
													loanDetail &&
													loanDetail.loandetails.maxcollateralvalue >= value
												)
													this.onInputChange(name, value, error);
											}}
											validationFunc={(name, error) => {
												if (parseFloat(collateralvalue) < parseFloat(amount)) {
													error =
														"Collateral value should be greater than Amount required";
												}
												this.onInputValidate(name, error);
											}}
											min={
												loanDetail && loanDetail.loandetails.mincollateralvalue
											}
											max={
												loanDetail && loanDetail.loandetails.maxcollateralvalue
											}
											isReq={true}
										/>
									) : (
											collateralvalue
										)}
								</div>
								<div class="col-md-8 col-lg-5 d-flex align-items-center mt-lg-0 mt-3 offset-md-4 offset-lg-0">
									<div class="progressWrap w-100">
										<span className="amount colorGreen" style={{ left: "55%" }}>
											{collateralvalue} {CollateralFigure}
										</span>

										{loanDetail && (
											<div class="progress w-100">
												<div
													class="progress-bar"
													role="progressbar"
													style={{
														width:
															(parseFloat(collateralvalue) * 100) /
															loanDetail.loandetails.maxcollateralvalue +
															"%"
													}}
													aria-valuenow="55"
													aria-valuemin="0"
													aria-valuemax="100"
												></div>
											</div>
										)}
										<span className="valueMin">
											{loanDetail && loanDetail.loandetails.mincollateralvalue}
										</span>
										<span className="valueMax">
											{loanDetail && loanDetail.loandetails.maxcollateralvalue}
										</span>
									</div>
								</div>
							</div>
							<div className="row align-items-center pr-lg-5 mt-3">
								<div class="col-md-4 col-lg-2 d-flex align-items-center">
									<label class="fs-14 mb-0 gTextPrimary fw-500">
										Tenure Required
                  </label>
								</div>
								<div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 col-custom-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3">
									<div class="select">
										{!saveForm ? (
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={tenList}
												value={tenure}
												title="Tenure"
												name="tenure"
												onChangeFunc={(name, value, error) => {
													this.onInputChange(name, value, error);
												}}
												isReq={true}
												error={errors.tenure}
												// valueKey="id"
												isReq={true}
											/>
										) : (
												tenure
											)}
									</div>
								</div>
								<div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3 mr-auto">
									<label class="fs-14 mb-0 gTextPrimary fw-500">Months</label>
								</div>
								<div class="col-md-8 col-lg-5 d-flex align-items-center mt-lg-0 mt-3 offset-md-4 offset-lg-0">
									<div class="progressWrap w-100">
										<span className="amount colorGreen" style={{ left: "75%" }}>
											{tenure} Months
                    </span>
										{loanDetail && (
											<div class="progress w-100">
												<div
													class="progress-bar"
													role="progressbar"
													style={{
														width:
															parseFloat(tenure * 100) /
															loanDetail.loandetails.maxtenure +
															"%"
													}}
													aria-valuenow="75"
													aria-valuemin="0"
													aria-valuemax="100"
												></div>
											</div>
										)}
										<span className="valueMin">
											{loanDetail && loanDetail.loandetails.mintenure}
										</span>
										<span className="valueMax">
											{loanDetail && loanDetail.loandetails.maxtenure}
										</span>
									</div>
								</div>
							</div>
							<div className="row align-items-center pr-lg-5 mt-3">
								<div class="col-md-4 col-lg-2 d-flex align-items-center">
									<label class="fs-14 mb-0 gTextPrimary fw-500">
										Yield Required
                  </label>
								</div>
								<div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3 col-custom-1">
									{!saveForm ? (
										<Input
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											type="number"
											onChangeFunc={(name, value, error) => {
												if (value <= 100)
													this.onInputChange(name, value, error);
											}}
											validationFunc={this.onInputValidate}
											value={yeild}
											name="yeild"
											error={errors.yeild}
											isReq={true}
											title="Yeild"
											min="0"
										/>
									) : (
											yeild
										)}
								</div>
								<div class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 mt-2 mt-lg-0 pr-0 pl-0 ml-3">
									<label class="fs-14 mb-0 gTextPrimary fw-500">%</label>
								</div>
							</div>
							<div class="row justify-content-end mt-4 mx-0">
								{!saveForm && leadDetail.loandtlsflag && (
									<button
										disabled=""
										class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
										onClick={this.props.GetLeadDetail}
									>
										Cancel
                  </button>
								)}
								<button
									disabled={!loanDetailFormStatus || loandDetailLoading}
									class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${
										loanDetailFormStatus &&
										"btn-green"}`}
									onClick={this.SaveForm}
								>
									{saveForm
										? "Edit"
										: loandDetailLoading
											? "Saving..."
											: "Save"}
								</button>
							</div>
						</div>
					)}
					<hr class="bg_lightblue border-0 h-1px" />
				</div>
			</React.Fragment>
		);
	}
}
export default withRouter(LoanDetail);
