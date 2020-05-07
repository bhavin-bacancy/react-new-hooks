import React from "react";
import { TextArea } from "../../Component/Input";
import { cloneDeep } from "lodash";
import { postExtraDetail } from "../../Utility/Services/QDE";
import { te, ts } from "../../Utility/ReduxToaster";
import { withRouter } from "react-router-dom";
const initExtra = {
	notes: "",
	errors: { notes: null }
};
class ExtraNonIndividual extends React.Component {
	constructor() {
		super();
		this.state = {
			extraOpen: false,
			form: cloneDeep(initExtra),
			extraDetailLoading: false,
			saveForm: false
		};
	}
	extraOpen = () => {
		let { extraOpen } = this.state;
		this.setState({ extraOpen: !extraOpen });
	};
	onInputChange = (name, value, error = undefined) => {
		const { form } = this.state;
		form[name] = value;
		if (error !== undefined) {
			let { errors } = form;
			errors[name] = error;
		}
		this.setState({ form });
	};
	// handle validation
	onInputValidate = (name, error) => {
		let { errors } = this.state.form;
		errors[name] = error;
		this.setState({
			form: { ...this.state.form, errors: errors }
		});
	};
	
	SaveForm = () => {
		let { saveForm, form } = this.state;
		let { match, leadDetail } = this.props;
		let { params } = match;
		if (!saveForm) {
			let obj = cloneDeep(form);
			delete obj.errors;
			this.setState({ extraDetailLoading: true });
			obj.leadCode = params.leadcode;
			obj.extrasflag = true;
			obj.mobileNumber = params.mobileno;
			obj.mainapplicant= false;
			obj.custcode= leadDetail.custcode
			postExtraDetail(obj).then(res => {
				if (res.error) {
					this.setState({ saveForm: saveForm, extraDetailLoading: false });
					return;
				}
				if (res.data.error) {
					te(res.data.message);
					this.setState({ saveForm: saveForm, extraDetailLoading: false });
				} else {
					ts(res.data.message);
					this.setState({ saveForm: !saveForm, extraDetailLoading: false });
				}
			});
		} else {
			this.setState({ saveForm: !saveForm });
		}
	};
	componentDidUpdate(preProps) {
		if (preProps.leadDetail != this.props.leadDetail) {
			this.FormFill();
		}
	}
	componentDidMount() {
		this.FormFill();
	}
	FormFill = () => {
		let { leadDetail } = this.props;
		let { saveForm } = this.state;
		if (leadDetail.extrasflag) saveForm = true;
		this.setState({
			saveForm,
			form: { notes: leadDetail.notes, errors: { ...this.state.form.errors } }
		});
	};
	render() {
		let { extraOpen, form, saveForm, extraDetailLoading } = this.state;
		let { leadDetail } = this.props;

		let { notes, errors } = form;
		let extraFormStatus = false;
		if (notes) {
			extraFormStatus = true;
		}
		return (
			<React.Fragment>
				<div className="gAccordion">
					<div className="gAccordion__title" onClick={this.extraOpen}>
						<i class="icon">{extraOpen ? "-" : "+"}</i> Extras (Not Mandatory)
          </div>
					{extraOpen && (
						<div className="gAccordion__body">
							<div className="row pr-lg-5 mt-3">
								<div class="col-md-4 col-lg-2 d-flex">
									<label class="fs-14 mb-0 gTextPrimary fw-500">Notes</label>
								</div>
								<div class="col-md-8 col-lg-5 mt-2 mt-lg-0 mr-auto break-text">
									{!saveForm ? (
										<TextArea
											name="notes"
											className="form-control border-rounded-pill borderRadius20 fs-14 minHeight110 resizeNone"
											placeholder="Enter text"
											onChangeFunc={this.onInputChange}
											validationFunc={this.onInputValidate}
											value={notes}
											//isReq={true}
											title="Notes"
											error={errors.notes}
										/>
									) : (
											notes
										)}
								</div>
							</div>
							<div class="row justify-content-end mt-4 mx-0">
								{!saveForm && leadDetail.extrasflag && (
									<button

										class="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
										onClick={this.props.GetLeadDetail}
									>
										Cancel
                  </button>
								)}
								<button
									//disabled={!extraFormStatus}
									class={`btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 ${
										"btn-green"}`}
									onClick={e => {
											this.SaveForm(e);
										}
									}
								>
									{saveForm
										? "Edit"
										: extraDetailLoading
											? "Saving..."
											: "Save"}
								</button>
							</div>
						</div>
					)}
					<hr class="bg_lightblue border-0 h-1px" />
				</div>
			</React.Fragment>
		);
	}
}
export default withRouter(ExtraNonIndividual);
