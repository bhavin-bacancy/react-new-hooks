import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { Select, Input, TextArea } from "../../../Component/Input";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { cloneDeep } from "lodash";
import { getCityAndStateByPincode } from "../../../Utility/Services/QDE";
import { te, ts } from "../../../Utility/ReduxToaster";
import {
  postGetTypeOfCollateral,
  postGetUsageByCollateral,
  postGetOwnerName,
  postAddCollateralDetail
} from "../../../Utility/Services/CollateralDetail";
import { getFormDetails } from "../../../Utility/Helper";
import { public_url } from "../../../Utility/Constant";
const inItForm = {
  ownerName: "",
  typeOfColletral: "",
  subType: "",
  usage: "",
  addressLine1: "",
  addressLine2: "",
  pincode: "",
  city: "",
  state: "",
  colletralCode: "",
  errors: {
    ownerName: null,
    typeOfColletral: null,
    usage: null,
    addressLine1: null,
    pincode: null,
    city: null,
    state: null
  }
};
const initAssetsState = {
  typeOfColletralList: [],
  usageList: [],
  ownerList: [],
  saveForm: false,
  addCollateralLoading: false,
  selectedCollateral: "",
  ownerNameCount: 1,
  selectedCollateralResponse: ""
};
const GetCityAndStateByPincode = (pincode, formState, formUseState) => {
  console.log("formState", formState);
  getCityAndStateByPincode(pincode).then(res => {
    if (res.error) {
      return;
    }
    if (res.data.error) {
      //te(res.data.message);
      // formUseState({
      //   ...formState,
      //   city: "",
      //   state: "",
      //   errors: { ...formState.errors, pincode: "Please enter valid pincode" }
      // });
      if (pincode.length == 6) {
        formUseState({
          ...formState,
          errors: { ...formState.errors, pincode: "Please enter valid pincode" }
        });
      }
      // else {
      //   formUseState({
      //     errors: { ...formState.errors }
      //   });
      // }
    } else {
      ts(res.data.message);
      formUseState({
        ...formState,
        city: res.data.data[0].city_nm,
        state: res.data.data[0].state_nm,
        errors: { ...formState.errors }
      });
    }
  });
};

