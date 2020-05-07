import React, { useState, useEffect } from "react";
import { Select, Input } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import { addBasicDetails } from "../../Utility/Services/Promoter";
import { ts, te } from "../../Utility/ReduxToaster"

const designationOption = [
	{ label: "Director", value: "Director" },
	{ label: "CEO", value: "CEO" },
	{ label: "MD", value: "MD" },
	{ label: "Non Business", value: "Non Business" },
	{ label: "Trustee", value: "Trustee" },
	{ label: "Member", value: "Member" },
	{ label: "Chairman", value: "Chairman" },
	{ label: "Secretary", value: "Secretary" },
	{ label: "President", value: "President" },
	{ label: "Treasurer", value: "Treasurer" },
	{ label: "Vice Chairman", value: "Vice Chairman" },
	{ label: "Vice President", value: "Vice President" },
]

const basicDetailForm = {
	nameofthePromoter: "",
	designation: "",
	shareholdingPercentage: "",
	errors: {
		nameofthePromoter: null,
	}
};

export const BasicDetails = (props) => {
	const [data, setData] = useState({
		basicDetailOpen: true,
	});

	const [state, setState] = useState({
		form: cloneDeep(basicDetailForm),
		saveForm: false,
		loading: false,
	});

	let { basicDetailOpen } = data;
	let { form, saveForm, loading } = state;
	let { nameofthePromoter, designation, shareholdingPercentage, errors } = form;
	let { selectedData } = props;

	useEffect(() => {
		state.form = { ...cloneDeep(basicDetailForm), ...props.selectedData };
		if (props.selectedData && props.selectedData.id) {
			state.saveForm = true
		}
		if (props.selectedData && !props.selectedData.id) {
			state.saveForm = false
		}

		if (props.newPromoter) {
			state.form = cloneDeep(basicDetailForm)
			state.saveForm = false
			state.loading = false
		}
		if (props.viewMode && props.selectedData.id) {
			state.saveForm = true
		}
		setState({ ...state, form: { ...state.form } })
	}, [props.selectedData]);

	const basicDetailToggle = () => {
		setData({ basicDetailOpen: !basicDetailOpen });
	};

	const onInputChange = (name, value, error = undefined) => {
		let { form } = state;
		if (name == "shareholdingPercentage") {
			if (parseFloat(value) > parseFloat(100)) {
				return false
			}
		}
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

	let basicDetailFormStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (res != "errors" && res != "aadharCard" && res != "designation" && res != "shareholdingPercentage" && res != "address1" && res != "residenceownership" && res != "faxno" && !form[res]) return res;
	});
	let formStatus = getFormDetails(form, () => { });

	if (CheckForm.length == 0 && formStatus) {
		basicDetailFormStatus = true;
	}

	const onAddBasicDetail = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode
		setState({ ...state, loading: true });
		let objForm = {};
		delete objForm.errors;
		objForm.id = props.selectedData && props.selectedData.id ? props.selectedData.id : null;
		objForm.leadcode = leadCode;
		objForm.designation = designation;
		objForm.shareholdingPercentage = parseFloat(shareholdingPercentage ? shareholdingPercentage : "")
		objForm.nameofthePromoter = nameofthePromoter
		objForm.loanrefnumber = props.promoterDetail && props.promoterDetail.loannumber;
		objForm.createdDate = new Date().getTime();
		objForm.updateDate = new Date().getTime();
		objForm.createdby = localStorage.getItem("employeeId");
		objForm.updatedby = localStorage.getItem("employeeId");
		Object.keys(objForm).map(res => {
			if (objForm[res] == "") { objForm[res] = null }
		})
		addBasicDetails(objForm).then(res => {
			if (res.error) {
				setState({ ...state, loading: false })
				return;
			}
			if (res.data.error) {
				te(res.data.message);
				setState({ ...state, loading: false })
			} else {
				ts(res.data.message)
				props.onPromoterClick(res.data.data)
				props.getPromoterDetails(res.data.data);
				setState({ ...state, loading: false, saveForm: true })
			}
		});
	};

	const onCancel = (response) => {
		if (response) {
			props.onPromoterClick(response)
			state.form = { ...basicDetailForm, ...props.selectedData };
			state.saveForm = true
			setState({ ...state })
		}
	}

	let SharePart = 100
	if (props.promoterDetail.promo) {
		props.promoterDetail.promo.map(res => {
			if (props.selectedData.id != res.id) {
				SharePart = SharePart - (res.shareholdingPercentage ? res.shareholdingPercentage : "0")
			}
		})
	}

	return (
		<React.Fragment>
			<div className="promoter-form pb-0">
				<div onClick={basicDetailToggle} className="promoter-toggle">
					<i className="icon">{basicDetailOpen ? "-" : "+"}</i> Basic Details
        </div>
				{basicDetailOpen && (
					<>
						<div className="row pl-4">
							<div className="col-lg-6 mt-4">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Name of Promoter {!saveForm && <span className="text-danger"> * </span>}
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
												value={nameofthePromoter}
												name="nameofthePromoter"
												title="Name of Promoter"
												reqType="onlyAlphbate"
												isReq={true}
												maxLength={150}
												error={errors.nameofthePromoter}
												placeholder="Type Promoter Name"
											/>
										</div>
									) : (
											<div className="col-lg-6">
												{nameofthePromoter ? nameofthePromoter : "-"}
											</div>
										)}

								</div>
							</div>
						</div>
						<div className="row pl-4">
							<div className="col-lg-6 mt-3 mt-3 ">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Designation
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Select
												className="w-100 fs-12 create-lead-form-select"
												options={designationOption}
												value={designation}
												title="Designation"
												name="designation"
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
											/>
										</div>
									) : (
											<div className="col-lg-6">
												{designation ? designation : "-"}
											</div>
										)}
								</div>
							</div>
							<div className="col-lg-6 mt-3 mt-3 ">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Shareholding Percentage
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control w-100 border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													if (SharePart >= value) {
														onInputChange(name, value ? value : "", error);
													}
													else if (SharePart == 0) {
														te(`Applied 100%, You can not add more Shareholding percentage`)
													}
													else {
														te(`You can add maximum ${SharePart}% Shareholding percentage`)
													}
												}}
												value={shareholdingPercentage}
												name="shareholdingPercentage"
												title="Shareholding Percentage"
												reqType="floatNumber"
												error={errors.shareholdingPercentage}
												placeholder="Shareholding Percentage"
											/>
										</div>
									) : (
											<div className="col-lg-6">
												{shareholdingPercentage ? shareholdingPercentage + " % " : "-"}
											</div>
										)}
								</div>
							</div>
						</div>

						<div className="row mt-4">
							<div className="col-sm-12">
								{
									!saveForm &&
									<div className="text-right">
										<button
											onClick={() => onCancel(props.selectedData)}
											className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
											Cancel
              			</button>
										<button
											disabled={!basicDetailFormStatus}
											onClick={onAddBasicDetail}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 ${basicDetailFormStatus &&
												"btn-green"}`}>
											{loading ? "Saving..." : "Save"}
										</button>
									</div>
								}
								{
									saveForm &&
									<div className="text-right">
										<button
											onClick={() => {
												setState({ ...state, saveForm: !saveForm, loading: false });
											}}
											className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
											Edit
              		</button>
									</div>
								}
							</div>
						</div>
					</>
				)}
				<hr className="border-color mb-0 border-0 h-1px " />
			</div>
		</React.Fragment>
	);
}

