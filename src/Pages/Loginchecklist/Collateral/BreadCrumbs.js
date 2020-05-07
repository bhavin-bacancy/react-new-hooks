import React from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";

export const BreadCrumbs = (props) => {
	let { match, mainlApplicant, status, history } = props;
	return (
		<>
			<section className="bg_l-secondary pt-4">
				<div className="container  ">
					<div class="d-flex justify-content-start align-items-center">
						<div className="breadcrums d-flex align-items-center flex-wrap">
							<ul>
								<li className="mr-1" class="active">
									<Link to={`${public_url.prospect_list}`}>
										LAP Prospects
                      </Link>
								</li>
								<li className="mr-1" class="active">
									<Link
										to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}
									>
										Profile
                      </Link>
								</li>
								<li className="mr-1" class="active">
									<Link to={`${public_url.collateral_detail}/${props.match.params.leadcode}`}>
										Collateral Details
                      </Link>
								</li>
							</ul>
							{mainlApplicant && mainlApplicant.loannumber && (
								<span className="note ml-3 mt-md-0 mt-3">
									Reference ID : {mainlApplicant.loannumber}
								</span>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
