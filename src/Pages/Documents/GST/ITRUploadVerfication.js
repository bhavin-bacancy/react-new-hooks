import React from "react";
import { Select, Input } from "../../../Component/Input";
import { cloneDeep } from "lodash";
import { getApplicantbyLoan, awsAPI, saveITRReport } from "../../../Utility/Services/Documents"
import moment from "moment";
import { withRouter } from "react-router-dom";
import { AWSAPIs } from '../../../Utility/Config';
import { any } from "prop-types";
import { te, ts } from "../../../Utility/ReduxToaster";
import { getFormDetails } from "../../../Utility/Helper";
import { public_url } from "../../../Utility/Constant";
import { postLogin } from "../../../Utility/Services/Login";
import { postAddCoProfessionalDetail } from "../../../Utility/Services/CoApplicant";

const loginForm = {

	username: "",
	password: "",
	errors: {
		username: null,
		password: null,
	}
};

class ITRUploadverfication extends React.Component {
	constructor() {
		super();
		this.state = {
			form: cloneDeep(loginForm),
			gstIn: "",
			refnumber: "",
			loading: false,
			gstCount: [],
			dataInSendSms: "",
			data: {},
			getResponse: ''
		};
	}

	getApplicantbyLoan = () => {
		//dont remove comments
		let { match } = this.props;
		let { params } = match;
		let { itrF } = this.state
		getApplicantbyLoan(params.refrencenumber).then(res => {
			let data = {
				mobileNumber: params.comobileno,
				leadId: res.data.data.leadCode,
			}
			let itrFlag = {
				itrFlag: res.data.data.itrFlag
			}
			this.setState({ data: data, itrF: itrFlag.itrFlag })
			if (itrF === true) {
				this.setState({ itrF: true });
			}
			else {
				this.setState({ itrF: false });
			}
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

	handleAuthSubmit = () => {
		const { form, data, getResponse, mobileNumber } = this.state;
		const { match } = this.props;
		const { params } = match;
		let obj = cloneDeep(form);
		delete obj.errors;
		this.setState({ loading: true });
		awsAPI(obj).then(res => {
			let getresponse = res.itrData
			this.setState({ getResponse: getresponse })
			if (res.error === true) {
				te("Sorry, could not save your ITR Report");
				this.setState({ loading: false });
				return;
			} else if (res.error === false) {

				if (Object.keys(res.data.itrData).length > 0) {
					let mainData = { ...data, itrDetails: { ...res.data.itrData }, mainapplicant: params.mainapplicant == "true" ? true : false }
					saveITRReport(mainData).then(res => {
						if (res.error == false) {
							ts('Thank you. ITR info has been pulled successfully');
							this.setState({ loading: false });
							this.props.history.push(
								`${public_url.itr_successfull}`
							);
						}
						else {
							te('Sorry, could not save your ITR Report');
							this.setState({ loading: false });
						}
					})
				} else {
					te("Sorry currently itr data not found, Please try again or later")
					this.setState({ loading: false });
				}

			}
			// let mainData = {...form, ...getResponse}
			// saveITRReport(mainData).then(res=>{
			//     if(res.status === 'success'){
			//        ts('Thank you. ITR info has been pulled successfully.');
			//      } 
			//     else {
			//         te('Sorry, could not save your ITR Report');
			//     }
			// }).catch(error => {
			//     this.setState({errors: {error}})
			// })
		})
	}

	render() {
		let { form, loading, gstIn, refnumber } = this.state;
		let { username, password, gstNumber, errors } = form;
		return (
			<React.Fragment>
				<div className="gAccordion gAccordion--custom" >
					<div className="gAccordion__body justify-content-center">
						<div className="row align-items-center mb-4">

						</div>
						{
							<div className="ml-2 ml-md-4">
								<div className="row mt-3 align-items-center">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Username
                                        </label>
									</div>
									<div className="col-12 col-md-8 col-lg-3 mt-2 mt-lg-0 pr-2">
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
									<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
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
											onClick={this.handleAuthSubmit}
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
export default withRouter(ITRUploadverfication);
