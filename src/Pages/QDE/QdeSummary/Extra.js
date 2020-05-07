import React from "react";
import { cloneDeep } from "lodash";
import { withRouter } from "react-router-dom";
const initExtra = {
  notes: "",
  errors: { notes: null }
};
class Extra extends React.Component {
  constructor() {
    super();
    this.state = {
      extraOpen: true,
      form: cloneDeep(initExtra),
      extraDetailLoading: false,
      saveForm: false
    };
  }
  extraOpen = () => {
    let { extraOpen } = this.state;
    this.setState({ extraOpen: !extraOpen });
  };
  render() {
    let { extraOpen, form, saveForm, extraDetailLoading } = this.state;
    let { notes, errors } = this.props.leadDetail;
    let extraFormStatus = false;
    if (notes) {
      extraFormStatus = true;
    }
    return (
      <React.Fragment>
        <div className="gAccordion">
          <div className="gAccordion__title" onClick={this.extraOpen}>
            <i class="icon">{extraOpen ? "-" : "+"}</i> Extras
          </div>
          {extraOpen && (
            <div className="gAccordion__body pl-4">
              <div className="row pr-lg-5 mt-3">
                <div class="col-md-4 col-lg-2 d-flex">
                  <label class="fs-14 mb-0 gTextPrimary fw-500">Notes</label>
                </div>
                <div class="col-md-8 col-lg-5 mt-2 mt-lg-0 mr-auto break-text">
                  {notes}
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(Extra);
