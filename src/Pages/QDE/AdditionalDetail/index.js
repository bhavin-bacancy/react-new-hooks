import React from "react";
import { Select, Input } from "../../../Component/Input";
import { getAllState } from "../../../Utility/Services/QDE";
import CurrentAddress from "./CurrentAddress";
import CommunicationAddress from "./CommunicationAddress";
import AlternativeContactDetail from "./AlternativeContactDetail";
import ContactDetails from "./ContactDetail";
import CurrentAddressNonIndividual from "./CurrentAddressNonIndividual";
import CommunicationAddressNonIndividual from "./CommunicationAddressNonIndividual";
import AlternativeContactDetailNonIndividual from "./AlternativeContactDetailNonIndividual";
let currentDetailForm = {
	address1: "",
	address2: "",
	pincode: "",
	city: ""
};
class AdditionalDetail extends React.Component {
	constructor() {
		super();
		this.state = {
			currentAddressOpen: false,
			additionalDetailOpen: false,
			additionalDetailOpen: false,
			communicationAddressOpen: false,
			alternativeContactDetailOpen: false,
			stateList: []
		};
	}
	componentDidMount() {
		this.getAllState();
	}
	getAllState = () => {
		getAllState().then(res => {
			if (res.error) return;
			this.setState({ stateList: res.data.data });
		});
	};

	additionalDetailOpen = () => {
		let { additionalDetailOpen } = this.state;
		this.setState({ additionalDetailOpen: !additionalDetailOpen });
	};
	render() {
		let {
			currentAddressOpen,
			additionalDetailOpen,
			communicationAddressOpen,
			alternativeContactDetailOpen,
			stateList
		} = this.state;
		let { leadDetail, coApplicantFlagData } = this.props;
		let { selectedEntity } = this.props;

		return (
			<React.Fragment>
				<div className="gAccordion">
					<div class="gAccordion__title" onClick={this.additionalDetailOpen}>
						<i class="icon">{additionalDetailOpen ? "-" : "+"}</i> Additional
            Details (Mandatory)
          </div>
					{additionalDetailOpen && !coApplicantFlagData && (
						<>
							<div className="gAccordion__body">
								<CurrentAddress
									stateList={stateList}
									leadDetail={leadDetail}
									GetLeadDetail={this.props.GetLeadDetail}
									selectedEntity={this.props.selectedEntity}
									commonData={this.props.commonData}
									OnChange={this.props.OnChange}
								/>
								<CommunicationAddress
									stateList={stateList}
									leadDetail={leadDetail}
									GetLeadDetail={this.props.GetLeadDetail}
									selectedEntity={this.props.selectedEntity}
								/>

								{selectedEntity == 1 ? (
									<ContactDetails leadDetail={leadDetail} />
								) : (
										""
									)}
								<AlternativeContactDetail
									leadDetail={leadDetail}
									GetLeadDetail={this.props.GetLeadDetail}
									selectedEntity={this.props.selectedEntity}
								/>
							</div>
						</>
					)}
					{additionalDetailOpen && coApplicantFlagData && (
						<>
							<div className="gAccordion__body">
								<CurrentAddressNonIndividual
									stateList={stateList}
									leadDetail={leadDetail}
									GetLeadDetail={this.props.GetLeadDetail}
									selectedEntity={this.props.selectedEntity}
									commonData={this.props.commonData}
									OnChange={this.props.OnChange}
								/>
								<CommunicationAddressNonIndividual
									stateList={stateList}
									leadDetail={leadDetail}
									GetLeadDetail={this.props.GetLeadDetail}
									selectedEntity={this.props.selectedEntity}
								/>
								<AlternativeContactDetailNonIndividual
									leadDetail={leadDetail}
									GetLeadDetail={this.props.GetLeadDetail}
									selectedEntity={this.props.selectedEntity}
								/>
							</div>
						</>
					)}
					<hr class="bg_lightblue border-0 h-1px" />
				</div>
			</React.Fragment>
		);
	}
}
export default AdditionalDetail;
