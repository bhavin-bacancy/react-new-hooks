import React, { useState, useEffect } from "react";
import { Select, Input } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import { addGovernmentDetails } from "../../Utility/Services/Promoter";
import { ts, te } from "../../Utility/ReduxToaster"

const governmentForm = {
	pan: "",
	aadharCard: "",
	errors: {
		pan: null,
	}
};

export const KeyGovernmentID = (props) => {
	const [data, setData] = useState({
		governmentIdOpen: true,
	});

	const [state, setState] = useState({
		form: cloneDeep(governmentForm),
		saveForm: false,
		loading: false,
	});

	useEffect(() => {
		state.form = { ...cloneDeep(governmentForm), ...props.selectedData };
		if (props.selectedData && props.selectedData.id && props.selectedData.pan) {
			state.saveForm = true
		}
		if (props.selectedData && props.selectedData.id && !props.selectedData.pan) {
			state.saveForm = false
		}
		if (props.newPromoter) {
			state.form = cloneDeep(governmentForm)
			state.saveForm = false
			state.loading = false
		}
		if (props.viewMode && props.selectedData.id && props.selectedData.pan) {
			state.saveForm = true
		}
		setState({ ...state, form: { ...state.form } })
	}, [props.selectedData]);

	let { governmentIdOpen } = data;
	let { form, saveForm, loading } = state;
	let { pan, aadharCard, errors } = form;

	const governmentIdToggle = () => {
		setData({ governmentIdOpen: !governmentIdOpen });
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

	const onAddGovernmentDetail = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode
		setState({ ...state, loading: true });
		let objForm = {};
		delete objForm.errors;
		objForm.id = props.selectedData && props.selectedData.id ? props.selectedData.id : null;
		objForm.leadcode = leadCode;
		objForm.pan = pan;
		objForm.aadharCard = aadharCard
		objForm.loanrefnumber = props.promoterDetail && props.promoterDetail.loannumber;
		objForm.createdDate = new Date().getTime();
		objForm.updateDate = new Date().getTime();
		objForm.createdby = localStorage.getItem("employeeId");
		objForm.updatedby = localStorage.getItem("employeeId");
		Object.keys(objForm).map(res => {
			if (objForm[res] == "") { objForm[res] = null }
		})
		addGovernmentDetails(objForm).then(res => {
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
			state.form = { ...governmentForm, ...props.selectedData };
			state.saveForm = true
			setState({ ...state })
		}
	}

	let governmentDetailFormStatus = false;
	let CheckForm = Object.keys(form).filter(res => {
		if (res != "errors" && res != "aadharCard" && res != "designation" && res != "shareholdingPercentage" && res != "address1" && res != "residenceownership" && res != "faxno" && !form[res]) return res;
	});
	let formStatus = getFormDetails(form, () => { });

	if (CheckForm.length == 0 && formStatus) {
		governmentDetailFormStatus = true;
	}

	return (
		<React.Fragment>
			<div className="promoter-form pb-0">
				<div onClick={governmentIdToggle} className="promoter-toggle">
					<i className="icon">{governmentIdOpen ? "-" : "+"}</i> Key Government Id
        </div>
				{governmentIdOpen && (
					<>
						<div className="row pl-4">
							<div className="col-lg-6 mt-4">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											PAN {!saveForm && <span className="text-danger"> * </span>}
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													let regex = /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-]/g;
													if (value.match(regex) == null) {
														onInputChange(
															name,
															value.toUpperCase(),
															error
														);
													}
												}}
												value={pan}
												name="pan"
												title="PAN"
												minLength="10"
												maxLength="10"
												isReq={true}
												error={errors.pan}
												placeholder="Type PAN Number"
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{pan ? pan : "-"}
											</div>
										)}
								</div>
							</div>

							<div className="col-lg-6 mt-4">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Aadhar Card
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												// validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													if (value.length <= 12) {
														onInputChange(name, value, error);
													}
												}}
												value={aadharCard}
												name="aadharCard"
												title="Aadhar Card"
												minLength={12}
												maxLength={12}
												reqType="number"
												error={errors.aadharCard}
												placeholder="Type Aadhar Number"
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{aadharCard ? aadharCard : "-"}
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
											disabled={!governmentDetailFormStatus}
											onClick={onAddGovernmentDetail}
											className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 ${governmentDetailFormStatus &&
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

