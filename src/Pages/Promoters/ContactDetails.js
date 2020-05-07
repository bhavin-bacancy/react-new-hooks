import React, { useState, useEffect } from "react";
import { Select, Input, TextArea } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import { addContactDetails } from "../../Utility/Services/Promoter";
import { ts, te } from "../../Utility/ReduxToaster";

const residenceOption = [
	{ label: "Residence Ownership 1", value: "Residence Ownership 1" },
	{ label: "Residence Ownership 2", value: "Residence Ownership 2" },
	{ label: "Residence Ownership 3", value: "Residence Ownership 3" },
	{ label: "Residence Ownership 4", value: "Residence Ownership 4" }
];

const contactDetailForm = {
	address: "",
	address1: "",
	residenceownership: "",
	emailId: "",
	mobileno: "",
	faxno: "",
	errors: {
		address: null,
		emailId: null,
		mobileno: null
	}
};

export const ContactDetails = props => {
	const [data, setData] = useState({
		contactDetailOpen: true
	});

	const [state, setState] = useState({
		form: cloneDeep(contactDetailForm),
		saveForm: false,
		loading: false
	});

	useEffect(() => {

		state.form = { ...cloneDeep(contactDetailForm), ...props.selectedData };
		if (props.selectedData && props.selectedData.id && props.selectedData.address) {
			state.saveForm = true
		}
		if (props.selectedData && props.selectedData.id && !props.selectedData.address) {
			state.saveForm = false
		}
		if (props.newPromoter) {
			state.form = cloneDeep(contactDetailForm)
			state.saveForm = false
			state.loading = false
		}
		if (props.viewMode && props.selectedData.address) {
			state.saveForm = true
		}
		setState({ ...state, form: { ...state.form } })
	}, [props.selectedData]);


	let { contactDetailOpen } = data;
	let { form, saveForm, loading } = state;
	let {
		address,
		address1,
		residenceownership,
		emailId,
		mobileno,
		faxno,
		errors
	} = form;

	const contactDetailToggle = () => {
		setData({ contactDetailOpen: !contactDetailOpen });
	};

	const onInputChange = (name, value, error = undefined) => {
		let { form } = state;
		form[name] = value;

		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		setState({ ...state, form });
	};

	const onInputValidate = (name, error) => {
		let { errors } = state.form;
		errors[name] = error;
		setState({ ...state, form: { ...state.form, errors: errors } });
	};

	const onAddContactDetail = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode;
		setState({ ...state, loading: true });
		let objForm = {};
		delete objForm.errors;
		objForm.id =
			props.selectedData && props.selectedData.id
				? props.selectedData.id
				: null;
		objForm.leadcode = leadCode;
		objForm.address = address;
		objForm.address1 = address1;
		objForm.residenceownership = residenceownership;
		objForm.emailId = emailId;
		objForm.mobileno = mobileno;
		objForm.faxno = faxno;
		objForm.loanrefnumber =
			props.promoterDetail && props.promoterDetail.loannumber;
		objForm.createdDate = new Date().getTime();
		objForm.updateDate = new Date().getTime();
		objForm.createdby = localStorage.getItem("employeeId");
		objForm.updatedby = localStorage.getItem("employeeId");
		Object.keys(objForm).map(res => {
			if (objForm[res] == "") {
				objForm[res] = null;
			}
		});
		addContactDetails(objForm).then(res => {
			if (res.error) {
				setState({ ...state, loading: false });
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				setState({ ...state, loading: false });
			} else {
				ts(res.data.message);
				props.onPromoterClick(res.data.data)
				props.getPromoterDetails(res.data.data);
				setState({ ...state, loading: false, saveForm: true });
			}
		});
	};

	const onCancel = (response) => {
		if (response) {
			props.onPromoterClick(response)
			state.form = { ...contactDetailForm, ...props.selectedData };
			state.saveForm = true
			setState({ ...state })
		}
	}

	let contactDetailFormStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (
			res != "errors" && res != "aadharCard" && res != "designation" && res != "shareholdingPercentage" && res != "address1" && res != "residenceownership" && res != "faxno" &&
			!form[res]
		)
			return res;
	});
	let formStatus = getFormDetails(form, () => { });

	if (CheckForm.length == 0 && formStatus) {
		contactDetailFormStatus = true;
	}

	return (
		<React.Fragment>
			<div className="promoter-form pb-0">
				<div onClick={contactDetailToggle} className="promoter-toggle">
					<i className="icon">{contactDetailOpen ? "-" : "+"}</i> Contact
          Details
        </div>
				{contactDetailOpen && (
					<>
						<div className="row pl-4">
							<div className="col-lg-6 mt-4">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Address{" "}
											{!saveForm && <span className="text-danger"> * </span>}
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<TextArea
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												name="address"
												value={address}
												title="Address Line 1"
												reqType="address"
												isReq={true}
												maxLength={300}
												error={errors.address}
												placeholder="Apartment no./ wing/ Building name"
											/>
										</div>
									) : (
											<div className="col-lg-7 word-break-all">{address ? address : "-"}</div>
										)}
								</div>
							</div>
						</div>

						<div className="row pl-4">
							<div className="col-lg-6">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500"></label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<TextArea
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												name="address1"
												value={address1}
												title="Address Line 2"
												reqType="address"
												maxLength={300}
												placeholder="Address line 2"
											/>
										</div>
									) : (
											<div className="col-lg-7 word-break-all">{address1}</div>
										)}
								</div>
							</div>
						</div>

						<div className="row pl-4">
							<div className="col-lg-6">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Residence Ownership
                    </label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={residenceOption}
												value={residenceownership}
												title="Residence Ownership"
												name="residenceownership"
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{residenceownership ? residenceownership : "-"}
											</div>
										)}
								</div>
							</div>
						</div>

						<div className="row pl-4">
							<div className="col-lg-6">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Email ID{" "}
											{!saveForm && <span className="text-danger"> * </span>}
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												value={emailId}
												name="emailId"
												title="Emial ID"
												reqType="email"
												isReq={true}
												error={errors.emailId}
												placeholder="Type Email ID"
											/>
										</div>
									) : (
											<div className="col-lg-7">{emailId ? emailId : "-"}</div>
										)}
								</div>
							</div>
						</div>

						<div className="row pl-4">
							<div className="col-lg-6 ">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Mobile No.{" "}
											{!saveForm && <span className="text-danger"> * </span>}
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(
														name,
														value ? parseFloat(value) : "",
														error
													);
												}}
												value={mobileno}
												name="mobileno"
												title="Mobile No."
												reqType="mobile10"
												maxLength="10"
												isReq={true}
												error={errors.mobileno}
												placeholder="Type Mobile No."
											/>
										</div>
									) : (
											<div className="col-lg-7">{mobileno ? mobileno : "-"}</div>
										)}
								</div>
							</div>
						</div>

						<div className="row pl-4">
							<div className="col-lg-6">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Fax
                    </label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(
														name,
														value ? parseFloat(value) : "",
														error
													);
												}}
												value={faxno}
												name="faxno"
												title="Fax"
												reqType="number"
												maxLength="10"
												placeholder="Type Fax Number"
											/>
										</div>
									) : (
											<div className="col-lg-7">{faxno ? faxno : "-"}</div>
										)}
								</div>
							</div>
						</div>

						<div className="row mt-4">
							<div className="col-sm-12">
								{!saveForm && (
									<div className="text-right">
										<button
											onClick={() => onCancel(props.selectedData)}
											className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
										>
											Cancel
                    </button>
										<button
											onClick={onAddContactDetail}
											disabled={!contactDetailFormStatus}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 ${contactDetailFormStatus &&
												"btn-green"}`}
										>
											{loading ? "Saving..." : "Save"}
										</button>
									</div>
								)}
								{saveForm && (
									<div className="text-right">
										<button
											onClick={() => {
												setState({ ...state, saveForm: !saveForm, loading: false });
											}}
											className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
										>
											Edit
                    </button>
									</div>
								)}
							</div>
						</div>
					</>
				)}
				<hr className="border-color mb-0 border-0 h-1px " />
			</div>
		</React.Fragment>
	);
};
