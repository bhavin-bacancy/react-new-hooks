import React from "react";

import { cloneDeep } from "lodash";
import {
  getAllCity,
  postAdditionalDetail,
  getCityAndStateByPincode
} from "../../../../Utility/Services/QDE";
import { withRouter } from "react-router-dom";
const initForm = {
  addressline1: "",
  addressline2: "",
  state: "",
  city: "",
  pincode: "",
  addressFlag: true,
  leadCode: "LAP-0057",
  errors: {
    addressline1: null,
    addressline2: null,
    state: null,
    city: null,
    pincode: null
  }
};
class AdditionalDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      currentAddressOpen: true,
      cityList: [],
      form: cloneDeep(initForm),
      saveForm: false,
      currentDetailLoading: false
    };
    this.GetCityStateByPincode = this.GetCityStateByPincode.bind(this);
  }
  currentAddressOpen = () => {
    let { currentAddressOpen } = this.state;
    this.setState({ currentAddressOpen: !currentAddressOpen });
  };
  componentDidMount() {
    let { form } = this.state;
    let { leadDetail } = this.props;
    this.setState({ form: { ...form, ...leadDetail } }, async () => {
      if (leadDetail) {
        await this.GetCityStateByPincode(leadDetail.pincode, "pincode");
        await this.GetCityStateByPincode(leadDetail.commPincode, "commPincode");
      }
    });
  }
  getCity = stateId => {
    let stateName = "";
    let { stateList } = this.props;
    stateList.filter(res => {
      if (res.stateId == stateId) {
        stateName = res.stateName;
      }
    });
    getAllCity(stateName).then(res => {
      if (res.error) return;
      this.setState({ cityList: res.data.data });
    });
  };
  async GetCityStateByPincode(pincode, state) {
    let { form } = this.state;
    this.setState({ pincodeLoading: true });
    await getCityAndStateByPincode(pincode).then(res => {
      if (res.error) {
        return;
      }
      if (!res.data.error) {
        if (state == "pincode") {
          console.log("Pincode", form);
          form = {
            ...form,
            city: res.data.data[0].city_nm,
            state: res.data.data[0].state_nm
          };
          this.setState({ form: form });
        } else {
          console.log("CooPincode", form);
          form = {
            ...form,
            commCity: res.data.data[0].city_nm,
            commState: res.data.data[0].state_nm
          };
          this.setState({ form: form });
        }
      }
    });
  }
  render() {
    let {
      currentAddressOpen,
      form,
      cityList,
      saveForm,
      currentDetailLoading
    } = this.state;
    let { stateList } = this.props;
    let {
      addressline1,
      addressline2,
      pincode,
      city,
      state,
      errors,
      commAddressline1,
      commAddressline2,
      commCity,
      commPincode,
      commState,
      mobileNumber,
      alternateMobileNumber,
      ComobileNumber,
      emailid
    } = form;

    return (
      <React.Fragment>
        <div className="gAccordion">
          <div className="gAccordion__title" onClick={this.currentAddressOpen}>
            <i class="icon">{currentAddressOpen ? "-" : "+"}</i> Additional
            Details
          </div>
        </div>
        {currentAddressOpen && (
          <div className="gAccordion__body ml-3 pl-4 pr-4">
            <div class="row">
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500">
                  Current Address
                </label>
              </div>
              <div class="col-md-4 col-lg-4 mt-2 mt-lg-0 break-text">
                {addressline1}
                {", "}
                {addressline2}
                {", "}
                {city}
                {", "}
                {state}
                {", "}
                {pincode}
              </div>
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500">
                  Communication Address
                </label>
              </div>
              <div class="col-md-4 col-lg-4 mt-2 mt-lg-0 break-text">
                {commAddressline1}
                {", "}
                {commAddressline2}
                {", "}
                {commCity}
                {", "}
                {commState}
                {", "}
                {commPincode}
              </div>
              <br />
              <div class="col-md-4 col-lg-2 d-flex break-text">
                <label class="fs-14 mb-0 gTextPrimary fw-500">
                  Alternate Contact Details
                </label>
              </div>
              <div class="col-md-4 col-lg-4 mt-2 mt-lg-0">
                {alternateMobileNumber}
              </div>
              <div class="col-md-4 col-lg-2 d-flex">
                <label class="fs-14 mb-0 gTextPrimary fw-500">
                  Contact Details
                </label>
              </div>
              <div class="col-md-4 col-lg-4 mt-2 mt-lg-0">
                {mobileNumber}, {emailid}
              </div>
            </div>
          </div>
        )}
        <div class="flex-grow-1">
          <hr class="bg_lightblue" />
        </div>
      </React.Fragment>
    );
  }
}
export default withRouter(AdditionalDetail);