const GetUsageByCollateral = (value, stateData, setState) => {
  postGetUsageByCollateral(value).then(res => {
    if (res.error) {
      return;
    }
    if (res.data.error) {
      te(res.data.message);
    } else {
      setState({ ...stateData, usageList: res.data.data });
    }
  });
};
const DetailForm1 = props => {
  const settings = {
    focusOnSelect: true,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500
  };
  let [formState, formUseState] = useState({ ...cloneDeep(inItForm) });
  let [stateData, setState] = useState({
    ...cloneDeep(initAssetsState)
  });
  let {
    typeOfColletralList,
    usageList,
    ownerList,
    addCollateralLoading,
    saveForm,
    selectedCollateral,
    selectedCollateralResponse,
    ownerNameCount
  } = stateData;
  let { collateralDetail, mainlApplicant, GetCollateralDetail, match } = props;

  let {
    ownerName,
    typeOfColletral,
    subType,
    usage,
    addressLine1,
    addressLine2,
    pincode,
    city,
    state,
    errors,
    colletralRemarks,
    usageRemarks
  } = formState;
  const onInputChange = (name, value, error = undefined, id = "") => {
    formState[name] = value;
    if (name == "typeOfColletral") {
      formState["usage"] = "";
      if (value == "OTHERS") {
        //alert(error)
        delete formState.usageRemarks;
        delete formState.errors.usageRemarks;
        formState.colletralRemarks = "";
        formState.errors = { ...formState.errors, colletralRemarks: null };
      } else {
        delete formState.colletralRemarks;
        delete formState.errors.colletralRemarks;
        delete formState.usageRemarks;
        delete formState.errors.usageRemarks;
      }
    }
    if (name == "usage") {
      if (value == "Others") {
        formState.usageRemarks = "";
        formState.errors = { ...formState.errors, usageRemarks: null };
      } else {
        delete formState.usageRemarks;
        delete formState.errors.usageRemarks;
      }
    }
    if (error !== undefined) {
      //let { errors } = formState;
      errors[name] = error;
      //console.log("----", name, errors, error);
    }

    formUseState({ ...formState, errors: { ...errors } });
  };
  // handle validation
  const onInputValidate = (name, error) => {
    let { errors } = formState;
    errors[name] = error;
    formUseState({ ...formState, errors: { ...errors } });
  };

  useEffect(() => {
    GetOwnerName(match.params.leadcode);
  }, [ownerList.length == 0]);

  useEffect(() => {
    GetTypeOfCollateral();
  }, [typeOfColletralList.length == 0]);

  const GetOwnerName = leadCode => {
    postGetOwnerName(leadCode).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        console.log("Owner", stateData);
        setState({ ...stateData, ownerList: res.data.data });
      }
    });
  };
  const GetTypeOfCollateral = () => {
    postGetTypeOfCollateral().then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
      } else {
        console.log("COll", stateData);
        setState({ ...stateData, typeOfColletralList: res.data.data });
      }
    });
  };
  const AddOwner = res => {
    stateData.ownerNameCount += 1;
    setState({ ...stateData });
  };
  const AddCollateralDetail = () => {
    setState({ ...stateData, addCollateralLoading: true });
    let objForm = cloneDeep(formState);
    delete objForm.errors;
    objForm.leadCode = match.params.leadcode;
    objForm.createdDate = new Date();
    objForm.updatedDate = new Date();
    objForm.createdBy = localStorage.getItem("employeeId");
    objForm.updatedBy = localStorage.getItem("employeeId");
    objForm.ipaddress = null;
    if(stateData.collateralRef)
    {
      objForm.collateralRef=stateData.collateralRef
    }
    postAddCollateralDetail(objForm).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        te(res.data.message);
        setState({
          ...stateData,
          addCollateralLoading: false,
          saveForm: false
        });
      } else {
        ts(res.data.message);
        GetCollateralDetail(match.params.leadcode);
        setState({
          ...stateData,
          // selectedCollateralResponse: res.data.data,
          addCollateralLoading: false,
          saveForm: true
        });
        ChangeCollateral(res.data.data)
      }
    });
  };
  const AddAnotherCollateral = () => {
    formUseState({ ...cloneDeep(inItForm) });
    setState({ ...cloneDeep(initAssetsState) });
  };
  const ChangeCollateral = async (response, id) => {
    stateData.selectedCollateral = response.id;
    if (response.id) {
      stateData.collateralRef=response.collateralRef?response.collateralRef:""
      formState.id = response.id;
      stateData.saveForm = true;
      stateData.selectedCollateralResponse = response;
    }
    setState({ ...stateData });
    Object.keys(formState).map(res => {
      if (response[res]) {
        if (res == "typeOfColletral") {
          GetUsageByCollateral(response[res], stateData, setState);
          if (response[res] == "OTHERS") {
            formState.colletralRemarks = response.colletralRemarks;
            formState.errors.colletralRemarks = null;
          } else {
            delete formState.colletralRemarks;
            delete formState.errors.colletralRemarks;
          }
        }
        if (res == "usage") {
          if (response.usage === "Others") {
            formState.usageRemarks = response.usageRemarks;
            formState.errors.usageRemarks = null;
          } else {
            delete formState.usageRemarks;
            delete formState.errors.usageRemarks;
          }
        }
        formState[res] = response[res];
      }
    });
    formUseState({
      ...formState
    });
  };
  let AddOwnerHtml = [];
  // for (let i = 0; i < ownerNameCount; i++) {
  //   AddOwnerHtml.push(
  //     <>
  //       <Select
  //         className="w-100 fs-12 create-lead-form-select  "
  //         title={`Owner name ${i}`}
  //         name="ownerName"
  //         error={errors.ownerName[i]}
  //         value={ownerName[i]}
  //         isReq={true}
  //         onChangeFunc={(name, value, error) => {
  //           onInputChange(name, value, error, i);
  //         }}
  //         validationFunc={onInputValidate}
  //         options={ownerList}
  //         filter={ownerName}
  //         labelKey="customerName"
  //         valueKey="customerName"
  //       />
  //       {/* <span className="text-primary text-right float-right">- Delete</span> */}
  //     </>
  //   );
  // }
  let DetailFormStatus = false;
  let CheckForm = Object.keys(formState).filter(res => {
    if (
      res != "errors" &&
      res != "subType" &&
      res != "addressLine2" &&
      res != "colletralCode" &&
      !formState[res]
    )
      return res;
  });
  let formStatus = getFormDetails(formState, () => {});
  if (CheckForm.length == 0 && formStatus) {
    DetailFormStatus = true;
  }

  return (
    <>
      <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
        <div className="container">
          <div class="d-flex justify-content-start align-items-center">
            <section class="py-4 position-relative bg_l-secondary w-100 ">
              <div class="pb-5 bg-white">
                <div className="row">
                  <div className="col-lg-12 mt-3 ">
                    <span className="font-weight-bold text-primary ml-5 mt-3">
                      {" "}
                      {mainlApplicant && mainlApplicant.firmName ? mainlApplicant.firmName : mainlApplicant.customerName}{" "}
                    </span>
                    <span className=" text-primary ml-3 mt-3">
                      {" "}
                      ({mainlApplicant && mainlApplicant.typeOfEntity})
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 mt-3 ml-3 ">
                    <div className="ml-4">
                      <Slider {...settings}>
                        {collateralDetail.map(res => {
                          return (
                            <div className="pl-2 pr-2">
                              <button
                                disabled={addCollateralLoading}
                                className={`btn btn-secondary d-flex justify-content-center w-100 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 ${res.id ==
                                  selectedCollateral && "btn-green"}`}
                                onClick={() => {
                                  ChangeCollateral(res, res.id);
                                }}
                              >
                                {res.colletralCode}
                              </button>
                            </div>
                          );
                        })}
                      </Slider>
                    </div>
                  </div>
                  {saveForm && (
                    <div
                      className="col-lg-3 mt-4 ml-3 text-primary float-right text-right  font-weight-bold"
                      onClick={AddAnotherCollateral}
                    >
                      <span>+ Add another Collateral</span>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-lg-6 mt-3 ml-5 ">
                    <span className="text-secondary font-weight-bold">
                      Collateral details
                    </span>
                  </div>
                </div>
                <div className="collateral-detail-page">
                  <div className="row ">
                    <div className="col-lg-6 mt-3 mt-3 ">
                      <div className="row mt-3">
                        <div className="col-lg-3">
                          <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                            Owner name
                          </label>
                        </div>
                        <div className="col-lg-6 ">
                          {saveForm ? (
                            <>
                              {ownerName.split(",").map(res => {
                                return (
                                  <>
                                    {" "} 
                                    <span>{ownerList.filter(response=>response.cif.includes(res)).length>0&&ownerList.filter(response=>response.cif.includes(res))[0].customerName}, </span>
                                    <br />
                                  </>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              {" "}
                              <Select
                                className="w-100 fs-12 create-lead-form-select  "
                                title={`Owner name `}
                                name="ownerName"
                                error={errors.ownerName}
                                value={ownerName}
                                isReq={true}
                                onChangeFunc={(name, value, error) => {
                                  onInputChange(name, value, error);
                                }}
                                validationFunc={onInputValidate}
                                options={ownerList}
                                filter={ownerName}
                                labelKey="customerName"
                                valueKey="cif"
                                isMulti={true}
                              />
                            </>
                          )}
                        </div>
                        {/* {!saveForm && ownerNameCount < ownerList.length && (
                          <div className="col-lg-3 p-0">
                            <div
                              className="text-primary font-weight-bold mt-2"
                              onClick={() => {
                                AddOwner();
                              }}
                            >
                              {" "}
                              + Add another
                            </div>
                          </div>
                        )} */}
                      </div>

                      <div className="row">
                        <div className="col-lg-3">
                          <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                            Type of Collateral
                          </label>
                        </div>
                        <div className="col-lg-6">
                          {saveForm ? (
                            typeOfColletral
                          ) : (
                            <Select
                              className="w-100 fs-12 create-lead-form-select "
                              title="Type of Collateral"
                              options={typeOfColletralList}
                              value={typeOfColletral}
                              error={errors.typeOfColletral}
                              name="typeOfColletral"
                              isReq={true}
                              onChangeFunc={(name, value, error) => {
                                onInputChange(name, value, error);
                                if (value) {
                                  GetUsageByCollateral(
                                    value,
                                    stateData,
                                    setState
                                  );
                                } else {
                                  setState({ ...stateData, usageList: [] });
                                }
                              }}
                              validationFunc={onInputValidate}
                              labelKey="collatral_desc"
                              valueKey="collatral_type"
                            />
                          )}
                        </div>
                      </div>
                      {colletralRemarks != undefined && (
                        <div className="row">
                          <div className="col-lg-3">
                            <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                              Collateral Remarks
                            </label>
                          </div>
                          <div className="col-lg-6  word-break-all">
                            {saveForm ? (
                              colletralRemarks
                            ) : (
                              <TextArea
                                name="colletralRemarks"
                                error={errors.colletralRemarks}
                                onChangeFunc={onInputChange}
                                validationFunc={onInputValidate}
                                value={colletralRemarks}
                                isReq={true}
                                title="Other Remarks"
                                maxLength="200"
                              />
                            )}
                          </div>
                        </div>
                      )}
                      <div className="row">
                        <div className="col-lg-3">
                          <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                            Sub-Type
                          </label>
                        </div>
                        <div className="col-lg-6">
                          {saveForm ? (
                            subType
                          ) : (
                            <Input
                              className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2 w-100  "
                              placeholder="Sub-type"
                              title="Sub-type"
                              reqType="onlyCharacter"
                              value={subType}
                              name="subType"
                              error={errors.subType}
                              //isReq={true}
                              name="subType"
                              //reqType="onlyCharacter"
                              onChangeFunc={(name, value, error) => {
                                if (value.match(/^[a-zA-Z\s]*$/)) {
                                  onInputChange(name, value, error);
                                }
                              }}
                              validationFunc={onInputValidate}
                            />
                          )}
                        </div>
                      </div>
                      <div className="row  mt-3">
                        <div className="col-lg-3">
                          <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                            Usage
                          </label>
                        </div>
                        <div className="col-lg-6">
                          {saveForm ? (
                            usage
                          ) : (
                            <Select
                              className="w-100 fs-12 create-lead-form-select "
                              title="Usage"
                              options={usageList}
                              value={usage}
                              name="usage"
                              isReq={true}
                              labelKey="usage"
                              valueKey="usage"
                              onChangeFunc={onInputChange}
                              validationFunc={onInputValidate}
                              error={errors.usage}
                            />
                          )}
                        </div>
                      </div>
                      {usageRemarks != undefined && (
                        <div className="row  mt-3">
                          <div className="col-lg-3">
                            <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                              Usage Remarks
                            </label>
                          </div>
                          <div className="col-lg-6 word-break-all">
                            {saveForm ? (
                              usageRemarks
                            ) : (
                              <TextArea
                                name="usageRemarks"
                                error={errors.usageRemarks}
                                onChangeFunc={onInputChange}
                                validationFunc={onInputValidate}
                                value={usageRemarks}
                                isReq={true}
                                title="Usage Remarks"
                                maxLength="200"
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {saveForm && (
                        <div className="row  mt-3">
                          <div className="col-lg-3">
                            <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                              Address
                            </label>
                          </div>
                          <div className="col-lg-6">
                            {`${addressLine1}${addressLine2 &&
                              " ," + addressLine2},${pincode},${city},${state}`}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6 mt-3 mt-3 ">
                      {!saveForm && (
                        <>
                          <div className="row mt-3">
                            <div className="col-lg-3">
                              <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                                Address
                              </label>
                            </div>
                            <div className="col-lg-6 ">
                              {saveForm ? (
                                `${addressLine1}${addressLine2 &&
                                  " ," + addressLine2}`
                              ) : (
                                <>
                                  <Input
                                    className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2 w-100 mt-2  "
                                    placeholder="Apartment no/wing/Building name"
                                    title="Address"
                                    //reqType="address"
                                    maxLength="100"
                                    isReq={true}
                                    onChangeFunc={onInputChange}
                                    validationFunc={onInputValidate}
                                    value={addressLine1}
                                    name="addressLine1"
                                    error={errors.addressLine1}
                                  />
                                  <Input
                                    className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2 w-100 mt-2  "
                                    placeholder="Address line 1"
                                    title="Address"
                                    //reqType="address"
                                    maxLength="100"
                                    //isReq={true}
                                    value={addressLine2}
                                    onChangeFunc={onInputChange}
                                    validationFunc={onInputValidate}
                                    name="addressLine2"
                                    error={errors.addressLine2}
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-3">
                              <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                                Pincode
                              </label>
                            </div>
                            <div className="col-lg-6">
                              {saveForm ? (
                                pincode
                              ) : (
                                <Input
                                  className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2 w-100 mt-2  "
                                  placeholder="Pincode"
                                  title="Pincode"
                                  maxLength="100"
                                  onChangeFunc={onInputChange}
                                  validationFunc={(name, error) => {
                                    onInputValidate(name, error);
                                    if (pincode)
                                      GetCityAndStateByPincode(
                                        pincode,
                                        formState,
                                        formUseState
                                      );
                                  }}
                                  value={pincode}
                                  name="pincode"
                                  error={errors.pincode}
                                  isReq={true}
                                  maxLength="6"
                                  minLength="6"
                                  reqType="number"
                                />
                              )}
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-3">
                              <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                                City
                              </label>
                            </div>
                            <div className="col-lg-6">
                              {saveForm ? (
                                city
                              ) : (
                                <Input
                                  disabled
                                  className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2 w-100 mt-2  "
                                  placeholder="City"
                                  title="City"
                                  reqType="address"
                                  maxLength="100"
                                  value={city}
                                />
                              )}
                            </div>
                          </div>
                          <div className="row  mt-3">
                            <div className="col-lg-3">
                              <label className="fs-14 mb-0 gTextPrimary fw-500 mt-7">
                                State
                              </label>
                            </div>
                            <div className="col-lg-6">
                              {saveForm ? (
                                state
                              ) : (
                                <Input
                                  disabled
                                  className="form-control border-rounded-pill fs-12 p-2 pl-4 pr-2 w-100 mt-2  "
                                  placeholder="State"
                                  title="State"
                                  reqType="address"
                                  maxLength="100"
                                  value={state}
                                />
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {!saveForm && (
                        <div className="row mt-3 mr-3">
                          <div className="col-sm-12">
                            <div className="text-right">
                              {!saveForm && selectedCollateral ? (
                                <button
                                  className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                                  onClick={() => {
                                    ChangeCollateral(
                                      selectedCollateralResponse,
                                      selectedCollateralResponse.id
                                    );
                                  }}
                                >
                                  Cancel
                                </button>
                              ) : (
                                <Link
                                  to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}
                                >
                                  <button
                                    className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                                    // onClick={() => {
                                    //   ChangeCollateral(
                                    //     selectedCollateralResponse,
                                    //     selectedCollateralResponse.id
                                    //   );
                                    // }}
                                  >
                                    Cancel
                                  </button>
                                </Link>
                              )}
                              <button
                                disabled={
                                  !DetailFormStatus || addCollateralLoading
                                }
                                onClick={() => {
                                  if (saveForm) {
                                    setState({ ...stateData, saveForm: false });
                                  } else {
                                    AddCollateralDetail();
                                  }
                                }}
                                className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16  ${DetailFormStatus &&
                                  "btn-green"}`}
                              >
                                {saveForm
                                  ? "Edit"
                                  : addCollateralLoading
                                  ? "Saving..."
                                  : "Save"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {saveForm && (
                  <div className="row mt-3 mr-5 pr-3">
                    <div className="col-sm-12">
                      <div className="text-right">
                        {!saveForm && selectedCollateral ? (
                          <button
                            className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                            onClick={() => {
                              ChangeCollateral(
                                selectedCollateralResponse,
                                selectedCollateralResponse.id
                              );
                            }}
                          >
                            Cancel
                          </button>
                        ) : (
                          <Link
                            to={`${public_url.co_applicant_status}/${props.match.params.leadcode}`}
                          >
                            <button
                              className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 btn-green"
                              // onClick={() => {
                              //   ChangeCollateral(
                              //     selectedCollateralResponse,
                              //     selectedCollateralResponse.id
                              //   );
                              // }}
                            >
                              Cancel
                            </button>
                          </Link>
                        )}
                        <button
                          disabled={!DetailFormStatus || addCollateralLoading}
                          onClick={() => {
                            if (saveForm) {
                              setState({ ...stateData, saveForm: false });
                            } else {
                              AddCollateralDetail();
                            }
                          }}
                          className={`btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16  ${DetailFormStatus &&
                            "btn-green"}`}
                        >
                          {saveForm
                            ? "Edit"
                            : addCollateralLoading
                            ? "Saving..."
                            : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <hr class="bg_lightblue border-0 h-1px" />
                <div className="row mt-3 mr-5">
                  <div className="col-sm-12">
                    <div className="text-right">
                      {/* <div>
                        <span className=" mr-5 mt-2  text-primary">
                          Collateral Total :{" "}
                        </span>
                        <span className=" mr-5 mt-2 text-green ">
                          123456789{" "}
                        </span>
                      </div> */}
                      {collateralDetail && collateralDetail.length > 0 && (
                        <Link
                          to={`${public_url.insurance_detail}/${match.params.leadcode}`}
                        >
                          <button className="btn btn-secondary btn-rounded ls-1 cursor-pointer fs-16 mr-3 mt-2 btn-green">
                            Next
                          </button>
                        </Link>
                      )}
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
export const DetailForm = withRouter(DetailForm1);
