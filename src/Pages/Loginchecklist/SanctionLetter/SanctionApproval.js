import React, { useState, useEffect } from "react";
import { public_url } from "../../../Utility/Constant";
import { Link } from "react-router-dom";
import { getSanctionDetail } from "../../../Utility/Services/Sanction"


export const SanctionApproval = (props) => {

	const [state, setState] = useState({
		sanctionDetail: {}
	});

	let { sanctionDetail } = state;

	useEffect(() => {
		getSanctionDetails();
	}, [!sanctionDetail]);

	const getSanctionDetails = () => {
		let { match } = props;
		getSanctionDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			setState({ sanctionDetail: res.data });
		});
	}

	return (
		<>
			<section className="bg_d-primary py-4">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<h4 className="text-l-priamry">Welcome {sanctionDetail && sanctionDetail.data && sanctionDetail.applicant.firmName ? sanctionDetail.applicant.firmName : sanctionDetail.applicant && sanctionDetail.applicant.customerName}!</h4>
						</div>
					</div>
				</div>
			</section>
			<section className="py-4 position-relative bg_l-primary">
				<div className="container pb-5 bg-white">
					<div className="row justify-content-center align-items-start ">
						<div className="col-md-11 consent-conversion">
							<div className="row justify-content-center py-5">
								<div className="mt-4">
									<div className="text-primary text-center">
										<span className="fa fa-check text-blue fs-50 mb-3"></span>
									</div>
									<div className="text-primary fs-18">
										Consent approval sent
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="row justify-content-center ">
						<h6 className="text-green">Kindly assist the Growth Source executive to update your Profile </h6>
					</div>
				</div>
			</section>

		</>
	);
};
