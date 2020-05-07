import React from "react";
import {Link} from "react-router-dom"
import { cloneDeep } from "lodash";
const initForm = {
  aadharNumber: "",
  ekyctype: "",
  leadCode: "LAP-0057",
  file: [],
  fileType: "",
  errors: { aadharNumber: null, ekyctype: null, file: null, fileType: null }
};
export default class AdharDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      adharOpen: true,
      form: cloneDeep(initForm)
    };
  }
  adharOpen = () => {
    let { adharOpen } = this.state;
    this.setState({ adharOpen: !adharOpen });
  };
  componentDidMount() {
    let { form } = this.state;
    let { leadDetail } = this.props;
    if (leadDetail && leadDetail.document && leadDetail.document.length > 0) {
      leadDetail.document.map(res => {
        let splitArray = res.documentPath.split("/");
        let path = "";
        splitArray.map((folder, index) => {
          if (folder != "var" && (folder != "www") & (folder != "html")) {
            if (index + 1 != splitArray.length) {
              path += folder + "/";
            } else {
              path += folder;
            }
          }
        });
        form.file.push("http://35.154.202.170" + path);
      });
    }

    this.setState({ form: { ...this.state.form, ...this.props.leadDetail } });
  }

 forceDownload=(url, fileName)=>{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function(){
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
  }
  xhr.send();
}
  render() {
    let { adharOpen, form } = this.state;
    let { ekyctype, aadharNumber, errors, file, fileType } = form;

    return (
      <React.Fragment>
        <div className="gAccordion">
          <div className="gAccordion__title" onClick={this.adharOpen}>
            <i class="icon">{adharOpen ? "-" : "+"}</i> Aadhaar Details
          </div>
          {adharOpen && (
            <div className="gAccordion__body pl-4">
              <div className="row mt-3 align-items-center">
                <div className="col-md-4 col-lg-2 d-flex align-items-center">
                  <label className="fs-14 mb-0 gTextPrimary fw-500">
                  Aadhaar No.
                  </label>
                </div>
                <div className="col-2 col-md-8 col-lg-3 mt-2 mt-lg-0 pr-2">
                  {aadharNumber}
                </div>
                <div className="col-md-4 col-lg-3 d-flex align-items-center">
                  <label className="fs-14 mb-0 gTextPrimary fw-500">
                    Uploded Document
                  </label>
                </div>
                {file.map((res,index) => {
                  return (
                    <div className="col-md-4 col-lg-2 ">
                      <img src={res} />
                      <br/>
                      <a href="Javascript:Void(0)" className="text-primary" onClick={()=>this.forceDownload(res,form.document[index].documentName)}>{form.document[index].documentName}</a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <hr class="bg_lightblue border-0 h-1px" />
        </div>
      </React.Fragment>
    );
  }
}
