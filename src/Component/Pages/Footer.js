import React from "react";
import { public_url } from "../../Utility/Constant";

export default class Footer extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <React.Fragment>
        <footer class="py-3">
          <div class="container-fluid">
            <div class="row">
              <div class="col-xl-4 col-lg-12 text-center text-xl-left mt-3 mt-xl-0">
                <h3 class="text-white fw-400 fs-16 px-2"> Growth Source </h3>
                <hr />
                <ul class="d-flex justify-content-center justify-content-xl-start">
                  <li>
                    {" "}
                    <a href={public_url.about_us} target="_blank" class="fs-12">
                      {" "}
                      About Us{" "}
                    </a>
                  </li>
                  <li>
                    {" "}
                    <a
                      href={public_url.contact_us}
                      target="_blank"
                      class="fs-12"
                    >
                      {" "}
                      Contact Us{" "}
                    </a>
                  </li>
                  <li>
                    {" "}
                    <a
                      href={public_url.term_and_condition}
                      target="_blank"
                      class="fs-12"
                    >
                      {" "}
                      Terms & Conditions{" "}
                    </a>
                  </li>
                  <li>
                    {" "}
                    <a href="javascript:;" class="fs-12">
                      {" "}
                      Careers{" "}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-xl-4 col-lg-12 text-center text-xl-left mt-3 mt-xl-0">
                <h3 class="text-white fw-400 fs-16 px-2"> Stay Connected </h3>
                <hr />
                <ul class="d-flex align-items-center justify-content-center justify-content-xl-start">
                  <li className="d-flex align-items-center">
                    {" "}
                    <a href="javascript:;" class="fs-12">
                      <i class="fa fa-facebook text-white "></i> Facebook{" "}
                    </a>
                  </li>
                  <li className="d-flex align-items-center">
                    {" "}
                    <a href="javascript:;" class="fs-12">
                      <i class="fa fa-twitter text-white "></i> Twitter{" "}
                    </a>
                  </li>
                  <li className="d-flex align-items-center">
                    {" "}
                    <a href="javascript:;" class="fs-12">
                      <i class="fa fa-instagram text-white "></i> Instagram{" "}
                    </a>
                  </li>
                  <li className="d-flex align-items-center">
                    {" "}
                    <a href="javascript:;" class="fs-12">
                      <i class="fa fa-youtube-play text-white "></i> YouTube{" "}
                    </a>
                  </li>
                </ul>
              </div>
              <div class="col-xl-4 col-lg-12 text-center text-xl-left mt-3 mt-xl-0">
                <h3 class="text-white fw-400 fs-16 px-2"> Help and Support </h3>
                <hr />
                <ul class="d-flex flex-wrap justify-content-center justify-content-xl-start">
                  <li>
                    {" "}
                    <a href={public_url.disclaimer} target="_blank" class="fs-12">
                      {" "}
                      Disclaimer{" "}
                    </a>
                  </li>
                  <li>
                    {" "}
                    <a href={public_url.privacy_policy} target="_blank" class="fs-12">
                      {" "}
                      Privacy policy{" "}
                    </a>
                  </li>
                  <li>
                    {" "}
                    <a href={public_url.copyright_policy} target="_blank" class="fs-12">
                      {" "}
                      Copyright policy{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="row text-center mt-5 mb-2">
              <div class="col-md-12">
                <p class="mb-0 text-white fs-12">
                  Copyright &copy; Growth Source 2019, All Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}
