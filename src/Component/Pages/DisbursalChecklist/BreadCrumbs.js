import React from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";

export const BreadCrumbs = (props) => {
	let { match } = props;
	return (
		<>
			<section className="bg_l-secondary pt-4">
				<div className="container  ">
					<div className="d-flex justify-content-start align-items-center">
						<div className="breadcrums d-flex align-items-center flex-wrap">
							<ul>
								<li className="mr-1" class="active">
									<Link to={`${public_url.prospect_list}`}>
										LAP Prospects
                      </Link>
								</li>
								<li className="mr-1" class="active">
									{/* <Link to={`${public_url.co_applicant_status}/${match.params.leadcode}`}> */}
										Profile
                  {/* </Link> */}
								</li>
								<li className="mr-1" class="active">
									Disbursal Checklist
								</li>
							</ul>
							<span className="note ml-3 mt-md-0 mt-3">
								Reference ID : xxxxxxxxxxxxx
							</span>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};
