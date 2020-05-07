import React from "react";
import { Input } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import { getApplicantbyLoan, getWrappedGstPanDetails, smsVerifications } from "../../../Utility/Services/Documents"
import moment from "moment";
import { withRouter } from "react-router-dom";
import { te, ts } from "../../../Utility/ReduxToaster";
import { getFormDetails } from "../../../Utility/Helper";
import { public_url } from "../../../Utility/Constant";

const loginForm = {

	username: "",
	password: "",
	gstNumber: "",
	errors: {
		username: null,
		password: null,
		gstNumber: null
	}
};

class SmsVerificationDesign extends React.Component {
	constructor() {
		super();
		this.state = {
			form: cloneDeep(loginForm),
			gstIn: "",
			refnumber: "",
			loading: false,
			gstCount: [],
			dataInSendSms: "",
			// loanNumber: 'GS100LAP010816', 
		};
	}

	getApplicantbyLoan = () => {
		//dont remove comments
		let { match } = this.props;
		let { params } = match;
		let { loanNumber, panNumber, dateOfBirth, mobileNumber, gstIn, form } = this.state
		getApplicantbyLoan(params.refrencenumber).then(res => {
			const sendsms = cloneDeep(res.data.data)
			delete sendsms.coApplicantList
			let data = {
				pan: params.pan,
				gstNumber: form.gstIn,
				activeGSTCount: '1',
				leadId: res.data.data.leadCode,
				mobileNumber: params.comobileno
			}
			let obj = {
				panNumber: res.data.data.panNumber,
				dateOfBirth: moment(res.data.data.dateOfBirth).format('YYYY-MM-DD'),
				mobileNumber: res.data.data.mobileNumber,
			}
			this.setState({
				loanData: res.data.data,
				mainapplicantData: obj,
				// gstIn: res.data.data.gstNumber,
				refnumber: res.data.data.loannumber,
				dataInSendSms: data
			})
			getWrappedGstPanDetails(obj).then(res => {
				const displayData = res.data.data
				// const gstIn = res.data.data.documentUploadGstDetailsDTO.map(data => data.gstin)
				// const exp = res.data.data.documentUploadGstDetailsDTO.length
				this.setState({
					loading: false,
					// gstCount: exp, 
					displayData: displayData
				});
				return;
			});
		});
	}

	componentDidMount() {
		this.getApplicantbyLoan()
	}

	handleChange(event) {
		const { name, value } = event.target;
		const { user } = this.state;
		this.setState({
			user: {
				...user,
				[name]: value
			}
		});
	}

	onInputChange = (name, value, error = undefined) => {
		console.log(error);
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


	handleSubmit = e => {
		e.preventDefault();
		const { form, loanNumber, dataInSendSms } = this.state;

		let { syncLogin, match } = this.props;
		let { params } = match;
		let obj = getFormDetails(form, this.onInputValidate);
		if (!obj) {
			te("Please enter required information");
			return false;
		}
		
		if (obj) {
			let sendMainData = { ...dataInSendSms, ...obj, mainapplicant: params.mainapplicant == "true" ? true : false }
			this.setState({ loading: true });
			smsVerifications(sendMainData).then(res => {
				if (res.data.error == "false") {
					ts("Thank you! Your GST transactions have been retrieved successfully");
					this.setState({ loading: false });
					this.props.history.push(
						`${public_url.gst_successfull}`
					);
				} else if (res.data.error == "true") {
					te("Sorry! GST transactions could not be pulled. Please try again later");
				}
				this.setState({ loading: false });
			});
		}
	};

	render() {
		let { form, loading, gstIn, refnumber, loanData } = this.state;
		let { username, password, gstNumber, errors } = form;

		return (
			<React.Fragment>
				<div className="gAccordion">
					<div className="gAccordion__body justify-content-center">
						<div className="row align-items-center mb-4">
							<div className="flex-grow-1">
								<>

									<div className=" fw-700 fs-18 colorGreen">Reference ID :   &nbsp;&nbsp;
                      {refnumber}
									</div>
									<div className=" mt-3 text-primary fw-700 fs-18">GST Verification</div>
								</>
							</div>
						</div>
						{
							<div className="ml-2 ml-md-4">
								<div className="row mt-3 align-items-center">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											GSTIN
                                        </label>
									</div>
									<div className="col-12 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
										{/* <Input
                                                title="gstIn"
                                                className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
                                                placeholder="Type gstIn"
                                                name="gstIn"
                                                value={gstIn}
                                                onChangeFunc={this.onInputChange}
                                                error={errors.gstIn}
                                                validationFunc={this.onInputValidate}
                                                isReq={true}
                                            /> */}
										<Input
											title="gstNumber"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											placeholder="Type gstNumber"
											name="gstNumber"
											value={gstNumber}
											onChangeFunc={this.onInputChange}
											error={errors.gstNumber}
											validationFunc={this.onInputValidate}
											isReq={true}
										/>
									</div>
								</div>
								<div className="row mt-3 align-items-center">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Username
                                        </label>
									</div>
									<div className="col-12 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
										<Input
											title="Username"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											placeholder="Type Username"
											name="username"
											value={username}
											onChangeFunc={this.onInputChange}
											error={errors.username}
											validationFunc={this.onInputValidate}
											isReq={true}
										/>
									</div>
								</div>
								<div className="row mt-3">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											password
                                        </label>
									</div>
									<div className="col-12 col-md-7 col-lg-3 mt-2 mt-lg-0 pr-2">
										<Input
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											placeholder="Password"
											id="inputEmail4"
											name="password"
											value={password}
											title="Password"
											isReq={true}
											type="password"
											onChangeFunc={(name, value, error) => {
												this.onInputChange(name, value, error);
												this.onInputValidate(name, error);
											}}
											error={errors.password}
											validationFunc={this.onInputValidate}
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4 col-lg-2"></div>
									<div className="col-12 col-md-5">
										<button
											type="submit"
											className="btn-green btn px-5 py-2 text-white rounded-pill fs-16 mt-3"
											disabled={loading}
											onClick={this.handleSubmit}
										>
											{loading ? "Please wait..." : "Submit"}
										</button>
									</div>
								</div>
							</div>
						}
					</div>
				</div>
			</React.Fragment>
		);
	}
}
export default withRouter(SmsVerificationDesign);
