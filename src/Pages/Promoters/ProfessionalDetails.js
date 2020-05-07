import React, { useState, useEffect } from "react";
import { Select, Input } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../Utility/Helper";
import { addProfessionalDetails } from "../../Utility/Services/Promoter";
import { ts, te } from "../../Utility/ReduxToaster"

const professionalDetailForm = {
	education: "",
	linkedProfileLink: "",
	// errors: {
	// 	education: null,
	// 	linkedProfileLink: null,
	// }
};

export const ProfessionalDetails = (props) => {
	const [data, setData] = useState({
		professionalDetailOpen: true,
	});

	const [state, setState] = useState({
		form: cloneDeep(professionalDetailForm),
		saveForm: false,
		loading: false,
	});

	useEffect(() => {
		state.form = { ...cloneDeep(professionalDetailForm), ...props.selectedData };
		if (props.selectedData && props.selectedData.id && props.selectedData.education) {
			state.saveForm = true
		}
		if (props.selectedData && props.selectedData.id && !props.selectedData.education) {
			state.saveForm = false
		}
		if (props.newPromoter) {
			state.form = cloneDeep(professionalDetailForm)
			state.saveForm = false
			state.loading = false
		}
		if (props.viewMode && props.selectedData.education) {
			state.saveForm = true
		}
		setState({ ...state, form: { ...state.form } })
	}, [props.selectedData]);

	let { professionalDetailOpen } = data;
	let { form, saveForm, loading } = state;
	let { education, linkedProfileLink } = form;

	const professionalDetailToggle = () => {
		setData({ professionalDetailOpen: !professionalDetailOpen });
	};

	const onInputChange = (name, value, error = undefined) => {
		let { form } = state;
		form[name] = value;

		// if (error !== undefined) {
		// 	let { errors } = form;
		// 	errors[name] = error;
		// }
		setState({ ...state, form });
	};

	// const onInputValidate = (name, error) => {
	// 	let { errors } = state.form;
	// 	errors[name] = error;
	// 	setState({ ...state, form: { ...state.form, errors: errors } });
	// };

	const onAddProfessionalDetail = () => {
		let { match } = props;
		let { params } = match;
		let leadCode = params.leadcode
		setState({ ...state, loading: true });
		let objForm = {};
		delete objForm.errors;
		objForm.id = props.selectedData && props.selectedData.id ? props.selectedData.id : null;
		objForm.education = education
		objForm.linkedProfileLink = linkedProfileLink
		objForm.leadcode = leadCode;
		objForm.loanrefnumber = props.promoterDetail && props.promoterDetail.loannumber;
		objForm.createdDate = new Date().getTime();
		objForm.updateDate = new Date().getTime();
		objForm.createdby = localStorage.getItem("employeeId");
		objForm.updatedby = localStorage.getItem("employeeId");
		Object.keys(objForm).map(res => {
			if (objForm[res] == "") { objForm[res] = null }
		})
		addProfessionalDetails(objForm).then(res => {
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
			state.form = { ...professionalDetailForm, ...props.selectedData };
			state.saveForm = true
			setState({ ...state })
		}
	}

	// let professionalDetailFormStatus = false;
	// let CheckForm = Object.keys(form).filter(res => {
	// 	if (res != "errors" && res != "aadharCard" && res != "designation" && res != "shareholdingPercentage" && res != "address1" && res != "residenceownership" && res != "faxno" && !form[res]) return res;
	// });
	// let formStatus = getFormDetails(form, () => { });

	// if (CheckForm.length == 0 && formStatus) {
	// 	professionalDetailFormStatus = true;
	// }

	return (
		<React.Fragment>
			<div className="promoter-form pb-0">
				<div onClick={professionalDetailToggle} className="promoter-toggle">
					<i className="icon">{professionalDetailOpen ? "-" : "+"}</i> Professional Details
        </div>
				{professionalDetailOpen && (
					<>
						<div className="row pl-4">
							<div className="col-lg-6 mt-4">
								<div className="row">
									<div className="col-lg-5">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Education
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												// validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												value={education}
												name="education"
												title="Education"
												reqType="alphaNumeric"
												// isReq={true}
												maxLength={150}
												// error={errors.education}
												placeholder="Type Education"
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{education ? education : "-"}
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
											LinkedIN Profile Link
										</label>
									</div>
									{!saveForm ? (
										<div className="col-lg-7">
											<Input
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												// validationFunc={onInputValidate}
												onChangeFunc={(name, value, error) => {
													onInputChange(name, value, error);
												}}
												value={linkedProfileLink}
												name="linkedProfileLink"
												title="LinkedIN Profile Link"
												// isReq={true}
												maxLength={100}
												// error={errors.linkedProfileLink}
												placeholder="Type LinkedIN Profile Link"
											/>
										</div>
									) : (
											<div className="col-lg-7">
												{linkedProfileLink ? linkedProfileLink : "-"}
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
											// disabled={!professionalDetailFormStatus}
											onClick={onAddProfessionalDetail}
											className="btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 btn-green">
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

