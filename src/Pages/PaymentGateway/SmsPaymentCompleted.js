import React from "react";
import BreadCrumbsPayment from "./BreadCrumbsPayment";
import { withRouter } from "react-router-dom";
import { public_url } from "../../Utility/Constant";
import { Link } from "react-router-dom"
class SmsPaymentCompleted extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		let { match } = this.props;
		let { params } = match;
		return (
			<React.Fragment>
				<div className="backToDashboard py-3 d-none d-xl-block">
					<div className="container-fluid">
						<Link to={public_url.lead_list}>Home</Link>
					</div>
				</div>
				<BreadCrumbsPayment />
				<section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
					<div className="container">
						<div className="bg-white p-md-4 p-3 text-center mt-5">
							<div className="text-primary fw-400 fs-18 font-weight-bold mr text-left mb-4">
								Growth source processing fees
              </div>
							<>
								{/* <div className="d-flex flex-wrap border p-3 justify-content-md-around mb-3">
                  <div className="row d-flex justify-content-center w-100 text-left">
                    <div className="col-md-6 py-lg-3 pr-lg-4 text-align-center">
                      <div className="bg-white ">
                        <span className="colorGreen fa fa-check text-blue fs-50 mb-3"></span>
                        <div className="text-align-center colorGreen fs-25 font-weight-bold">
                          {" "}
                          Payment received
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
								<div className="bg-white p-4  border text-center my-5">
									<>
										<div className="p-4 text-center my-4">
											<span className="colorGreen fa fa-check text-blue fs-50 mb-3"></span>
											<div className="text-align-center colorGreen fs-25 font-weight-bold">  Payment received </div>
											<div className="text-align-center colorGreen fs-14 font-weight-bold">  </div>
										</div>
									</>
								</div>

								<div className="text-sm-right w-100 d-flex justify-content-end">
									<Link to={`${public_url.documents}/${match.params.leadcode}/${match.params.refrencenumber}`}>
										<button
											className="btn btn-secondary btn-green mr-3 text-white btn-rounded fs-16 py-2 mb-md-0 mb-2 d-none d-xl-block"
										>
											Next
                  </button>
									</Link>
								</div>
							</>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}
export default withRouter(SmsPaymentCompleted);
