//Sit server
// export const API_URL = "http://35.154.202.170/";

// export const API_URL = `${window.location.protocol}//${
//   window.location.hostname == "localhost"
//     ? "13.127.185.114"
//     : window.location.hostname
// }:8080`;
// export const FrontendURL = `${window.location.protocol}//${window.location.hostname}:5000`;

// export const FileUrl = `${window.location.protocol}//${window.location.hostname}/`;

export const API_URL = `${window.location.protocol}//${
  window.location.hostname == "localhost" ? "13.126.47.63" : "13.126.47.63"
}:8080`;
export const FrontendURL = `${window.location.protocol}//${
  window.location.hostname == "localhost" ? "13.127.185.114" : "13.127.185.114"
}:5000`;

export const FileUrl = `${window.location.protocol}//${
  window.location.hostname == "localhost" ? "13.126.47.63" : "13.126.47.63"
}/`;
