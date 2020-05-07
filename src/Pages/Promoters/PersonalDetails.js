import React, { useState, useEffect } from "react";
import { Select, Input } from "../../Component/Input";
import { cloneDeep } from "lodash";
import moment from "moment";
import { getFormDetails } from "../../Utility/Helper";
import { addPersonalDetails } from "../../Utility/Services/Promoter";
import { ts, te } from "../../Utility/ReduxToaster"

const personalDetailForm = {
	dateofbirth: "",
	fatherName: "",
	errors: {
		dateofbirth: null,
		fatherName: null,
	}
};

export const PersonalDetails = (props) => {
	const [data, setData] = useState({
		personalDetailOpen: true,
	});

	const [state, setState] = useState({
		form: cloneDeep(personalDetailForm),
		saveForm: false,
		loading: false,
	});


	useEffect(() => {
		state.form = { ...cloneDeep(personalDetailForm), ...props.selectedData };
		if (props.selectedData && props.selectedData.id && props.selectedData.dateofbirth) {
			state.saveForm = true
		}
		if (props.selectedData && props.selectedData.id && !props.selectedData.dateofbirth) {
			state.saveForm = false
		}
		if (props.newPromoter) {
			state.form = cloneDeep(personalDetailForm)
			state.saveForm = false
			state.loading = false
		}
		if (props.viewMode && props.selectedData.dateofbirth) {
			state.saveForm = true
		}
		setState({ ...state, form: { ...state.form } })
	}, [props.selectedData]);


	let { personalDetailOpen } = data;
	let { form, saveForm, loading } = state;
	let { dateofbirth, fatherName, errors } = form;

	const personalDetailToggle = () => {
		setData({ personalDetailOpen: !personalDetailOpen });
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

	const onAddPersonalDetail = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode
		setState({ ...state, loading: true });
		let date = new Date(dateofbirth).getTime();
		let objForm = {};
		delete objForm.errors;
		objForm.dateofbirth = date;
		objForm.id = props.selectedData && props.selectedData.id ? props.selectedData.id : null;
		objForm.leadcode = leadCode;
		objForm.fatherName = fatherName;
		objForm.loanrefnumber = props.promoterDetail && props.promoterDetail.loannumber;
		objForm.createdDate = new Date().getTime();
		objForm.updateDate = new Date().getTime();
		objForm.createdby = localStorage.getItem("employeeId");
		objForm.updatedby = localStorage.getItem("employeeId");
		Object.keys(objForm).map(res => {
			if (objForm[res] == "") { objForm[res] = null }
		})
		addPersonalDetails(objForm).then(res => {
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
			state.form = { ...personalDetailForm, ...props.selectedData };
			state.saveForm = true
			setState({ ...state })
		}
	}

	let persoanlDetailFormStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (res != "errors" && res != "aadharCard" && res != "designation" && res != "shareholdingPercentage" && res != "address1" && res != "residenceownership" && res != "faxno" && !form[res]) return res;
	});
	let formStatus = getFormDetails(form, () => { });

	if (CheckForm.length == 0 && formStatus) {
		persoanlDetailFormStatus = true;
	}

	return (
		<React.Fragment>
			<div className="promoter-form pb-0">
				<div onClick={personalDetailToggle} className="promoter-toggle">
					<i className="icon">{personalDetailOpen ? "-" : "+"}</i> Persoanl Details
        </div>
				{personalDetailOpen && (
					<>
						<div className="row pl-4">
							<div className="col-lg-6 mt-4">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Date of Birth {!saveForm && <span className="text-danger"> * </span>}
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												name="dateofbirth"
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												title="Date of Birth"
												type="date"
												isReq={true}
												error={errors.dateofbirth}
												validationFunc={(name, error) => {
													if (
														new Date("1919-12-12") <
														new Date(dateofbirth) &&
														new Date() > new Date(dateofbirth)
													) {
													} else {
														error = "Please enter valid date";
													}
													onInputValidate(name, error);
												}}
												value={moment(dateofbirth).format(
													"YYYY-MM-DD"
												)}
												min="1920-12-12"
												max={moment(new Date()).format("YYYY-MM-DD")}
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{dateofbirth ? moment(dateofbirth).format("YYYY-MM-DD") : "-"}
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
											Father’s Name {!saveForm && <span className="text-danger"> * </span>}
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
												value={fatherName}
												name="fatherName"
												title="Father’s Name"
												reqType="onlyAlphbate"
												isReq={true}
												maxLength={150}
												error={errors.fatherName}
												placeholder="Type Father’s Name"
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{fatherName ? fatherName : "-"}
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
											disabled={!persoanlDetailFormStatus}
											onClick={onAddPersonalDetail}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 ${persoanlDetailFormStatus &&
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

