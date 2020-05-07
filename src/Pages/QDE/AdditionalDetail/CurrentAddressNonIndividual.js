import React from "react";
import { Select, Input, TextArea } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import {
	getAllCity,
	postAdditionalDetail,
	postAddCurrentAddress,
	getCityAndStateByPincode
} from "../../../Utility/Services/QDE";
import { withRouter } from "react-router-dom";
import { any } from "prop-types";
import { te, ts } from "../../../Utility/ReduxToaster";
import { getFormDetails } from "../../../Utility/Helper";
import { postCoApplicantCurrentAddress } from "../../../Utility/Services/CoApplicant";
const initForm = {
	addressline1: "",
	addressline2: "",
	state: "",
	city: "",
	pincode: "",
	addressFlag: true,
	leadCode: "LAP-0057",
	errors: {
		addressline1: null,
		state: null,
		city: null,
		pincode: null
	}
};
class CurrentAddressNonIndividual extends React.Component {
	constructor() {
		super();
		this.state = {
			currentAddressOpen: false,
			cityList: [],
			form: cloneDeep(initForm),
			saveForm: false,
			currentDetailLoading: false,
			pincodeLoading: false,
			pincodeDetail: "",
			formStore: cloneDeep(initForm)
		};
	}
	currentAddressOpen = () => {
		let { currentAddressOpen } = this.state;
		this.setState({ currentAddressOpen: !currentAddressOpen });
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
	getCity = stateId => {
		let stateName = "";
		let { stateList } = this.props;
		stateList.filter(res => {
			if (res.stateId == stateId) {
				stateName = res.stateName;
			}
		});
		getAllCity(stateName).then(res => {
			if (res.error) return;
			this.setState({ cityList: res.data.data });
		});
	};

	SaveForm = () => {
		let { saveForm, form, pincodeDetail } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			obj.leadCode = params.leadcode;
			obj.mobileNumber = params.mobileno;
			obj.curraddflag = true;
			obj.city = pincodeDetail.city_cd;
			obj.state = pincodeDetail.state_cd;
			obj.mainapplicant = false;
			obj.custcode = leadDetail.custcode
			obj.defaultbranch = localStorage.getItem("employeeId");
			this.setState({ currentDetailLoading: true });
			postAddCurrentAddress(obj).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, currentDetailLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, currentDetailLoading: false });
				} else {
					ts(res.data.message);

					this.setState(
						{ saveForm: !saveForm, currentDetailLoading: false },
						() => {
							this.props.OnChange("commonData", {
								...this.props.commonData,
								addressline1: ""
							});
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
		let { form } = this.state;
		if (preProps.leadDetail != this.props.leadDetail) {
			this.FormUpdate();
		}
		if (
			preProps.commonData.addressline1 != this.props.commonData.addressline1
		) {
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
		if (this.props.commonData && this.props.commonData.addressline1) {
			form.addressline1 = this.props.commonData.addressline1;
			form.pincode = this.props.commonData.pincode;
			this.GetCityStateByPincode(this.props.commonData.pincode);
		}
		if (leadDetail.pincode && !this.props.commonData.pincode) {
			this.GetCityStateByPincode(leadDetail.pincode);
		}
		let saveFormFlag = false;
		if (this.props.commonData && this.props.commonData.addressline1) {
			saveFormFlag = false;
		} else {
			saveFormFlag = leadDetail.curraddflag ? true : false;
		}
		this.setState({ form, saveForm: saveFormFlag });
	};
	GetCityStateByPincode = pincode => {
		let { form } = this.state;
		this.setState({ pincodeLoading: true });
		getCityAndStateByPincode(pincode).then(res => {
			if (res.error) {
				this.setState({ pincodeLoading: false });
				return;
			}
			if (res.data.error == false) {
				this.getCity(res.data.data.state_cd);
				this.setState({
					pincodeLoading: false,
					form: {
						...form,
						city: res.data.data[0].city_nm,
						state: res.data.data[0].state_nm
					},
					pincodeDetail: res.data.data[0]
				});
			} else {
				if (form.pincode.length == 6) {
					form = {
						...form,
						city: "",
						state: "",
						errors: { ...form.errors, pincode: "Please enter valid pincode" }
					};
				} else {
					form = {
						...form,
						city: "",
						state: "",
						errors: { ...form.errors }
					};
				}

				this.setState({
					pincodeLoading: false,
					form: form
				});
			}
		});
	};
	render() {
		let {
			currentAddressOpen,
			form,
			cityList,
			saveForm,
			currentDetailLoading,
			pincodeLoading
		} = this.state;
		let { selectedEntity, leadDetail } = this.props;
		let { stateList } = this.props;
		let { addressline1, addressline2, pincode, city, state, errors } = form;
		let CheckForm = Object.keys(form).filter(res => {
			if (res != "errors" && res != "addressline2" && !form[res]) return res;
		});

		let CurrentAddressFormStatus = false;
		if (
			!errors.addressline1 &&
			!errors.pincode &&
			!errors.city &&
			!errors.state &&
			CheckForm.length == 0
		) {
			CurrentAddressFormStatus = true;
		}
		return (
			<React.Fragment>
				<div class="row align-items-center mb-4">
					<div className="addressdetaillblock">
						<div class="pr-3" onClick={this.currentAddressOpen}>
							<label class="mb-0 fw-700 text-primary2 colorGreen">
								{currentAddressOpen ? "-" : "+"} Current Address
            </label>
						</div>
						<div class="flex-grow-1">
							<hr class="bg_lightblue" />
						</div>
					</div>
				</div>
				{currentAddressOpen && (
					<div class="row">
						<div class="col-sm-12">
							<div className="ml-4">
								<div class="row">
									<div class="col-md-4 col-lg-2 d-flex">
										<label class="fs-14 mb-0 gTextPrimary fw-500">Address</label>
									</div>
									<div class="col-md-8 col-lg-4 mt-2 mt-lg-0">
										{!saveForm ? (
											<TextArea
												title="Address Line 1"
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2 mb-3"
												placeholder="Apartment no./ wing/ Building name"
												name="addressline1"
												value={addressline1}
												onChangeFunc={this.onInputChange}
												error={errors.addressline1}
												validationFunc={this.onInputValidate}
												isReq={true}
												reqType="address"
												maxLength="100"
												disabled={this.props.commonData.addressline1}
											/>
										) : (
												<>{addressline1}, </>
											)}
										{!saveForm ? (
											<TextArea
												disabled={this.props.commonData.addressline1}
												title="Address Line 2"
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												placeholder="Address line 2"
												name="addressline2"
												value={addressline2}
												onChangeFunc={this.onInputChange}
												// error={errors.addressline2}
												validationFunc={this.onInputValidate}
												// isReq={true}
												reqType="address"
												maxLength="100"
											/>
										) : (
												addressline2
											)}
									</div>
								</div>
								<div class="row mt-3 align-items-center">
									<div class="col-md-4 col-lg-2 d-flex align-items-center">
										<label class="fs-14 mb-0 gTextPrimary fw-500">Pincode</label>
									</div>
									<div class="col-10 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
										{!saveForm ? (
											<Input
												title="Pincode"
												className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
												placeholder="Type pincode"
												name="pincode"
												value={pincode}
												onChangeFunc={(name, value, errors) => {
													this.onInputChange(name, value, errors);
												}}
												error={errors.pincode}
												validationFunc={(name, error) => {
													this.onInputValidate(name, error);
													this.GetCityStateByPincode(pincode);
												}}
												loading={pincodeLoading}
												maxLength="6"
												minLength="6"
												reqType="number"
												isReq={true}
												disabled={this.props.commonData.pincode}
											/>
										) : (
												pincode
											)}
									</div>
								</div>
								<div class="row mt-3">
									<div class="col-md-4 col-lg-2 d-flex align-items-center">
										<label class="fs-14 mb-0 gTextPrimary fw-500">City</label>
									</div>
									<div class="col-md-8 col-lg-3 mt-2 mt-lg-0">
										<div class="select">
											{!saveForm ? (
												<Input
													title="City"
													className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
													placeholder="City"
													name="city"
													value={city}
													onChangeFunc={(name, value, errors) => {
														this.onInputChange(name, value, errors);
													}}
													validationFunc={(name, error) => {
														this.onInputValidate(name, error);
													}}
													isReq={true}
													disabled={true}
												/>
											) : (
													city
												)}
										</div>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">State</label>
									</div>
									<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
										<div class="select">
											{!saveForm ? (
												<Input
													title="State"
													className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
													placeholder="State"
													name="state"
													value={state}
													onChangeFunc={(name, value, errors) => {
														this.onInputChange(name, value, errors);
													}}
													validationFunc={(name, error) => {
														this.onInputValidate(name, error);
													}}
													isReq={true}
													disabled={true}
												/>
											) : (
													state
												)}
										</div>
									</div>
								</div>
							</div>
							<div class="row justify-content-end mt-3 pr-0 mt-lg-0">
								<div className="col-sm-12 text-right">
									{!saveForm && leadDetail.curraddflag && (
										<button
											disabled=""
											class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
											onClick={this.props.GetLeadDetail}
										>
											Cancel
                </button>
									)}

								
										<button
											disabled={!CurrentAddressFormStatus || currentDetailLoading}
											class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${
												CurrentAddressFormStatus &&
												"btn-green"}`}
											onClick={e => {
												this.SaveForm(e);
											}}
										>
											{saveForm
												? "Edit"
												: `${currentDetailLoading ? "Saving" : "Save"}`}
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
export default withRouter(CurrentAddressNonIndividual);
