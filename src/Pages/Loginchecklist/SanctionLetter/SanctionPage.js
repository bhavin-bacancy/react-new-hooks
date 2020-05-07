import React, { useState, useEffect } from "react";
import { public_url } from "../../../Utility/Constant";
import { Link, withRouter } from "react-router-dom";
import { BreadCrumbs } from "./BreadCrumbs";

export const SanctionPage = props => {
  console.log("creditflag",props.creditflag);
  return (
    <>
      <section class="px-2 px-md-5 pt-4 pb-5 dashboard_div bg_l-secondary">
        <div className="container">
          <div class="d-flex justify-content-start align-items-center">
            <section class="py-4 position-relative bg_l-secondary w-100 ">
              <div class="pb-5 bg-white">
                <div className="d-flex justify-content-center">
                  {/* <h3 className="text-green mt-5 pt-5"> Congratulations...!!!</h3> */}
                </div>
                <div className="d-flex justify-content-center mt-5">
                  <h4 className="mt-4 text-green">
                    {" "}
                    File has been moved to Credit queue
                  </h4>
                </div>
                <div className="row mt-5">
                  {props.creditflag && (
                    <div className="col-sm-12">
                      <div className="text-right">
                        <Link
                          to={`${public_url.sanction_letter}/${props.match.params.leadcode}`}
                        >
                          <button className="btn btn-secondary btn-rounded ls-1 cursor-pointer mr-0 fs-16 mr-5 btn-green">
                            Next
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};
