import React from "react";
import { postLeadList } from "../Utility/Services/Leads";
import { Input } from "../Component/Input";
import { public_url } from "../Utility/Constant";
import { Link } from "react-router-dom";
import EditLead from "../Component/Pages/EditLead";
import Pagination from "react-js-pagination";
//import "bootstrap/dist/css/bootstrap.min.css";
export default class ProspectList extends React.Component {
  constructor() {
    super();
    this.state = {
      leadList: [],
      searchTxt: "",
      leadListContainer: [],
      editLeadId: "",
      loading: true,
      perPage: 10,
      activePage: 1
    };
  }
  LeadList = () => {
    this.setState({ loading: true });
    let empID = localStorage.getItem("employeeId")
    postLeadList(empID).then(res => {
      if (res.error) {
        this.setState({ loading: false });
        return;
      }
      this.setState({
        leadList: res.data.data ? res.data.data : [],
        leadListContainer: res.data.data ? res.data.data : [],
        loading: false
      });
    });
  };
  componentDidMount() {
    this.LeadList();
    window.close();
  }
  search = (name, value) => {
    let { leadListContainer, loading } = this.state;
    this.setState({ [name]: value }, () => {
      let leadArray = [];
      // leadListContainer.map(res => {
      //   if (res.name && res.leadcode && res.emailid && res.mobileno) {
      //     if (
      //       res.name
      //         .toString()
      //         .toLowerCase()
      //         .match(value.toString().toLowerCase()) ||
      //       res.leadcode
      //         .toString()
      //         .toLowerCase()
      //         .match(value.toString().toLowerCase()) ||
      //       res.emailid
      //         .toString()
      //         .toLowerCase()
      //         .match(value.toString().toLowerCase()) ||
      //       res.mobileno.toString().match(value.toString())
      //     ) {
      //       leadArray.push(res);
      //     }
      //   }
      // });
      leadArray = leadListContainer.filter(res => {
        console.log(res.leadcode && typeof res.leadcode);
        if (
          (res.leadcode &&
            res.leadcode
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase())) ||
          res.name
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase()) ||
          res.emailid
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase()) ||
          res.mobileno
            .toString()
            .toLowerCase()
            .includes(value.toString().toLowerCase())
        )
          return res;
      });
      this.setState({
        leadList: value ? leadArray : leadListContainer,
        perPage: 10,
        activePage: 1
      });
    });
  };
  EditLead = id => {
    this.setState({ editLeadId: id });
  };
  Pagination = id => {
    var elmnt = document.getElementById("lead-list-container");
    elmnt.scrollTop = 0;
    this.setState({ activePage: id });
  };
  render() {
    let {
      leadList,

      loading,
      perPage,
      activePage
    } = this.props;
    let { searchTxt, editLeadId } = this.state;
    return (
      <React.Fragment>
        <div class="lead-list-container" id="lead-list-container">
          {loading && <h3>Loading...</h3>}
          {!loading && leadList.length == 0 && <h3>No result found</h3>}
          {leadList.map((res, index) => {
            if (
              index + 1 <= activePage * perPage &&
              index >= activePage * perPage - perPage
            )
              return (
                <React.Fragment>
                  {editLeadId == res.leadcode ? (
                    <EditLead
                      editLeadId={editLeadId}
                      EditLead={this.EditLead}
                      LeadList={this.LeadList}
                    />
                  ) : (
                    <React.Fragment>
                      <div class="row align-items-center border justify-content-between mb-2 ">
                        <div
                          class={`col-md-2 one bg_d-primary fs-18 text-white p-3 d-flex align-items-center justify-content-center align-self-stretch ${res.status ==
                            "Consent Approved" && "lead-approved"}`}
                        >
                          <p class="mb-0">CIF : {res.cif} </p>
                        </div>
                        <div class="col-md-8 two d-flex justify-content-between p-3 border-left border-right align-self-stretch">
                          <div className="word-break-all pr-3">
                            <h4 class="text-primary fw-600 fs-18 mb-1">
                              {res.firmName && res.firmName != "" ? res.firmName : res.custmername}
                            </h4>
                            <p class="text-primary mb-1 fs-14">
                              {res.mobilenumber}
                            </p>
                            <p class="text-primary fs-14 mb-0">{res.emailId}</p>
                            <p class="text-primary fs-14 mb-0">
                              {res.loan_number}
                            </p>
                            {/* <p class="text-primary fs-14 mb-0">{res.cif}</p> */}
                          </div>
                          <div class="d-flex flex-column flex-shrink-0">
                            <span class="fs-12">{res.updatedDate}</span>
                            {/* <span class="fs-12 text-right">12:10</span> */}
                          </div>
                        </div>
                        {/* <div
                          class={`col-md-1 three bg_d-primary p-3 d-flex align-items-center justify-content-center align-self-stretch  ${
                            res.status == "Consent Approved" ? "bg-success" : ""
                          }`}
                        >
                          {res.status == "Consent Approved" ? (
                            <p
                              class={`text-dark mb-0 fs-14 flex-wrap mb-0 overflow-auto`}
                            >
                              {res.status}
                            </p>
                          ) : (
                            <Link to={`${public_url.lead_con}/${res.leadcode}`}>
                              <p class={`text-white mb-0 fs-14 flex-wrap mb-0`}>
                                {res.status}
                              </p>
                            </Link>
                          )}
                        </div> */}

                        <div
                          class={`col-md-1 four bg_lightblue p-3 d-flex align-items-center justify-content-center align-self-stretch `}
                          //   onClick={() => {
                          //     if (res.status != "Consent Approved") {
                          //       this.EditLead(res.leadcode);
                          //     } else {
                          //       this.props.history.push(
                          //         `${public_url.update_profile}/${res.leadcode}/${res.mobileno}`
                          //       );
                          //     }
                          //   }}
                        >
                          <Link
                            to={{
                              pathname: `${public_url.co_applicant_status}/${res.leadCode}`,
                              state: { pathname: window.location.pathname }
                            }}
                            class="text-primary cursor-pointer"
                          >
                            {/* {res.status != "Consent Approved"
                              ? "EDIT"
                              : "Update Profile"}{" "} */}
                            Profile Completed
                          </Link>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              );
          })}
        </div>
      </React.Fragment>
    );
  }
}
