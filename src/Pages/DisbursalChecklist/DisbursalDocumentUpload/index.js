import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { UploadForm } from "./UploadForm";
import Slider from "react-slick";

const settings = {
	focusOnSelect: true,
	infinite: false,
	slidesToShow: 4,
	slidesToScroll: 1,
	speed: 500
};

export const DisbursalDocumentUpload = props => {
	const [state, setState] = useState({
	});

	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs />
			<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div class="d-flex justify-content-start align-items-center">
						<section class="py-4 position-relative bg_l-secondary w-100 ">
							<div class="pb-5 bg-white">
								<div className="row">
									<div className="col-lg-6 mt-3 ">
										<span className="font-weight-bold text-primary ml-3 mt-3">
											{" "}
											Applicant Name
										</span>
										<span className=" text-primary ml-3 mt-3">
											{" "}
											(Type of entity)
                      </span>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-12 mt-3 ml-3 ">
										<div className="ml-4">
											<Slider {...settings} className="">
												<div className="pl-2 pr-2 w-auto">
													<button className={`btn btn-secondary d-flex justify-content-center text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 btn-green `}>
														Customer Name
													</button>
												</div>
											</Slider>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-6 mt-3 ml-5 ">
										<span className="text-secondary font-weight-bold">
											Documents Upload
                      </span>
									</div>
								</div>
								<div className="collateral-detail-page">
									<UploadForm />
								</div>
								<div className="row mt-3 mr-3">
									<div className="col-sm-12">
										<div className="text-right">
											<button
												className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 mt-2 btn-green">
												Next
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
