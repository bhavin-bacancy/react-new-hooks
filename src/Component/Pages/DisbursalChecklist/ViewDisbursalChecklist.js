import React, { useState, useEffect } from "react";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";

export const ViewDisbursalChecklist = (props) => {
	const [state, setState] = useState({

	});
	let { match } = props;

	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs />
			<section className="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary disbursal-form">
				<div className="container">
					<div className="d-flex justify-content-start align-items-center">
						<section className="py-4 position-relative bg_l-secondary w-100 ">
							<div className="pb-5 px-4 pr-4 pt-4 bg-white">
								<div className="row">
									<div className="col-lg-6 mt-3">
										<span className="font-weight-bold text-green text-primary  mt-3">
											{" "}
											Applicant Name{" "}
										</span>
										<span className="text-primary text-green ml-3 mt-3">
											{" "}
											( Type of Entity )
										</span>
									</div>
								</div>
								<div className="d-flex justify-content-between py-3">
									<p className="text-primary fw-700 ">Case Disbursal Credentials</p>
									<p className="text-primary fw-700 ">
										Sent For Approval: 21st Jan 2020
                  </p>
								</div>

								<div className="pl-4 pr-4 case">
									<div className="row">
										<div className="col-lg-9 col-md-6 mt-2 pl-4">
											<li className="text-l-priamry mt-2 mb-2 mybullet">
												{" "}
												Completely filled app form duly signed by all borrowers, colour passport photo with cross sign
											</li>
											<p className="text-l-priamry fw-700 mb-0 mt-3 ml-4">
												Remarks
                      </p>
											<p className="text-l-priamry ml-3"></p>
										</div>
										<div className="col-md-6 col-lg-3">
											<div className="mt-4 text-right">
												<p className="text-primary fw-500 mb-1">
													Application Form
                        </p>
											</div>
										</div>
										<div className="col-12">
											<hr className="bg_d-primary border-0 h-1px" />
										</div>
									</div>

									<div className="row">
										<div className="col-lg-9 col-md-6 pl-4">
											<li className="text-l-priamry mt-2 mb-2 mybullet">
												{" "}
												KYC documents will be collect as per guidline (KYC Policy)
											</li>
											<p className="text-l-priamry fw-700 mb-0 mt-3 ml-4">
												Remarks
                      </p>
											<p className="text-l-priamry ml-3"></p>
										</div>
										<div className="col-md-6 col-lg-3">
											<div className="mt-2 text-right">
												<p className="text-primary fw-500 mb-1 mt-2">
													KYC Documents
                        </p>
											</div>
										</div>
										<div className="col-12">
											<hr className="bg_d-primary border-0 h-1px " />
										</div>
									</div>
								</div>

								<div className="row justify-content-end mt-4 pr-4 mb-2">
									<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
										Edit
                    </button>
									<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
										Next
                  </button>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
