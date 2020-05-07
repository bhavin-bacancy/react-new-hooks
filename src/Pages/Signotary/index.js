import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Input, Select } from "../../Component/Input";
import { BreadCrumbs } from "./BreadCrubm"
import {
	getSignatoryDetail,
	postAddSigntory,
	postGetSigantoryAll
} from "../../Utility/Services/Signatory";
import { cloneDeep } from "lodash";
import { te, ts } from "../../Utility/ReduxToaster";
import { public_url } from "../../Utility/Constant";
const initSignatory = {
	signatoryDetail: [],
	loading: false,
	addLoading: false,
	form: { errors: {}, selectedSignatory: "" },
	getSignatoryData: []
};
export const Signotary = (props) => {
	const [state, setState] = useState({ ...cloneDeep(initSignatory) });
	let { signatoryDetail } = state;
	useEffect(() => {
		GetSignatory();
	}, []);
	const GetSignatory = () => {
		state.loading = true;
		setState({ ...state });
		postGetSigantoryAll(props.match.params.loannumber).then(res => {
			if (res.error) return;
			if (res.data.error) {
				//    te(res.data.message);
			} else {
				state.signatoryDetail = res.data.data;
				setState({ ...state });
			}
		});
		getSignatoryDetail(props.match.params.loannumber).then(res => {
			if (res.error) return;
			if (res.data.error) {
				// te(res.data.message);
			} else {
				let data = "";
				res.data.data.map(res => {
					data = data ? data + "," + res.uniqueId : res.uniqueId;
				});
				state.form.selectedSignatory = data;
				state.getSignatoryData = res.data.data;
			}
			setState({ ...state });
		});
	};
	const AddSignatory = () => {
		state.addLoading = true;
		let data = [];
		signatoryDetail.map(res => {
			if (state.form.selectedSignatory.includes(res.uniqueId)) {
				let existData = state.getSignatoryData.filter(detail => {
					if (detail.uniqueId.includes(res.uniqueId)) {
						return detail;
					}
				});
				if (existData.length > 0) {
					res.id = existData.id;
				}
				data.push(res);
			}
		});

		postAddSigntory(data).then(res => {
			if (res.error) return;
			if (res.data.error) {
				state.addLoading = false;
				te(res.data.message);
			} else {
				state.addLoading = false;
				ts(res.data.message);
				props.history.push(`${public_url.sanction}/${props.match.params.leadcode}`)
			}
			setState({ ...state });
		});
	};
	const onInputChange = (name, value, error = undefined) => {
		console.log(name, value);
		state.form[name] = value;
		if (error !== undefined) {
			state.form.errors[name] = error;
		}
		setState({ ...state });
	};
	return (
		<>
			<BreadCrumbs />
			<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
				<div className="container">
					<div class="d-flex justify-content-start align-items-center">
						<section class="py-4 position-relative bg_l-secondary w-100 ">
							<div class="pb-5 bg-white">
								<div className="container-fluid">
									<div className="row  ">
										<div className="col-lg-12 mt-5  text-primary h5">
											Signatory details
                    </div>
									</div>
									<div className="row">
										<div className="col-lg-12 text-primary">
											Choose Signatory from current list of
                      promoters/Stakeholder
                    </div>
										<div className="col-lg-6 mt-2 text-primary">
											Choose Signatory
                    </div>
										<div className="col-lg-6">
											<Select
												options={signatoryDetail}
												className="w-100 fs-12 create-lead-form-select"
												labelKey="customerName"
												valueKey="uniqueId"
												onChangeFunc={onInputChange}
												name="selectedSignatory"
												title="Signatory"
												value={state.form.selectedSignatory}
												isMulti={true}
											/>
										</div>
									</div>
									<div class="row justify-content-end mt-3 pr-0 mt-lg-0">
										<div className="col-sm-12 text-right">
											<Link to={`${public_url.checklist_view}/${props.match.params.leadcode}/${props.match.params.mobileno}`}>
												<button
													className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mt-4 mr-3 btn-green"
												>
													Cancel
                      </button></Link>
											<button
												disabled={!state.form.selectedSignatory}
												className={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mt-4 ${state.form.selectedSignatory && "btn-green"}`}
												onClick={AddSignatory}
											>
												Save
                      </button>
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
