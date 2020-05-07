
import React from "react";
import { File } from "../../../Component/Input";
// import './Document.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { getApplicantbyLoan, getWrappedGstPanDetails, sendDdeLinkSms, checkDdeSmsStatus } from "../../../Utility/Services/Documents"
import { Link } from "react-router-dom";
import { public_url } from "../../../Utility/Constant";
import moment from "moment";
import { reducer } from "react-redux-toastr";
import { cloneDeep } from "lodash"
class CoApplicant extends React.Component {
    constructor() {
        super();
        this.state = {
            GSTOpen: false,
            error: null,
            // loanNumber: 'GS100LAP010753',
            loanNumber: 'GS100LAP010758',
            ddeType: 'gst',
            url: 'gstLink',
            isLoaded: false,
            items: [],
            loanData: '',
            panNumber: '',
            mainapplicantData: '',
            sendSmsData: '',
            status: '',
            smsDateTime: '',
            displayData: '',
            title: "Send",
            gstData: [],
            checkData: [],
            checkValue: true
        };
    }
    handleCheckChange = changeEvent => {
        let { checkData } = this.state
        if (changeEvent.target.checked) {
            this.setState({ checkData: checkData.push(changeEvent.target.value) });
        } else {
            checkData.splice(checkData.indexOf(changeEvent.target.value), 1)
            this.setState({ checkData: checkData });
        }
    };

    changeTitle = () => {
        this.setState({ title: "Resend" });
    }

    GSTOpen = () => {
        let { GSTOpen } = this.state;
        this.setState({ GSTOpen: !GSTOpen });
    };

    getApplicantbyLoan = () => {
        let { loanNumber } = this.state;
            //dont remove comments
        let { match } = this.props;
        let { params } = match;
        getApplicantbyLoan( params.refrencenumber).then(res => {
            const sendsms = cloneDeep(res.data.data)
            delete sendsms.coApplicantList
            const mainapplicantData = res && res.data && res.data.data
            let obj = {
                panNumber:  mainapplicantData.panNumber,
                // panNumber: 'AAPCA3085R',
                // dateOfBirth: "2015-11-26",
                dateOfBirth:  moment(mainapplicantData.dateOfBirth).format('YYYY-MM-DD'),
								mobileNumber: mainapplicantData.mobileNumber,
            }
            this.setState({ loanData: res.data.data, mainapplicantData: obj, sendSmsData: sendsms })
            getWrappedGstPanDetails(obj).then(res => {
                const displayData = res.data.data
                const exp = res.data.data.documentUploadGstDetailsDTO
                this.setState({ loading: false, gstData: exp, displayData: displayData });
                return;
            });
        });
    }

    // sendDdeLinkSms = () => {
    //     let { ddeType, url, sendSmsData } = this.state
    //     sendDdeLinkSms(ddeType, url, sendSmsData).then(res => {
    //         this.setState({
    //             smsData: res.data,
    //         });
    //         checkDdeSmsStatus(ddeType, sendSmsData).then(res => {
    //             this.setState({
    //                 smsDateTime: res.data.data.notification.timestamp,
    //                 status: res.data.message,
    //             });
    //         })
    //     });
    // }

    componentDidMount() {
        this.getApplicantbyLoan();
    }


    render() {
        let { GSTOpen, error, gstData, displayData, smsDateTime } = this.state;
        var dateString = smsDateTime;
        var date = dateString.slice(0,11)
        var time = dateString.slice(11,23);
        let data = this.props;
        let coApplicantData = data.sendData.data;
        // console.log("AHSIFHAJFAHSF", this.props)
        const columns = [
            {
                Header: "GSTIN",
                accessor: "gstin",
                headerClassName: "tableHeader text-left pl-3 fw-700",
                className: "tableCell d-flex align-items-center text-left pl-3 fw-700"
            },
            {
                Header: "Registered Address",
                accessor: "registeredAddress",
                headerClassName: "tableHeader text-left pl-3 fw-700",
                className: "tableCell d-flex align-items-center text-left pl-3 fw-700"
            },
            {
                Header: "Status",
                accessor: "status",
                headerClassName: "tableHeader text-left pl-3 fw-700",
                className: "tableCell d-flex align-items-center text-left pl-3 fw-700",
            },
            {
                Header: "Select to Send Link",
                accessor: "action",
                headerClassName: "tableHeader text-left pl-3 fw-700",
                className: "tableCell d-flex align-items-center text-left pl-3 fw-700",
                sortable: false,
                filterable: false,
                Cell: (original) => {
                    // {this.state.title === 'Resend' ? 'K' : 'Y'}
                    return (
                        <div class="custom-control custom-checkbox text-center ml-5">
                            {this.state.title === 'Resend' ? 
                                <>
                                <span className="text-primary">{this.state.status}</span> &nbsp;
                            <span className="text-primary">{ date && moment(date).format('DD/MM/YYYY')} 
                               &nbsp;  {time && moment(time,'hh:mm A').format('hh:mm A')}
                            </span>
                                    
                                </>
                            :
                            <>
                                <input
                                    type="checkbox"
                                    class="custom-control-input"
                                    // checked={this.state.checkData.includes(original.checkValue)}
                                    onChange={this.handleCheckChange}
                                    value={original.checkValue}
                                />
                                <span className="geekmark"></span>
                            </>
                            }
                        </div>
                    );
                }
            },
            {
                // Header: "",
                accessor: "send",
                headerClassName: "tableHeader text-left pl-3 fw-700",
                className: "tableCell d-flex align-items-center text-left pl-3 fw-700",
                Cell: row => {
                    return <div onClick={() => { this.sendDdeLinkSms(); this.changeTitle(); }}>{this.state.title}
                    </div>;
                },
            },
        ];

        return (
            <React.Fragment>
                <div className="p-3">
                    <div className="gAccordion__title" onClick={this.GSTOpen}>
                        <label class="mb-0 fw-700 text-primary2 colorGreen">
                            {GSTOpen ? "-" : "+"} GST verification
                    </label>
                    </div>
                    <br />
                    {GSTOpen && (
                        <React.Fragment>
                            <div className="col-md-4 col-lg-2 d-flex align-items-center">
                                <label className="fs-14 mb-0 fw-500">
                                    <span className="text-primary"> PAN :  </span>{coApplicantData.panNumber}
                                </label>
                            </div>
                            <div className="col-md-4 col-sm-4 col-xs-12">
                                <label className="fs-14 mb-0  fw-500">
                                    <span className="text-primary"> Registered Name: </span>{coApplicantData.registeredName}
                                </label>
                            </div>
                            <div className="col-md-4 d-flex align-items-center">
                                <label className="fs-14 mb-0  fw-500">
                                    <span className="text-primary"> Mobile Number : </span>{coApplicantData.mobileNumber}
                                </label>
                            </div>
                            <div className=" w-100 p-4">
                                <ReactTable
                                    data={gstData}
                                    columns={columns}
                                    defaultPageSize={10}
                                    showPagination={false}
                                    minRows={5}
                                />
                            </div>
                        </React.Fragment>
                    )}
                </div>
            </React.Fragment>
        );
    }
}
export default CoApplicant;