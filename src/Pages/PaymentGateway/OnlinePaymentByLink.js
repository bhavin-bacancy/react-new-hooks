import React from "react";
import {
    postConsumerData,
    postResPaymentGateway,
  } from "../../Utility/Services/Payment";
import { postLeadDetail } from "../../Utility/Services/QDE";
import { public_url } from "../../Utility/Constant";
import { withRouter } from "react-router-dom";
import { cloneDeep } from "lodash";

let initForm = {
  cif: "",
  mobileNumber: "",
  emailid: ""
};
class OnlinePaymentByLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leadDetail: cloneDeep(initForm),
    };
  }

  GetLeadDetail = () => {
    let { match } = this.props;
    let { params } = match;
    postLeadDetail(params.leadcode, params.mobileno).then(res => {
      let sendDataForsms = { 
          mobileNumber: res.data.data.mobileNumber,
          leadCode: res.data.data.leadCode,
          customerName: res.data.data.customerName,
          cif: res.data.data.cif
      }
      if (res.error) return;
      this.setState({ leadDetail: res.data.data, sendDataForsms: sendDataForsms },()=>{this.GetPayment()});
    });
  };

  componentDidMount() {
    this.GetLeadDetail();
    // let { leadDetail, sendDataForsms } = this.state;
    // let { match } = this.props;
    // let { params } = match;
    // this.setState({ loading: true, paymentResponseMsg: "" });
  };

  GetPayment = () =>{
    let { leadDetail, sendDataForsms } = this.state;
    let { match } = this.props;
    let { params } = match;
    this.setState({ loading: true, paymentResponseMsg: "" });
    postConsumerData({ 
      cif: leadDetail.cif,
      mobileNumber: leadDetail.mobileNumber,
      emailid: leadDetail.emailid}
    ).then(res => {
      var sendData = {
        cif: res.data && res.data.data.cif,
        lan: params && params.refrencenumber,
        // emailId: leadDetail.emailid
      }
      var getData = {
        amount: res.data && res.data.data.amount,
        cif: res.data && res.data.data.cif,
        deviceId: res.data && res.data.data.deviceId,
        emailId: res.data && res.data.data.emailId,
        merchantId: res.data && res.data.data.merchantId,
        mobileNumber: res.data && res.data.data.mobileNumber,
        returnUrl: res.data && res.data.data.returnUrl,
        token: res.data && res.data.data.token,
        txnId: res.data && res.data.data.txnId
      };
      // console.log(getData)
      // return
      if (res.error) {
        this.setState({ loading: false});
        return;
      } else {
        this.setState({getData:getData, senfMobileNumber:res.data.data.mobileNumber, sendData: sendData})
        var configJson = {
          tarCall: false,
          features: {
            showPGResponseMsg: true,
            enableExpressPay: false,
            enableAbortResponse: true,
            enableNewWindowFlow: true
          },
          consumerData: {
            deviceId: res.data.data.deviceId,
            token: res.data.data.token,
            // 'returnUrl': 'http://localhost:3000/payment_methods',    //merchant response page URL
            responseHandler: res => {
              let spllitData = res.stringResponse.split("|");
              let pgRes = {
                tpsl_txn_time: spllitData[8],
                tpsl_txn_id: spllitData[3],
                clnt_rqst_meta: spllitData[7],
                id: spllitData[10],
                txn_status: spllitData[0],
                hash: spllitData[15],
                token: spllitData[14],
                txn_msg: spllitData[1],
                amount : spllitData[6],
                cif: sendData.cif,
                lan: sendData.lan
              };

              if (
                typeof res != "undefined" &&
                typeof res.paymentMethod != "undefined" &&
                typeof res.paymentMethod.paymentTransaction != "undefined" &&
                typeof res.paymentMethod.paymentTransaction.statusCode !=
                  "undefined" &&
                res.paymentMethod.paymentTransaction.statusCode == "0300"
              ) {
                postResPaymentGateway(pgRes).then(res => {
                  if (res.error) {
                    return;
                  }
                  this.props.history.push(`${public_url.payment_completed}/${match.params.leadcode}/${match.params.refrencenumber}`);
                });
                // success block
              } else if (
                typeof res != "undefined" &&
                typeof res.paymentMethod != "undefined" &&
                typeof res.paymentMethod.paymentTransaction != "undefined" &&
                typeof res.paymentMethod.paymentTransaction.statusCode !=
                  "undefined" &&
                res.paymentMethod.paymentTransaction.statusCode == "0398"
              ) {
                // initiated block
                alert("initiated block");
              } else {
                this.setState({
                  paymentResponseMsg:
                    "Your transaction cancel please try again later..!"
                });
                // error block
                postResPaymentGateway(pgRes).then(res => {
                  if (res.error) {
                    return;
                  }
                });
              }
            },
            paymentMode: "all",
            merchantLogoUrl:
              "https://www.paynimo.com/CompanyDocs/company-logo-md.png",
            merchantId: res.data.data.merchantId,
            currency: "INR",
            consumerId: res.data.data.cif,
            consumerMobileNo: res.data.data.mobileNumber,
            consumerEmailId: res.data.data.emailId,
            txnId: res.data.data.txnId,
            items: [
              {
                itemId: "FIRST",
                // 'itemId': 'test',
                amount: res.data.data.amount,
                comAmt: "0"
              }
            ],
            customStyle: {
              PRIMARY_COLOR_CODE: "#3977b7",
              SECONDARY_COLOR_CODE: "#FFFFFF",
              BUTTON_COLOR_CODE_1: "#1969bb",
              BUTTON_COLOR_CODE_2: "#FFFFFF"
            }
          }
        };
        if (window.$) {
          window.$.pnCheckout(configJson);
          if (configJson.features.enableNewWindowFlow) {
            // window.$.pnCheckoutShared.openNewWindow();
          }
        }
      }
    });
  }

  render() {
    return (
      <React.Fragment>
          <div className="blankpage_footer">
           
          </div>
      </React.Fragment>
    );
  }
}

export default withRouter(OnlinePaymentByLink);
