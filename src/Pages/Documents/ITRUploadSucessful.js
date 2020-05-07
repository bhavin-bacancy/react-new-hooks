import React from "react";
import { withRouter,Link } from "react-router-dom";
import { public_url } from "../../Utility/Constant";

class ITRUploadSucessful extends React.Component {
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
                <section className="py-5 dashboard_div bg_l-secondary">
                    <div className="container">
                        <div className="bg-white p-4 text-center my-5">
                            <>
                                <div className="p-4 text-center my-4">
                                    <span className="colorGreen fa fa-check text-blue fs-50 mb-3"></span>
                                    <div className="text-align-center colorGreen fs-25 font-weight-bold"> Verification Done </div>
                                    <div className="text-align-center colorGreen fs-14 font-weight-bold">  </div>
                                </div>
                            </>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        );
    }
}
export default withRouter(ITRUploadSucessful);
