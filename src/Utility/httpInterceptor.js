import axios from "axios";
import { API_URL } from "./Config";
import { getToken, getServerValidation } from "./Helper";
import { te } from "./ReduxToaster";
export const get = (
  url,
  isPrivate = true,
  responseType = null,
  customUrl = false,
  headers
) => {
  let apiUrl = API_URL + url;
  if (customUrl) {
    apiUrl = url;
  }
  if (isPrivate && getToken()) {
    const isParam = apiUrl.includes("?");
    if (isParam) apiUrl = `${apiUrl}&&api_token=${getToken()}`;
    else apiUrl = `${apiUrl}?api_token=${getToken()}`;
  }
  const axiosObj = {
    method: "get",
    url: apiUrl
  };
  if (headers) {
    axiosObj.headers = headers;
  }
  if (responseType) axiosObj.responseType = responseType;
  return axios(axiosObj)
    .then(response => handleResponse(response))
    .catch(error => handleError(error));
};
export const post = (
  url,
  bodyObj = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
) => {
  const apiUrl = !uat ? API_URL + url : url;

  if (isPrivate && getToken()) {
    if (bodyObj instanceof FormData) bodyObj.append("api_token", getToken());
    else bodyObj.api_token = getToken();
  }
  if (mediaFile == true) {
    let formData = new FormData();
    Object.keys(bodyObj).map(key => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  return axios
    .post(apiUrl, bodyObj)
    .then(response => handleResponse(response))
    .catch(error => handleError(error));
};
const handleResponse = response => {
  return {
    error: false,
    data: response.data
  };
};
const handleError = error => {
  const { response } = error;
  let errorMsg = "Sorry, something went wrong. Please try again.";
  if (response && response.status === 422) {
    // handle server validation
    if (response.data && response.data.errors)
      errorMsg = getServerValidation(response.data.errors) || errorMsg;
    else if (response.data.message) errorMsg = response.data.message;
  } else if (response && response.status == 401) {
    // Unauthorized
    let element = document.getElementById("unauthorized-box");
    if (element) {
      element.style.display = "block";
      errorMsg = null;
    }
  }
  console.log("API ERROR ::: ", JSON.stringify(response));
  if (errorMsg) {
    te(errorMsg);
  }
  return {
    error: true,
    message: response ? response.data.message : null,
    status: response ? response.status : null
  };
};

export const awspost = (
  url,
  bodyObj = {},
  isPrivate = true,
  mediaFile = false,
  uat = false
) => {
  const apiUrl = !uat ? API_URL + url : url;

  if (isPrivate && getToken()) {
    if (bodyObj instanceof FormData) bodyObj.append("api_token", getToken());
    else bodyObj.api_token = getToken();
  }
  if (mediaFile == true) {
    let formData = new FormData();
    Object.keys(bodyObj).map(key => {
      formData.append(key, bodyObj[key]);
    });
    bodyObj = formData;
  }
  return axios
    .post(apiUrl, bodyObj, {
      headers: {
        "x-api-key": "growth12345678910111"
      }
    })
    .then(response => handleResponse(response))
    .catch(error => handleError(error));
};
