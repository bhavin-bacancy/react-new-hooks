import React from "react";
import BreadCrumbDocuments from "./BreadCrumbDocuments";
import GSTverification from "./GST/GSTverification";
import ITRupload from "./ITRUpload";
import BankDetails from "./BankDetails";
import { getprequaleligibility } from "../../Utility/Services/GetPrequalEligibility";
import { getApplicantbyLoan } from "../../Utility/Services/Documents";
import CoApplicant from "./GST/CoApplicant";
import { withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";
import { te, ts } from "../../Utility/ReduxToaster";
import FinancialStatement from "./FinancialStatement";
class Documents extends React.Component {
	constructor() {
		super();
		this.state = {
			selectedEntity: "",
			// loanNumber: 'GS100LAP010758',
			loanNumber: "GS100LAP010816",
			loanData: "",
			dataofCoApp: [],
			appData: [],
			data: {
				panNumber: null,
				dateOfBirth: null,
				mobileNumber: null
			},
			selectedApplicant: "",
			applicantsDetail: "",
			applicantType: "",
			loading: false,
			isItrFilled: false,
			isBankDetailsFilled: false
		};
	}

	getApplicantbyLoan = () => {
		let { match } = this.props;
		let { params } = match;
		getApplicantbyLoan(params.refrencenumber).then(res => {
			let dataofCoApp = res && res.data.data.coApplicantList;
			let appData = res && res.data.data;
			if (res.error) return;
			this.setState({
				loanData: res.data.data,
				dataofCoApp: dataofCoApp,
				appData: appData,
				data: res.data.data,
				selectedApplicant: res.data.data && res.data.data.id,
				applicantsDetail: res.data.data,
				applicantType: "applicant"
			});
		});
	};
	componentDidMount() {
		this.getApplicantbyLoan();
	}
	onApplicant = appData => {
		this.setState({ appData: appData, applicantType: "applicant" });
	};
	onCoApplicantClick = res => {
		this.setState({
			data: res,
			selectedApplicant: res.id,
			applicantType: "co-applicant"
		});
	};

	onNextClick = () => {
		let { match } = this.props;
		let { params } = match;
		let postData = { leadCode: params.leadcode };
		this.setState({ loading: true });
		getprequaleligibility(params.leadcode).then(res => {
      /*  if (res.status == 404) {
        res = {
          data: {
            loanapplicantname: "VIVEK BABAN PATIL",
            loanstatus: "GO",
            loanreferencenumber: "GS001LAP040245",
            deviationlist: [
              "DEVIATION_LOANAMOUNT",
              "DEVIATION_TENURE",
              "COMPANY_VINTAGE_DEVIATION",
              "BANKING_SCORE"
            ]
          },
          message: "Application is Good to Proceed !!!",
          error: false,
          statusCode: "200",
          status: "success"
        };
      } */
			if (res.error) {
				this.setState({ loading: false });
				return;
			} else {
				this.setState({ loading: false });
				ts(res.data.message);
				this.props.history.push({
					pathname: `${public_url.prequal_eligibility}/${params.refrencenumber}/${params.leadcode}/${res.data.loanstatus}`,
					data: res.data
				});
			}
		});
	};

	handleItrFieldValidation = value => {
		this.setState({ isItrFilled: value });
	};

	handleBankDetailsFieldValidation = value => {
		this.setState({ isItrFilled: value });
	};

	render() {
		let {
			loanData,
			dataofCoApp,
			changedata,
			data,
			appData,
			selectedApplicant,
			applicantsDetail,
			loading,
			isItrFilled,
			isBankDetailsFilled
		} = this.state;
		let userData = "";

		let { match } = this.props;
		if (selectedApplicant) {
			if (applicantsDetail.mobileNumber == selectedApplicant) {
				userData = data;
			} else {
				applicantsDetail.coApplicantList &&
					applicantsDetail.coApplicantList.map(res => {
						if (res.mobileNumber == selectedApplicant) {
							userData = res;
						}
					});
			}
		} else {
			userData = data;
		}
		return (
			<React.Fragment>
				{" "}
				<div className="backToDashboard py-3">
					<div className="container-fluid">
						<Link to={public_url.lead_list}>Home</Link>
					</div>
				</div>
				<BreadCrumbDocuments />
				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						{loading && <div id="cover-spin"></div>}
						<div class="d-flex justify-content-start align-items-center">
							<section class="py-4 position-relative bg_l-secondary w-100 ">
								<div class="px-2 pt-4 pb-5 bg-white">
									<div className="font-weight-bold text-primary ml-3 mb-3">
										{" "}
										Document Upload{" "}
									</div>
									<div className="p-3">
										<button
											className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${appData.id ==
												selectedApplicant
												&&
												"btn-green"}`}
											onClick={() => {
												appData.type = "apllicant";
												this.onCoApplicantClick(appData);
											}}
										>
											Applicant
                    </button>
										{dataofCoApp &&
											this.state.dataofCoApp.map(res => {
												if (res.indNonIndFlag == "individual" && res.financialstatus == "financial") {
													return (
														<button
															className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${res.id ==
																selectedApplicant && "btn-green"}`}
															// onClick={()=> {this.setState({ presntCoApp: res })}}
															onClick={() => {
																res.type = "co-applicant";
																this.onCoApplicantClick(res);
															}}
														>
															Co-Applicant
													 </button>
													);
												}
												if (res.indNonIndFlag == "non-individual") {
													return (
														<button
															className={`btn btn-secondary mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${res.id ==
																selectedApplicant && "btn-green"}`}
															// onClick={()=> {this.setState({ presntCoApp: res })}}
															onClick={() => {
																res.type = "co-applicant";
																this.onCoApplicantClick(res);
															}}
														>
															Co-Applicant
													 </button>
													);
												}
											})}
										<GSTverification data={data} {...this.props} />
										<ITRupload
											data={data}
											{...this.props}
											handleItrFieldValidation={this.handleItrFieldValidation}
										/>
										<BankDetails
											data={data}
											appData={appData}
											{...this.props}
											getApplicantbyLoan={this.getApplicantbyLoan}
											handleBankDetailsFieldValidation={
												this.handleBankDetailsFieldValidation
											}
										/>
										<FinancialStatement
											data={data}
											appData={appData}
											{...this.props}
											getApplicantbyLoan={this.getApplicantbyLoan}
										/>
										<div className="p-3 d-flex justify-content-end mt-4 mx-0">
											<button
												className="btn btn-rounded poition-relative z-index-1 ls-1 cursor-pointer fs-16 btn-green text-white"
												onClick={this.onNextClick}
												disabled={
													//  (isItrFilled || isBankDetailsFilled) ? true : loading
													loading
												}
											>
												{loading ? "Proccesing..." : "Next"}
											</button>
										</div>
									</div>
								</div>
							</section>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
export default withRouter(Documents);
