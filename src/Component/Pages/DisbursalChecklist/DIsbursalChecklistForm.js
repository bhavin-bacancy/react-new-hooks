import React, { useState, useEffect } from "react";
import { TextArea } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom";
import { ts, te } from "../../Utility/ReduxToaster";

let checkListForm = {
	remark1: "",
	approveFlag: null,
	errors: {
		remark1: null,
		applicationError: null
	}
};

export const DisbursalChecklistForm = (props) => {
	const [state, setState] = useState({
		checklist: cloneDeep(checkListForm)
	});
	let { match } = props;
	let { checklist } = state;
	let { remark1, errors } = checklist;

	const onInputChange = (name, value, error = undefined) => {
		let { checklist } = state;
		checklist[name] = value;

		if (error !== undefined) {
			let { errors } = checklist;
			errors[name] = error;
		}
		setState({ ...state, checklist });
	};

	return (
		<>
			<section className="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div className="d-flex justify-content-start align-items-center">
						<section className="py-4 position-relative bg_l-secondary w-100 ">
							<div className="pb-5 bg-white">
								<div className="row">
									<div className="col-lg-6 mt-3">
										<span className="font-weight-bold text-green text-primary ml-4 mt-3">
											{" "}
											Applicant Name{" "}
										</span>
										<span className="text-primary text-green ml-3 mt-3">
											{" "}
											( Type of Entity )
										</span>
									</div>
								</div>
								<div className="px-4 py-3">
									<p className="text-primary fw-700 ">Case Disbursal Credentials</p>
								</div>

								<div className="row pl-4 pr-4">
									<div className="col-lg-8 col-md-6 ">
										<div className="custom-control custom-checkbox">
											<input
												type="checkbox"
												className="custom-control-input"
												disabled={true}
												// id={res.id}
												// value={res.id}
												// checked={res.selected}
												// onChange={e => {
												// 	this.applicationCheck(e);
												// }}
												isReq={true}
											/>
											<label
												className="custom-control-label text-l-priamry"
											>
												Completely filled app form duly signed by all borrowers, colour passport photo with cross sign
														<span className="fw-700 text-danger" >
													{" "}*
                            </span>
											</label>
										</div>
									</div>
									<div className="col-md-6 col-lg-4 pr-4">
										<div className="text-right">
											<p className="text-primary fw-500 mb-1">
												Application Form
                      </p>
											<p className="text-l-priamry text-right">
												Remarks
                      </p>
										</div>
										<TextArea
											title="remark1"
											className="form-control border-rounded-pill fs-14 p-2 pl-4 pr-2"
											placeholder="Type here...."
											name="remark1"
											onChangeFunc={(name, value, error) => {
												onInputChange(name, value, error);
											}}
											value={checklist.remark1}
										/>
									</div>
									<div className="col-12">
										<hr className="bg_d-primary border-0 h-1px mt-0" />
									</div>
								</div>

								<div className="row justify-content-end mt-4 pr-4 ">
									<button className="btn btn-green btn-rounded text-white ls-1 py-1 px-5 cursor-pointer fs-16 mr-3">
										Cancel
                  </button>
									<button
										className="btn btn-green btn-rounded ls-1 text-white py-1 px-5 cursor-pointer fs-16 mr-3">
										Save
                	</button>
								</div>
							</div>
						</section>
					</div>
				</div>
			</section>
		</>
	);
};
