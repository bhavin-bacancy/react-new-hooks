import React from "react";
import { Select, Input } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import { getFormDetails } from "../../../Utility/Helper";
import { te, ts } from "../../../Utility/ReduxToaster";
import {
	postAdditionalDetail,
	postAddAlternateContactDetail
} from "../../../Utility/Services/QDE";
import { withRouter } from "react-router-dom";

let initForm = {
	alternateMobileNumber: "",
	errors: { alternateMobileNumber: null }
};
class AlternativeContactDetailNonIndividual extends React.Component {
	constructor() {
		super();
		this.state = {
			alternativeContactDetailOpen: false,
			form: cloneDeep(initForm),
			saveForm: false,
			alternativeContactDetailLoading: false
		};
	}

	alternativeContactDetailOpen = () => {
		let { alternativeContactDetailOpen } = this.state;
		this.setState({
			alternativeContactDetailOpen: !alternativeContactDetailOpen
		});
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
	
	SaveForm = () => {
		let { saveForm, form } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			obj.leadCode = params.leadcode;
			obj.mobileNumber = params.mobileno;
			obj.altcntflag = true;
			obj.mainapplicant = false;
			obj.custcode = leadDetail.custcode
			this.setState({ alternativeContactDetailLoading: true });
			postAddAlternateContactDetail(obj).then(res => {
				if (res.error) {
					this.setState({
						saveForm: saveForm,
						alternativeContactDetailLoading: false
					});
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({
						saveForm: saveForm,
						alternativeContactDetailLoading: false
					});
				} else {
					ts(res.data.message);
					this.setState(
						{
							saveForm: !saveForm,
							alternativeContactDetailLoading: false
						},
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
	componentDidUpdate(preProps) {
		if (preProps.leadDetail != this.props.leadDetail) {
			this.FormUpdate();
		}
	}
	componentDidMount() {
		this.FormUpdate();
	}
	FormUpdate = () => {
		let { leadDetail } = this.props;
		let { form } = this.state;
		Object.keys(form).map(res => {
			if (leadDetail[res]) {
				form[res] = leadDetail[res];
			}
		});
		this.setState({ form, saveForm: leadDetail.altcntflag ? true : false });
	};
	render() {
		let {
			alternativeContactDetailOpen,
			form,
			saveForm,
			alternativeContactDetailLoading
		} = this.state;
		let { leadDetail } = this.props;
		let { isdCode, alternateMobileNumber, errors } = form;
		let alternativeContactFormStatus = false;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && !form[res]) return res;
		});
		alternativeContactFormStatus = getFormDetails(form, () => { });
		if (alternativeContactFormStatus && CheckForm.length == 0) {
			alternativeContactFormStatus = true;
		}

		return (
			<React.Fragment>
				{" "}
				<div class="row align-items-center mb-4">
					<div className="addressdetaillblock">
						<div class="pr-3" onClick={this.alternativeContactDetailOpen}>
							<label class="mb-0 fw-700 text-primary2 colorGreen">
								{alternativeContactDetailOpen ? "-" : "+"} Alternative Contact
								Details (Not Mandatory)
            </label>
						</div>
						<div class="flex-grow-1">
							<hr class="bg_lightblue" />
						</div>
					</div>
				</div>
				{alternativeContactDetailOpen && (
					<div class="row">
						<div class="col-sm-12">
							<div className="ml-4">
								<div class="row">
									<div class="col-md-4 col-lg-2 d-flex">
										<label class="fs-14 mb-0 gTextPrimary fw-500">
											Mobile Number
                </label>
									</div>
									{/* <div class="col-md-8 col-lg-2 mt-2 mt-lg-0">
                <div class="select">
                  <Select
                    className="w-100 fs-12 create-lead-form-select"
                    //options={cityList}
                    value={isdCode}
                    title="Isd Code"
                    name="isdCode"
                    onChangeFunc={(name, value, error) => {
                      this.onInputChange(name, value, error);
                    }}
                    isReq={true}
                    //labelKey="cityName"
                    //valueKey="cityId"
                    //  error={errors.city}
                  />
                </div>
              </div> */}
									<div class="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
										{!saveForm ? (
											<Input
												title="Mobile Number"
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												placeholder="Type Mobile Number"
												name="alternateMobileNumber"
												value={alternateMobileNumber}
												onChangeFunc={this.onInputChange}
												error={errors.alternateMobileNumber}
												validationFunc={(name, error) => {
													if (
														leadDetail.mobileNumber &&
														leadDetail.mobileNumber == alternateMobileNumber
													) {
														error =
															"Register mobile number and alternative mobile number should not be same!";
													}
													this.onInputValidate(name, error);
												}}
												maxLength="10"
												reqType="mobile10"
												isReq={true}
											/>
										) : (
												alternateMobileNumber
											)}
									</div>
								</div>
							</div>
							<div class="row justify-content-end mt-3 pr-0 mt-lg-0">
								<div className="col-sm-12 text-right">
									{!saveForm && leadDetail.altcntflag && (
										<button
											disabled=""
											class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
											onClick={this.props.GetLeadDetail}
										>
											Cancel
                </button>
									)}
									<button
										disabled={
											!alternativeContactFormStatus ||
											alternativeContactDetailLoading
										}
										class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${alternativeContactFormStatus &&
											"btn-green"}`}
										onClick={e => {
												this.SaveForm(e);
										
										}}
									>
										{saveForm
											? "Edit"
											: `${alternativeContactDetailLoading ? "Saving..." : "Save"}`}
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</React.Fragment>
		);
	}
}
export default withRouter(AlternativeContactDetailNonIndividual);
