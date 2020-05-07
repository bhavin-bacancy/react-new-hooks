import React, { useState, useEffect } from "react";
import { public_url } from "../../../Utility/Constant";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";
import { API_URL, FileUrl } from "../../../Utility/Config";
import {
	getSanctionDetail,
	getSanctionStatus
} from "../../../Utility/Services/Sanction";

export const Letter = props => {
	const [state, setState] = useState({
		sanctionDetail: {},
		apiResponse: "",
		loading: false
	});

	const [data, setData] = useState({
		sanctionStatus: {}
	});

	let { sanctionDetail, apiResponse, loading } = state;
	let { sanctionStatus } = data;

	useEffect(() => {
		getSanctionDetails();
		getSanctionStatusDetails();
	}, [!sanctionDetail]);

	const getSanctionDetails = () => {
		let { match } = props;
		state.loading = true;
		getSanctionDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			setState({ sanctionDetail: res.data, apiResponse: res.data, loading: false });
		});
	};

	const getSanctionStatusDetails = () => {
		let { match } = props;
		getSanctionStatus(match.params.leadcode).then(res => {
			if (res.error) return;
			setData({ sanctionStatus: res.data });
		});
	};
	let url = sanctionDetail && sanctionDetail.data && sanctionDetail.data.docPath;

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
								{loading  ? (
									<div className="row">
										<div className="col-lg-12 text-primary font-weight-bold fs-24 text-center mt-5 h3 ">
											<i className="fa fa-spinner fa-spin mr-2 fa-lg" />{" "}
											Loading...
                    </div>
									</div>
								) : (
										<>
											<div className="row">
												<div className="col-lg-6 mt-3 ">
													<span className="font-weight-bold text-primary ml-3 mt-3">
														{" "}
														{sanctionDetail &&
															sanctionDetail.applicant &&
															sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}{" "}
													</span>
													<span className="text-primary ml-3 mt-3">
														{" "}
														({" "}
														{sanctionDetail &&
															sanctionDetail.applicant &&
															sanctionDetail.applicant.typeOfEntity}{" "}
														)
                    </span>
												</div>
											</div>
											<div className="mt-3 mb-3">
												<span className="text-primary ml-3 mt-3">
													Sanction Letter
                  </span>
											</div>
											<div className="sanction-detail">
												<div className="d-flex mt-4 justify-content-center">
													{" "}
													{url ? <iframe
														src={
															FileUrl +
															url +
															"#toolbar=0&navpanes=0&scrollbar=0&messages=0"
														}
														width="1000"
														height="750"
														type="application/pdf"
													/> : apiResponse && apiResponse.message}


												</div>
												<div className="row mt-5">
													<div className="col-sm-12">
														<div className="text-right">
															<Link
																to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}
															>
																<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green">
																	Cancel
                          </button>
															</Link>
															{sanctionStatus &&
																sanctionStatus.data &&
																sanctionStatus.data.status != "Consent Approved" && (
																	<Link
																		to={`${public_url.sanction_consent}/${props.match.params.leadcode}`}
																	>
																		<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-1 btn-green">
																			Next
                              </button>
																	</Link>
																)}
															{sanctionStatus &&
																sanctionStatus.data &&
																sanctionStatus.data.status == "Consent Approved" && (
																	<Link
																		to={`${public_url.disbrusal_upload}/${props.match.params.leadcode}/${sanctionDetail && sanctionDetail.data && sanctionDetail.data.mobileNo}`}
																	>
																		<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-1 btn-green">
																			Next
                              </button>
																	</Link>
																)}
														</div>
													</div>
												</div>
											</div>
										</>
									)}
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
