import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cloneDeep } from "lodash";
import { public_url } from "../../Utility/Constant";
import { BreadCrumbs } from "./BreadCrumbs";
import { BasicDetails } from "./BasicDetails";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { KeyGovernmentID } from "./KeyGovernmentID";
import { ContactDetails } from "./ContactDetails";
import { PersonalDetails } from "./PersonalDetails";
import { ProfessionalDetails } from "./ProfessionalDetails";
import { getPromoterDetail } from "../../Utility/Services/Promoter";
import { ts, te } from "../../Utility/ReduxToaster";


export const PromoterDetails = props => {
	const [state, setState] = useState({
		promoterDetail: {},
		selectedData: {},
		selectedPromoter: "",
		newPromoter: false,
		viewMode: false,
		defaultValue: true
	});

	let { promoterDetail, selectedData, selectedPromoter, newPromoter, viewMode, defaultValue } = state;

	useEffect(() => {
		getPromoterDetails();
	}, [!promoterDetail]);

	const getPromoterDetails = (response) => {
		let { match } = props;
		getPromoterDetail(match.params.leadcode).then(res => {
			if (res.error) return;
			if (!res.data.error) {
				setState({
					promoterDetail: res.data.data,
					selectedPromoter: defaultValue && res.data.data && res.data.data.promo && res.data.data.promo[0] ? res.data.data.promo[0].id : response && response.id,
					selectedData: defaultValue && res.data.data && res.data.data.promo && res.data.data.promo[0] ? res.data.data.promo[0] : response
				});
			}
		});
	};

	const onPromoterClick = (response) => {
		if (response.id) {
			state.selectedData = response;
			state.selectedPromoter = response.id;
			state.viewMode = true;
			state.newPromoter = false
			state.defaultValue = false
			setState({
				...state
			});
		}
	};

	const AddAnotherPromoter = () => {
		setState({
			...state,
			selectedData: {},
			selectedPromoter: "",
			newPromoter: true,
			viewMode: false,
			defaultValue: false
		})
	}

	const settings = {
		focusOnSelect: true,
		infinite: false,
		slidesToShow: 4,
		slidesToScroll: 1,
		speed: 500
	};

	return (
		<>
			<div className="backToDashboard py-3">
				<div className="container-fluid">
					<Link to={public_url.lead_list}>Back to Dashboard</Link>
				</div>
			</div>
			<BreadCrumbs {...props} promoterDetail={promoterDetail} />

			<section className="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div class="d-flex justify-content-start align-items-center">
						<section class="py-4 position-relative bg_l-secondary w-100 ">
							<div class="pb-5 bg-white">
								<div className="row promoter-form">
									<div className="col-lg-12 mt-3 ">
										<span className="font-weight-bold text-primary mt-3">
											{" "}
											{promoterDetail.firmName ? promoterDetail.firmName : promoterDetail.customerName}
										</span>
										<span className="text-primary ml-3 mt-3">
											{" "}
											( {promoterDetail.typeOfEntity} )
                    </span>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-8 mt-3 ml-3 ">
										<div className="ml-4">
											{
												promoterDetail && promoterDetail.promo && promoterDetail.promo.length > 0 &&
												<Slider {...settings}>
													{promoterDetail &&
														promoterDetail.promo &&
														promoterDetail.promo.map((val, index) => {
															return (
																<div key={index} className="pl-2 pr-2">
																	<button
																		onClick={() => onPromoterClick(val, index)}
																		className={`btn btn-secondary d-flex justify-content-center w-100 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${selectedPromoter ==
																			val.id && "btn-green"}`}
																	>
																		{val &&
																			val.nameofthePromoter &&
																			val.nameofthePromoter.toUpperCase()}
																	</button>
																</div>
															);
														})}
												</Slider>
											}
										</div>
									</div>
									<div className="font-weight-bold col-lg-3 mt-4 ml-4 text-primary text-right ">
										<a onClick={AddAnotherPromoter} className="cursor-pointer">+ Add Another Promoter</a>
									</div>
								</div>
								<div className="mt-3">
									<BasicDetails
										{...props}
										getPromoterDetails={getPromoterDetails}
										promoterDetail={promoterDetail}
										selectedData={selectedData}
										newPromoter={newPromoter}
										viewMode={viewMode}
										onPromoterClick={onPromoterClick}
									/>
									<KeyGovernmentID
										{...props}
										getPromoterDetails={getPromoterDetails}
										promoterDetail={promoterDetail}
										selectedData={selectedData}
										newPromoter={newPromoter}
										viewMode={viewMode}
										onPromoterClick={onPromoterClick}
									/>
									<ContactDetails
										{...props}
										getPromoterDetails={getPromoterDetails}
										promoterDetail={promoterDetail}
										selectedData={selectedData}
										newPromoter={newPromoter}
										viewMode={viewMode}
										onPromoterClick={onPromoterClick}
									/>
									<PersonalDetails
										{...props}
										getPromoterDetails={getPromoterDetails}
										promoterDetail={promoterDetail}
										selectedData={selectedData}
										newPromoter={newPromoter}
										viewMode={viewMode}
										onPromoterClick={onPromoterClick}
									/>
									<ProfessionalDetails
										{...props}
										getPromoterDetails={getPromoterDetails}
										promoterDetail={promoterDetail}
										selectedData={selectedData}
										newPromoter={newPromoter}
										viewMode={viewMode}
										onPromoterClick={onPromoterClick}
									/>
								</div>
								<div className="row mt-3 promoter-form">
									<div className="col-sm-12">
										<div className="text-right">
											<Link to={`${public_url.collateral_detail}/${props.match.params.leadcode}`}>
												<button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 btn-green">
													Next
                        </button>
											</Link>
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
