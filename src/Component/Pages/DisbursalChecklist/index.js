import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { DisbursalChecklistForm } from "./DIsbursalChecklistForm";


export const DisbursalChecklist = props => {
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
			<DisbursalChecklistForm />
		</>
	);
};
