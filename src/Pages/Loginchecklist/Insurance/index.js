import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { InsuranceDetails } from "./InsuranceDetails";
import { getInsuranceDetail } from "../../../Utility/Services/Insurance";

export const Insurance = props => {
	const [state, setState] = useState({
		insuranceDetail: {}
	});

	let { insuranceDetail } = state;

	useEffect(() => {
		getInsuranceDetails();
	}, [!insuranceDetail]);

	const getInsuranceDetails = () => {
		let { match } = props;
		getInsuranceDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			setState({ insuranceDetail: res.data });
		});
	};

	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs {...props} insuranceDetail={insuranceDetail} />
			<InsuranceDetails
				{...props}
				getInsuranceDetails={getInsuranceDetails}
				insuranceDetail={insuranceDetail}
			/>
		</>
	);
};
