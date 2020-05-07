import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { getDisbursalCheckList } from "../../Utility/Services/DisbursalChecklist";
import { DisbursalChecklistForm } from "./DIsbursalChecklistForm";

export const DisbursalChecklist = props => {
	const [state, setState] = useState({
		checklistDetails: {},
		documents: "",
		loading: false,
		applicantDetail:""
	});
	let { match } = props;
	let { checklistDetails, docs, loading, documents,applicantDetail } = state;

	useEffect(() => {
		GetDisbursalchecklistDetails();
	}, [!checklistDetails]);


	const GetDisbursalchecklistDetails = () => {
		let { match } = props;
		let leadCode = match.params.leadcode;
		let mobileNumber = match.params.mobileno;
		setState({ ...state, loading: true })
		getDisbursalCheckList(leadCode, mobileNumber).then(response => {
			if (response.error === false) {
				setState({
					checklistDetails: response.data ? response.data.applicant : [],
					documents: response.data.docs ? response.data.docs.docMap : [],
					applicantDetail:response.data,
					loading: false
				});
			}
		});
	};

	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs {...props} checklistDetails={checklistDetails} />
			<DisbursalChecklistForm applicantDetail={applicantDetail} {...props} loading={loading} checklistDetails={checklistDetails} documents={documents} />
		</>
	);
};
