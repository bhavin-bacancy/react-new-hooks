import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import { postLeadDetail } from "../../Utility/Services/QDE";
import { public_url } from "../../Utility/Constant";
import { postCoApplicantDetailDetail } from "../../Utility/Services/CoApplicant";
import { te } from "../../Utility/ReduxToaster";
import { find } from "lodash";
import { Link } from "react-router-dom";
export default class RefrenceNumber extends React.Component {
	constructor() {
		super();
		this.state = { leadDetail: "" };
	}
	componentDidMount() {
		let { history } = this.props;
		if (
			history.location.pathname.startsWith(
				public_url.co_applicant_reference_page
			)
		) {
			this.GetCoapplicantDetail();
		} else {
			this.GetLeadDetail();
		}
	}
	CreateLoan = () => {
		// postCreateLoa({
		//   leadCode: match.params.leadcode,
		//   mobileNumber: mainApplicantData.mobileNumber
		// })
	};
	GetCoapplicantDetail = () => {
		let { match } = this.props;
		postCoApplicantDetailDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			if (res.data.error) {
				te(res.data.message);
			} else {
				let coApplicantData = "";
				if (res.data.data.coApplicantList) {
					coApplicantData = find(res.data.data.coApplicantList, {
						custcode: match.params.custcode
					});
				}
				this.setState({
					leadDetail: coApplicantData,
					mainApplicantData: res.data.data
				});
			}
		});
	};
	GetLeadDetail = () => {
		let { match } = this.props;
		let { params } = match;
		postLeadDetail(params.leadcode, params.mobileno).then(res => {
			if (res.error) return;
			this.setState({ leadDetail: res.data.data });
		});
	};
	GoToPayment = () => {
		let { match, history } = this.props;
		if (
			history.location.pathname.startsWith(
				public_url.co_applicant_reference_page
			)
		) {
			this.props.history.push(
				`${public_url.payment_methods}/${match.params.leadcode}/${match.params.comobileno}/${match.params.refrencenumber}`
			);
		} else {
			this.props.history.push(
				`${public_url.payment_methods}/${match.params.leadcode}/${match.params.mobileno}/${match.params.refrencenumber}`
			);
		}
	};
	render() {
		let { match } = this.props;
		let { leadDetail } = this.state;

		return (
			<React.Fragment>
				{" "}
				{/* Congratulations Box */}
				<div className="backToDashboard py-3">
					<div className="container-fluid">
						<Link to={public_url.lead_list}>Home</Link>
					</div>
				</div>
				<BreadCrumbs />
				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div className="bg-white p-md-4 p-3 text-center mt-5">
							<h2 className="colorGreen fs-18 mb-md-5 mb-4 my-3">
								Congratulations!!
              </h2>
							<h2 className="mr-auto text-primary fs-20 mb-md-5 mb-4 fs-900">
								{leadDetail && leadDetail.customerName}
							</h2>
							{!match.params.status && (
								<p className="mr-auto text-primary fs-18 mb-md-5 mb-4">
									Your Reference ID has been <br /> {}created
                </p>
							)}

							<h2 className="colorGreen fs-20 mb-md-5 mb-4 my-3">
								Reference ID: {match.params.refrencenumber}
							</h2>
							{match.params.status
								? "Sorry Your application not to proceed."
								: "Good to proceed."}
							<div className="text-sm-right">
								{/* <Link to={public_url.lead_list}>
                  <button className="btn btn-secondary mr-3 text-primary btn-rounded fs-16 py-2 mb-md-0 mb-2">
                    Previous
                  </button>
                </Link> */}
								{!match.params.status && (
									<button
										className="btn btn-green btn-rounded fs-16 mb-md-0 mb-2"
										onClick={this.GoToPayment}
									>
										Next
                  </button>
								)}
							</div>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
