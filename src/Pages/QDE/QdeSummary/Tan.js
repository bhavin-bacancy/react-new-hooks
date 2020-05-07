import React, { useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import { API_URL } from "../../../Utility/Config";
import { withRouter } from "react-router-dom";

const initForm = {
  tanNumber: "",
  file: [],
  tanName: "",
  tanFileType: "",
  errors: { tanNumber: null, file: null, tanFileType: null }
};
const Tan = props => {
  const [state, setState] = useState({
    form: cloneDeep(initForm),
    tanOpen: true
  });
  let { leadDetail } = props;
  let { tanOpen, form } = state;
  let { file, tanNumber, tanFileType, tanName } = form;

  const tanOpenSection = () => {
    setState({ ...state, tanOpen: !tanOpen });
  };

  useEffect(() => {
    FormUpdate();
  }, [props.leadDetail]);

  const FormUpdate = () => {
    let { leadDetail } = props;
    let { form } = state;

    form.file = [];
    Object.keys(form).map(res => {
      if (leadDetail[res]) {
        form[res] = leadDetail[res];
      }
      if (res == "file") {
				leadDetail && leadDetail.tanDocumentPath &&
					form.file.push(leadDetail.tanDocumentPath);
			}
    });
    setState({
      form,
      saveForm: leadDetail.tanDetailsFlag ? true : false,
      tanDetailsFlag: leadDetail.tanDetailsFlag,
      tanOpen: true
    });
  };

  return (
    <>
      <div className="gAccordion">
        <div className="gAccordion__title" onClick={tanOpenSection}>
          <i class="icon">{tanOpen ? "-" : "+"}</i> TAN
        </div>
        {tanOpen && (
          <div className="gAccordion__body pl-4">
            <div className="row">
              <div className="col-md-4 col-lg-12 d-flex align-items-center"></div>
              <div className="col-md-8 col-lg-12 mt-2 mt-lg-0">
                <div className="row mt-3">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                      Tan No
                    </label>
                  </div>

                  <div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
                    {tanNumber}
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                      Tan Name
                    </label>
                  </div>
                  <div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
                    {tanName ? tanName : "-"}
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                      Uploaded Document Type
                    </label>
                  </div>
                  <div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
                    {tanFileType}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-4 col-lg-2 d-flex align-items-center">
                    <label className="fs-14 mb-0 gTextPrimary fw-500">
                      Uploaded Document
                    </label>
                  </div>
                  <div className="col-md-8 col-lg-5 mt-2 mt-lg-0">
                    {file.map((res, index) => {
                      let name = "";
                      if (res && typeof res == "object") {
                        var urlCreator = window.URL || window.webkitURL;
                        var imageUrl = urlCreator.createObjectURL(res);
                        name = res.name;
                      } else {
                        name = leadDetail && leadDetail.tanDocumentName;
                        imageUrl = res;
                      }
                      return (
                        <div className="row col-md-4 col-lg-12">
                          <div className="d-flex">
														<a
															href="Javascript:Void(0)"
															className="text-primary"
														>
                            {tanFileType === ".pdf" ? (
                              <img
                                style={{ width: "20px", marginRight: "10px" }}
                                src="/images/pdf-file.svg"
                              />
                            ) : (
                              <img
                                style={{ width: "20px", marginRight: "10px" }}
                                src="/images/photo.svg"
                              />
                            )}
                              {name}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <hr class="bg_lightblue border-0 h-1px" />
      </div>
    </>
  );
};
export default withRouter(Tan);
