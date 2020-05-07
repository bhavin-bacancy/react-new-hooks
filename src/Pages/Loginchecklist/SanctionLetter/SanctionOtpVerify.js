import React, { useState, useEffect } from "react";
import { public_url } from "../../../Utility/Constant";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";
import { cloneDeep } from "lodash";
import { getSanctionDetail, postOtpDetails, postCreateOtp } from "../../../Utility/Services/Sanction";
import OtpInput from "react-otp-input";
import { ts, te } from "../../../Utility/ReduxToaster";

export const SanctionOtpVerify = (props) => {

	const [state, setState] = useState({
		VerifyOtpLoading: false,
		otp: "",
	});

	const [data, setData] = useState({
		sanctionDetail: {},
	})

	let { VerifyOtpLoading, otp } = state;
	let { sanctionDetail } = data;
	let { location } = props;

	useEffect(() => {
		getSanctionDetails();
	}, [!sanctionDetail]);

	const getSanctionDetails = () => {
		let { match } = props;
		getSanctionDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			setData({ sanctionDetail: res.data });
		});
	}

	const VerifyOtp = () => {
		let { otp } = state;
		if (!otp) {
			te("Please enter otp");
			return;
		}
		setState({ VerifyOtpLoading: true });
		postOtpDetails({
			url: null,
			otp: otp,
			leadCode: sanctionDetail.data.leadCode,
			mobileNumber: sanctionDetail.data.mobileNo,
			consentType: null,
			consentConfirmed: null,
			name: sanctionDetail.data.customerName,
			messageId: null,
			productName: null,
			loanRefNumber: sanctionDetail.data.loannumber,
			applicationNumber: null,
			loanAmount: null
		}).then(res => {
			if (res.error) {
				setState({ VerifyOtpLoading: false });
				return;
			}
			if (res.data.error == "false") {
				ts("Consent has been Approved Successfully")
				setState({ VerifyOtpLoading: false });
				// props.history.push(`${public_url.co_applicant_status}/${props.match.params.leadcode}`);
				props.history.push(`${public_url.disbrusal_upload}/${props.match.params.leadcode}/${sanctionDetail.data.mobileNo}`);
			} else if (res.data.error == "true") {
				te(res.data.message);

				setState({ VerifyOtpLoading: false, otp: "" });
			}
		});
	};

	const HandleOtp = (name, otp1) => {
		state[name] = otp1
		setState({ ...state });
	};

	const onResendOTP = () => {
		let { sanctionDetail } = data;
		if (sanctionDetail && sanctionDetail.data) {
			let obj = {
				createdDate: null,
				updatedDate: null,
				createdBy: null,
				updatedBy: null,
				ipaddress: null,
				leadCode: sanctionDetail.data.leadCode,
				customerName: sanctionDetail.data.customerName,
				mobileNo: sanctionDetail.data.mobileNo,
				salesManagerCode: null,
				emailId: sanctionDetail.data.emailId,
				productId: null,
				consentType: null,
				consentConfirmed: null,
				otp: null,
				status: sanctionDetail.data.status,
				prospectstatus: null,
				messageId: null,
				loannumber: sanctionDetail.data.loannumber,
				id: null
			}
			postCreateOtp(obj).then(res => {
				if (res.error) {
					return;
				}
				if (res.data.error == "false") {
					ts("SMS have been sent Successfully");
				} else if (res.data.error == "true") {
					te(res.data.message);
				}
			});
		}
	}

	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs {...props} sanctionDetail={sanctionDetail} />
			<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div class="d-flex justify-content-start align-items-center">
						<section class="py-4 position-relative bg_l-secondary w-100 ">
							<div class="pb-5 bg-white">
								<div className="row">
									<div className="col-lg-6 mt-3 ">
										<span className="font-weight-bold text-primary ml-3 mt-3">
											{" "}
											{sanctionDetail && sanctionDetail.applicant && sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}{" "}
										</span>
										<span className="text-primary ml-3 mt-3">
											{" "}
											( {sanctionDetail && sanctionDetail.applicant && sanctionDetail.applicant.typeOfEntity} )
										</span>
									</div>
								</div>
								<div className="mt-3 mb-3">
									<span className="text-primary ml-3 mt-3">
										Sanction Letter
									</span>
								</div>
								<div className="mb-3">
									<span className="text-primary ml-3 mt-3">
										Declaration from Customer
									</span>
								</div>

								<div className="mb-5 mt-5">
									<div className="d-flex justify-content-center ">
										<p className="mb-0 text-primary lh-25">
											Enter OTP received on <span className="text-green">{sanctionDetail && sanctionDetail.applicant && sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}</span>'s Phone
                    </p>
									</div>
								</div>

								<div class="row justify-content-center w-100 p-0 m-0">
									<div class="">
										<OtpInput
											onChange={(otp) => {
												HandleOtp("otp", otp)
											}}
											numInputs={6}
											separator={<span>-</span>}
											value={otp}
										/>
									</div>
								</div>

								<div className="row mt-5">
									<div className="col-sm-12">
										<div className="text-right">
											<Link to={`${public_url.sanction_consent}/${props.match.params.leadcode}`}>
												<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
													Cancel
											</button>
											</Link>
											<button onClick={onResendOTP} className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-3 btn-green`}>
												{" "}
												Resend OTP
                      </button>
											<button disabled={!otp} onClick={VerifyOtp} className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-5 ${otp && "btn-green"}`}>
												{" "}
												{VerifyOtpLoading ? "Loading..." : "Submit"}{" "}
											</button>
										</div>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
