import React from "react";
import Cheque from "./Cheque";
import DemandDraft from "./DemandDraft";
import {
	postConsumerData,
	postResPaymentGateway,
	postLinktoCustomer,
	postPullTxn,
	postPaymentLinkFlag
} from "../../Utility/Services/Payment";
import BreadCrumbsPayment from "./BreadCrumbsPayment";
import { withRouter } from "react-router-dom";
import { postLeadDetail } from "../../Utility/Services/QDE";
import { public_url } from "../../Utility/Constant";
import { cloneDeep } from "lodash";
import { te, ts } from "../../Utility/ReduxToaster";
import { getDate } from "../../Utility/Helper";
import { FrontendURL } from "../../Utility/Config";
import { Link } from "react-router-dom"

let initForm = {
	cif: "",
	mobileNumber: "",
	emailid: ""
};
class PaymentMethods extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: "pay",
			checkData: "",
			loading: false,
			fail: false,
			paymentResponseMsg: "",
			cif: null,
			lan: null,
			leadDetail: cloneDeep(initForm),
			cifData: null,
			getData: "",
			sendData: "",
			senfMobileNumber: '',
			sendDataForsms: " ",
			checkDataonSubmit: "",
			flagValuesPayment: " ",
			checkApiCallLink: false,
			checkResFlag: false
		};
	}

	componentDidMount() {
		this.GetLeadDetail();
	}

	GetLeadDetail = () => {
		let { match } = this.props;
		let { params } = match;
		postLeadDetail(params.leadcode, params.mobileno).then(res => {
			let sendDataForsms = {
				applicant: {
					customerName: res.data.data.customerName,
					leadCode: res.data.data.leadCode,
					mobileNumber: res.data.data.mobileNumber,
					cif: res.data.data.cif,
					emailid: res.data.data.emailid
				},
				sendTo: res.data.data.mobileNumber,
				type: "INITIATE"
			}
			let checkDataonSubmit = {
				applicant: {
					leadCode: res.data.data.leadCode,
					mobileNumber: res.data.data.mobileNumber,
				}
			}
			let flagValuesPayment = {
				leadCode: res.data.data.leadCode,
				mobileNumber: res.data.data.mobileNumber
			}
			if (res.error) return;
			this.setState({
				leadDetail: res.data.data,
				sendDataForsms: sendDataForsms,
				checkDataonSubmit: checkDataonSubmit,
				flagValuesPayment: flagValuesPayment
			}, () => {
				this.checkPaymentFlag()
			});
		});
	};

	handleOptionChange = changeEvent => {
		this.setState({
			selectedOption: changeEvent.target.value,
			paymentResponseMsg: ""
		});
	};

	handleCheckChange = changeEvent => {
		if (changeEvent.target.checked) {
			this.setState({ checkData: changeEvent.target.value, checkResFlag: (changeEvent.target.value && changeEvent.target.value == "pgateway") ? false : true });
			if (changeEvent.target.value === 'customer') {
				this.onSendLink()
			}
			else {
			}
		} else {
			this.setState({ checkData: "", paymentResponseMsg: "" });
		}
	};

	onSubmit = data => {
		let { leadDetail } = this.state;
		let { match } = this.props;
		let { params } = match;
		this.setState({ loading: true, paymentResponseMsg: "" });
		postConsumerData({
			cif: leadDetail.cif,
			mobileNumber: leadDetail.mobileNumber,
			emailid: leadDetail.emailid,
			leadCode: leadDetail.leadCode
		}).then(res => {
			if (res.data.error === "true") {
				te(res.data.message);
				return;
			}
			if (res.error) {
				this.setState({ loading: false });
				return;
			} else {
				var sendData = {
					cif: res.data && res.data.data.cif,
					lan: params && params.refrencenumber,
					emailId: leadDetail.emailid,
				}
				var getData = {
					amount: res.data && res.data.data.amount,
					cif: res.data && res.data.data.cif,
					deviceId: res.data && res.data.data.deviceId,
					emailId: res.data && res.data.data.emailId,
					merchantId: res.data && res.data.data.merchantId,
					mobileNumber: res.data && res.data.data.mobileNumber,
					returnUrl: res.data && res.data.data.returnUrl,
					token: res.data && res.data.data.token,
					txnId: res.data && res.data.data.txnId
				};
				this.setState({ getData: getData, senfMobileNumber: res.data.data.mobileNumber, sendData: sendData })
				var configJson = {
					tarCall: false,
					features: {
						showPGResponseMsg: true,
						enableExpressPay: false,
						enableAbortResponse: true,
						enableNewWindowFlow: true
					},
					consumerData: {
						deviceId: res.data.data.deviceId,
						token: res.data.data.token,
						// 'returnUrl': 'http://localhost:3000/payment_methods',    //merchant response page URL
						responseHandler: res => {
							let spllitData = res.stringResponse.split("|");
							let pgRes = {
								tpsl_txn_time: spllitData[8],
								tpsl_txn_id: spllitData[3],
								clnt_rqst_meta: spllitData[7],
								id: spllitData[10],
								txn_status: spllitData[0],
								hash: spllitData[15],
								token: spllitData[14],
								txn_msg: spllitData[1],
								amount: spllitData[6],
								cif: sendData.cif,
								lan: sendData.lan,
								emailId: sendData.emailId
							};

							if (
								typeof res != "undefined" &&
								typeof res.paymentMethod != "undefined" &&
								typeof res.paymentMethod.paymentTransaction != "undefined" &&
								typeof res.paymentMethod.paymentTransaction.statusCode !=
								"undefined" &&
								res.paymentMethod.paymentTransaction.statusCode == "0300"
							) {
								postResPaymentGateway(pgRes).then(res => {
									if (res.error) {
										return;
									}
									this.props.history.push(`${public_url.payment_completed}/${match.params.leadcode}/${match.params.refrencenumber}`);
								});
								// success block
							} else if (
								typeof res != "undefined" &&
								typeof res.paymentMethod != "undefined" &&
								typeof res.paymentMethod.paymentTransaction != "undefined" &&
								typeof res.paymentMethod.paymentTransaction.statusCode !=
								"undefined" &&
								res.paymentMethod.paymentTransaction.statusCode == "0398"
							) {
								// initiated block
								alert("initiated block");
							} else {
								this.setState({
									paymentResponseMsg:
										"Your transaction cancel please try again later..!"
								});
								// error block
								postResPaymentGateway(pgRes).then(res => {
									if (res.error) {
										return;
									}
								});
							}
						},
						paymentMode: "all",
						merchantLogoUrl:
							"https://www.paynimo.com/CompanyDocs/company-logo-md.png",
						merchantId: res.data.data.merchantId,
						currency: "INR",
						consumerId: res.data.data.cif,
						consumerMobileNo: res.data.data.mobileNumber,
						consumerEmailId: res.data.data.emailId,
						txnId: res.data.data.txnId,
						items: [
							{
								itemId: "FIRST",
								// 'itemId': 'test',
								amount: res.data.data.amount,
								comAmt: "0"
							}
						],
						customStyle: {
							PRIMARY_COLOR_CODE: "#3977b7",
							SECONDARY_COLOR_CODE: "#FFFFFF",
							BUTTON_COLOR_CODE_1: "#1969bb",
							BUTTON_COLOR_CODE_2: "#FFFFFF"
						}
					}
				};
				if (window.$) {
					window.$.pnCheckout(configJson);
					if (configJson.features.enableNewWindowFlow) {
						// window.$.pnCheckoutShared.openNewWindow();
					}
				}
			}
		});
	};

	checkPaymentFlag = () => {
		let { flagValuesPayment } = this.state
		let { match } = this.props;
		let { params } = match;
		postPaymentLinkFlag(flagValuesPayment).then(res => {
			let checkResFlag = res.data.paymentLinkFlag
			this.setState({ checkResFlag: checkResFlag })
		});
	};

	onSendLink = () => {
		let { sendDataForsms } = this.state
		let { match } = this.props;
		let { params } = match;
		postLinktoCustomer(sendDataForsms).then(res => {
			if (res.data && res.data.error === true) {
				te(res.data.message)
				this.setState({ checkApiCallLink: false, loading: true })
			} else {
				ts(res.data.message)
				this.setState({ checkApiCallLink: true, loading: false })
			}
		});
	};

	onSubCheckStatus = () => {
		let { checkDataonSubmit } = this.state
		let { match } = this.props;
		let { params } = match;
		postPullTxn(checkDataonSubmit).then(res => {
			if (res.data.paymentStatus === "Pending") {
				this.props.history.push(
					`${public_url.sms_payment_failed}/${params.leadcode}/${params.refrencenumber}`
				);
			} else if (res.data.paymentStatus === "Failed") {
				this.props.history.push(
					`${public_url.sms_payment_failed}/${params.leadcode}/${params.refrencenumber}`
				);
			}
			else if (res.data.paymentStatus === "Payment link already expired") {
				this.props.history.push(
					`${public_url.sms_payment_failed}/${params.leadcode}/${params.refrencenumber}`
				);
			}
			else if (res.data.paymentStatus === "Payment done") {
				this.props.history.push(
					`${public_url.sms_payment_completed}/${params.leadcode}/${params.refrencenumber}`
				);
			}
		});
	};

	render() {
		let { checkResFlag, fail, cif } = this.state;
		return (
			<React.Fragment>
				<div className="backToDashboard py-3">
					<div className="container-fluid">
						<Link to={public_url.lead_list}>Home</Link>
					</div>
				</div>
				<BreadCrumbsPayment />
				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div className="bg-white p-md-4 p-3 text-center mt-5">
							<div className="text-primary fw-400 fs-18 font-weight-bold mr text-left mb-4">
							IMD Payment
              </div>
							<div class="c_radiobtn styleGreen d-flex pl-md-5 mb-3 flex-wrap">
								<div className="mr-sm-5 mr-5">
									<input
										type="radio"
										id="pay"
										name="radio-group"
										value="pay"
										checked={this.state.selectedOption === "pay"}
										onChange={this.handleOptionChange}
									/>
									<label htmlFor="pay">Online Payment</label>
								</div>
								<div className="mr-sm-5 mr-5">
									<input
										type="radio"
										id="cheque"
										name="radio-group"
										value="cheque"
										checked={this.state.selectedOption === "cheque"}
										onChange={this.handleOptionChange}
									/>
									<label htmlFor="cheque">Cheque</label>
								</div>
								<div className="mr-sm-5 mr-5">
									<input
										type="radio"
										id="DD"
										name="radio-group"
										value="DD"
										checked={this.state.selectedOption === "DD"}
										onChange={this.handleOptionChange}
									/>
									<label htmlFor="DD">Demand Draft</label>
								</div>
								{this.state.paymentResponseMsg && (
									<div className="text-danger">
										{this.state.paymentResponseMsg}
									</div>
								)}
							</div>
							{this.state.selectedOption === "pay" ? (
								<>
									<div className="d-flex flex-wrap ml-lg-4 border p-3 p-lg-5 justify-content-md-around mb-3">
										<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
											<input
												type="checkbox"
												name="customer"
												value="customer"
												onChange={this.handleCheckChange}
												checked={this.state.checkData === "customer" || checkResFlag}
											/>
											<span className="geekmark"></span>
											<span className="checkboxText">
												Send Link to customer for payment
                      </span>
										</label>
										<label className="main styleGreen text-primary pl-4 my-lg-4 my-3">
											<input
												type="checkbox"
												name="pgateway"
												value="pgateway"
												onChange={this.handleCheckChange}
												checked={this.state.checkData === "pgateway"}
											/>
											<span className="geekmark"></span>
											<span className="checkboxText">
												Proceed to payment gateway
                      </span>
										</label>
									</div>
									<div className="text-primary  ml-lg-4 text-left mb-3">
										Note : These fees are applicable to process the profile and
                    therefore non-refundable irrespective of therefore Loan
                    approval or rejection when you proceed.
                  </div>
									<div className="text-sm-right">
										{/* {checkResFlag && <button
											className="btn styleGreen btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2"
											onClick={this.onSendLink}
										>
											Resend
                        </button>} */}

										{(this.state.checkData === 'customer' || this.state.checkData === '') ?
											<>
												{this.state.checkApiCallLink === true || checkResFlag ?
													<button
														className="btn styleGreen btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2"
														onClick={this.onSendLink}
													>
														Resend
                        </button>
													:
													''
												}
												<button
													className="btn styleGreen btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2"
													onClick={this.onSubCheckStatus}
												>
													Submit
                      </button>
											</>
											:
											<button
												className="btn styleGreen btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2"
												onClick={
													(this.state.checkData === "pgateway"
														? this.onSubmit
														: this.onSubCheckStatus)
												}
											>
												Submit
                    </button>
										}
									</div>
								</>
							) : this.state.selectedOption === "cheque" ? (
								<>
									<Cheque selectedOption={this.state.selectedOption} getData={this.state.getData && this.state.getData} />
								</>
							) : (
										<DemandDraft selectedOption={this.state.selectedOption} />
									)}
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default withRouter(PaymentMethods);
