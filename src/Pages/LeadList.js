import React from "react";
import { postLeadList, postProspectList } from "../Utility/Services/Leads";
import { Input } from "../Component/Input";
import { public_url } from "../Utility/Constant";
import { Link } from "react-router-dom";
import EditLead from "../Component/Pages/EditLead";
import Pagination from "react-js-pagination";
import ProspectList from "./ProspectList";
import { Footer } from "../Component/Pages";
//import "bootstrap/dist/css/bootstrap.min.css";
export default class LeadList extends React.Component {
	constructor() {
		super();
		this.state = {
			leadList: [],
			searchTxt: "",
			leadListContainer: [],
			editLeadId: "",
			loading: true,
			perPage: 10,
			activePage: 1,
			listView: 1
		};
	}
	LeadList = () => {
		this.setState({ loading: true, listView: 1, searchTxt: "" });
		let empID = localStorage.getItem("employeeId")
		postLeadList(empID).then(res => {
			if (res.error) {
				this.setState({ loading: false });
				return;
			}
			this.setState({
				leadList: res.data.data ? res.data.data : [],
				leadListContainer: res.data.data ? res.data.data : [],
				loading: false
			});
		});
	};
	componentDidMount() {
		let { history } = this.props;
		if (history.location.pathname.startsWith(public_url.prospect_list)) {
			this.ProspectList();
		} else {
			this.LeadList();
		}

		window.close();
	}
	ProspectList = () => {
		this.setState({ loading: true, listView: 2, searchTxt: "" });
		let empID = localStorage.getItem("employeeId")
		postProspectList(empID).then(res => {
			if (res.error) {
				this.setState({ loading: false });
				return;
			}
			this.setState({
				leadList: res.data.data ? res.data.data : [],
				leadListContainer: res.data.data ? res.data.data : [],
				loading: false
			});
		});
	};
	searchProspect = (name, value) => {
		let { leadListContainer, loading } = this.state;
		this.setState({ [name]: value }, () => {
			let leadArray = [];

			leadArray = leadListContainer.filter(res => {
				console.log(res.leadcode && typeof res.leadcode);
				if (
					(res.custmername &&
						res.custmername
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.firmName &&
						res.firmName
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.cif &&
						res.cif
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.leadCode &&
						res.leadCode
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.mobilenumber &&
						res.mobilenumber
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.loan_number &&
						res.loan_number
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.emailId &&
						res.emailId
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					(res.updatedDate &&
						res.updatedDate
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase()))
				)
					return res;
			});
			this.setState({
				leadList: value ? leadArray : leadListContainer,
				perPage: 10,
				activePage: 1
			});
		});
	};
	search = (name, value) => {
		let { leadListContainer, loading } = this.state;
		this.setState({ [name]: value }, () => {
			let leadArray = [];
			leadArray = leadListContainer.filter(res => {
				console.log(res.leadcode && typeof res.leadcode);
				if (
					(res.leadcode &&
						res.leadcode
							.toString()
							.toLowerCase()
							.includes(value.toString().toLowerCase())) ||
					res.name
						.toString()
						.toLowerCase()
						.includes(value.toString().toLowerCase()) ||
					res.emailid
						.toString()
						.toLowerCase()
						.includes(value.toString().toLowerCase()) ||
					res.mobileno
						.toString()
						.toLowerCase()
						.includes(value.toString().toLowerCase())
				)
					return res;
			});
			this.setState({
				leadList: value ? leadArray : leadListContainer,
				perPage: 10,
				activePage: 1
			});
		});
	};
	EditLead = id => {
		this.setState({ editLeadId: id });
	};
	Pagination = id => {
		var elmnt = document.getElementById("lead-list-container");
		elmnt.scrollTop = 0;
		this.setState({ activePage: id });
	};
	render() {
		let {
			leadList,
			searchTxt,
			editLeadId,
			loading,
			perPage,
			activePage,
			listView
		} = this.state;
		let { history } = this.props;
		return (
			<React.Fragment>
				<section class="px-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div class="d-flex justify-content-start align-items-center">
							<div className="breadcrums1">
								{history.location.pathname.startsWith(
									public_url.prospect_list
								) ? (
										<>
											<ul>
												<li
													className=""
													className={`${listView == 2 && "active"}`}
													onClick={this.ProspectList}
												>
													<Link to={public_url.prospect_list}>Prospects</Link>
												</li>
											</ul>
											<ul>
												<li
													className=""
													className={`${listView == 1 && "active"}`}
													onClick={this.LeadList}
												>
													<Link to={public_url.lead_list}>Leads</Link>
												</li>
											</ul>
										</>
									) : (
										<>
											<ul>
												<li
													className=""
													className={`${listView == 1 && "active"}`}
													onClick={this.LeadList}
												>
													<Link to={public_url.lead_list}>Leads</Link>
												</li>
											</ul>
											<ul>
												<li
													className=""
													className={`${listView == 2 && "active"}`}
													onClick={this.ProspectList}
												>
													<Link to={public_url.prospect_list}>Prospects</Link>
												</li>
											</ul>
										</>
									)}
							</div>
							<form
								class="form_style-1 lead-list-textbox-div w-75"
								onSubmit={e => {
									e.preventDefault();
								}}
							>
								<div class="form-group row">
									<div class="col-sm-12 col-lg-8 col-xl-9 create-lead-form">
										<Input
											className="form-control form-control-md fs-12 bg-white "
											id="colFormLabelSm"
											placeholder="Search by Name/Application number/Contact number"
											name="searchTxt"
											value={searchTxt}
											title="Customer Name"
											isReq={true}
											onChangeFunc={(name, value, error) => {
												if (listView == 1) {
													this.search(name, value, error);
												} else if (listView == 2) {
													this.searchProspect(name, value, error);
												}
											}}
											//error={errors.customerName}
											//validationFunc={this.onInputValidate}
											search
										/>
									</div>
								</div>
							</form>
						</div>

						<div class="row mb-2">
							{/* <div className="col-md-12 text-right">
                                      <a href="#" className="btn-white btn px-4 py-1 text-primary rounded-pill fs-12">Filter</a>
                                  </div> */}
						</div>
						{listView == 1 && (
							<div class="lead-list-container" id="lead-list-container">
								{loading && <h3>Loading...</h3>}
								{!loading && leadList.length == 0 && <h3>No result found</h3>}
								{leadList.map((res, index) => {
									if (
										index + 1 <= activePage * perPage &&
										index >= activePage * perPage - perPage
									)
										return (
											<React.Fragment>
												{editLeadId == res.leadcode ? (
													<EditLead
														editLeadId={editLeadId}
														EditLead={this.EditLead}
														LeadList={this.LeadList}
													/>
												) : (
														<React.Fragment>
															<div class="row align-items-center border justify-content-between mb-2 ">
																<div
																	class={`col-md-2 one bg_d-primary fs-18 text-white p-3 d-flex align-items-center justify-content-center align-self-stretch ${res.status ==
																		"Consent Approved" && "lead-approved"}`}
																>
																	<p class="mb-0"> {res.leadcode} </p>
																</div>
																<div class="col-md-8 two d-flex justify-content-between p-3 border-left border-right align-self-stretch">
																	<div className="word-break-all pr-3">
																		<h4 class="text-primary fw-600 fs-18 mb-1">
																			{res.name}
																		</h4>
																		<p class="text-primary mb-1 fs-14">
																			{res.mobileno}
																		</p>
																		<p class="text-primary fs-14 mb-0">
																			{res.emailid}
																		</p>
																	</div>
																	<div class="d-flex flex-column flex-shrink-0">
																		<span class="fs-12">{res.updated_date}</span>
																		{/* <span class="fs-12 text-right">12:10</span> */}
																	</div>
																</div>
																<div
																	class={`col-md-1 three bg_d-primary p-3 d-flex align-items-center justify-content-center align-self-stretch  ${
																		res.status == "Consent Approved"
																			? "bg-success"
																			: ""
																		}`}
																>
																	{res.status == "Consent Approved" ? (
																		<p
																			class={`text-dark mb-0 fs-14 flex-wrap mb-0 overflow-auto`}
																		>
																			{res.status}
																		</p>
																	) : (
																			<Link
																				to={`${public_url.lead_con}/${res.leadcode}`}
																			>
																				<p
																					class={`text-white mb-0 fs-14 flex-wrap mb-0`}
																				>
																					{res.status}
																				</p>
																			</Link>
																		)}
																</div>

																<div
																	class={`col-md-1 four bg_lightblue p-3 d-flex align-items-center justify-content-center align-self-stretch `}
																	onClick={() => {
																		if (res.status != "Consent Approved") {
																			this.EditLead(res.leadcode);
																		} else {
																			this.props.history.push({
																				pathname: `${public_url.update_profile}/${res.leadcode}/${res.mobileno}`,
																				state: {
																					pathname: window.location.pathname
																				}
																			});
																		}
																	}}
																>
																	<a class="text-primary cursor-pointer">
																		{res.status != "Consent Approved"
																			? "EDIT"
																			: "Update Profile"}{" "}
																	</a>
																</div>
															</div>
														</React.Fragment>
													)}
											</React.Fragment>
										);
								})}
							</div>
						)}
						{listView == 2 && (
							<ProspectList
								leadList={leadList}
								loading={loading}
								perPage={perPage}
								activePage={activePage}
							/>
						)}
					</div>
					{leadList.length > this.state.perPage && (
						<Pagination
							activePage={this.state.activePage}
							itemsCountPerPage={this.state.perPage}
							totalItemsCount={leadList.length}
							pageRangeDisplayed={5}
							onChange={this.Pagination}
							innerClass="pagination d-flex justify-content-center align-items-center mt-4"
							itemClass="mx-2 item"
							itemClassFirst="itemClassFirst"
							itemClassPrev="itemClassPrev"
							itemClassNext="itemClassNext"
							itemClassLast="itemClassLast"
						/>
					)}
				</section>
				{/* <Footer/> */}
			</React.Fragment>
		);
	}
}
