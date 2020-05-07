import React from "react";
import { withRouter,Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";

class BankStatementUploadSuccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        let { match } = this.props;
        let { params } = match;
        return (
            <React.Fragment>
                {/* <div className="backToDashboard py-3">
                    <div className="container-fluid">
                        <Link to={public_url.lead_list}>Home</Link>
                    </div>
                </div> */}
                <section className="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
                    <div className="container">
                        <div className="bg-white p-md-4 p-3 text-center mt-5">
                            <>
                            <div className="bg-white p-4 text-center my-5">
                                <>          
                                    <div className="p-4 text-center my-4">
                                        <span className="colorGreen fa fa-check text-blue fs-50 mb-3"></span>
                                        <div className="text-align-center colorGreen fs-25 font-weight-bold"> Bank Statement Uploaded Successfully  </div>
                                        <div className="text-align-center colorGreen fs-14 font-weight-bold">  </div>
                                    </div>                                                                      
                                </>
                            </div>
                            </>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}
export default withRouter(BankStatementUploadSuccess);
