import React from "react";

import { cloneDeep } from "lodash";
import { postSalution, postGender } from "../../../Utility/Services/QDE";

const initEntityForm = { entity: "", errors: { entity: null } };

let panForm1 = {
	panName: "",
	panNumber: "",
	dateOfBirth: "",
	gender: "",
	salutation: "dfsdfs",
	errors: {
		panNumber: null,
		dateOfBirth: null,
		gender: null,
		salutation: null,
		panName: null
	}
};
let panForm2 = {
	panName: "",
	panNumber: "",
	dateOfBirth: "",
	errors: {
		panNumber: null,
		dateOfBirth: null,
		panName: null
	}
};
class PanGST extends React.Component {
	constructor() {
		super();
		this.state = {
			panOpen: false,
			panGstOpen: true,
			gstOpen: false,
			entityForm: cloneDeep(initEntityForm),
			panForm: cloneDeep(panForm1),
			entity: [],
			saveEntity: false,
			genderList: [],
			salutationList: []
		};
	}
	panOpen = () => {
		let { panOpen } = this.state;
		this.setState({ panOpen: !panOpen });
	};
	gstOpen = () => {
		let { gstOpen } = this.state;
		this.setState({ gstOpen: !gstOpen });
	};
	panGstOpen = () => {
		let { panGstOpen } = this.state;
		this.setState({ panGstOpen: !panGstOpen });
	};

	componentDidMount() {
		this.GetGender();
		this.GetSalution();
		this.setState({
			entityForm: { ...this.state.entityForm, ...this.props.leadDetail }
		});
	}
	GetSalution = () => {
		postSalution().then(res => {
			if (res.error) return;
			this.setState({ salutationList: res.data.data });
		});
	};
	GetGender = () => {
		postGender().then(res => {
			if (res.error) return;

			this.setState({ genderList: res.data.data });
		});
	};
	render() {
		let {
			panOpen,
			panGstOpen,
			gstOpen,
			entityForm,
			panForm,
			entity,
			saveEntity,
			genderList,
			salutationList
		} = this.state;
		let {
			typeOfEntity,
			panNumber,
			dateOfBirth,
			gender,
			customerName,
			salutation,
			gstNumber, firmName
		} = entityForm;
		return (
			<React.Fragment>
				<div className="gAccordion">
					<div className="gAccordion__title" onClick={this.panGstOpen}>
						<i className="icon">{panGstOpen ? "-" : "+"}</i> PAN and GST
            verification
          </div>
					{panGstOpen && (
						<div className="gAccordion__body pl-4">
							{
								typeOfEntity &&
								<div className="row align-items-center">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Type of entity
                  </label>
									</div>
									<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
										<div class="select">{typeOfEntity}</div>
									</div>
								</div>
							}
							<div className="row align-items-center">
								<div className="col-md-4 col-lg-2 d-flex align-items-center">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										PAN No.
                  </label>
								</div>
								<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
									<div class="select">{panNumber}</div>
								</div>
							</div>
							<div className="row align-items-center">
								<div className="col-md-4 col-lg-2 d-flex align-items-center">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										Date Of Birth
                  </label>
								</div>
								<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
									<div class="select">{dateOfBirth}</div>
								</div>
							</div>
							{gender && (
								<div className="row align-items-center">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Gender
                    </label>
									</div>
									<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
										<div class="select">
											{genderList.map(res => {
												if (res.id == gender) {
													return res.subcat_desc;
												}
											})}
										</div>
									</div>
								</div>
							)}
							{salutation && (
								<div className="row align-items-center">
									<div className="col-md-4 col-lg-2 d-flex align-items-center">
										<label className="fs-14 mb-0 gTextPrimary fw-500">
											Salutation
                    </label>
									</div>
									<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
										<div class="select">
											{salutationList.map(res => {
												if (res.id == salutation) {
													return res.subcat_desc;
												}
											})}
										</div>
									</div>
								</div>
							)}
							<div className="row align-items-center">
								<div className="col-md-4 col-lg-2 d-flex align-items-center">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										PAN Name
                  </label>
								</div>
								<div className="col-md-8 col-lg-10 mt-2 mt-lg-0">
									<div class="select">{customerName}</div>
								</div>
							</div>
							{
								firmName && (
									<div className="row align-items-center">
										<div className="col-md-4 col-lg-2 d-flex align-items-center">
											<label className="fs-14 mb-0 gTextPrimary fw-500">
												Firm Name
                  </label>
										</div>
										<div className="col-md-8 col-lg-3 mt-2 mt-lg-0">
											<div class="select">{firmName}</div>
										</div>
									</div>
								)
							}

							{gstNumber && <div className="row align-items-center">
								<div className="col-md-4 col-lg-2 d-flex align-items-center">
									<label className="fs-14 mb-0 gTextPrimary fw-500">
										GST No.
                  </label>
								</div>
								<div className="col-md-8 col-lg-10 mt-2 mt-lg-0">
									<div class="select">{gstNumber}</div>
								</div>
							</div>}
						</div>
					)}
					<hr class="bg_lightblue border-0 h-1px" />
				</div>
			</React.Fragment>
		);
	}
}
export default PanGST;
