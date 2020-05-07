import React from "react";
import ReduxToastr, { toastr } from "react-redux-toastr";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";

const toastrOptions = {
  timeOut: 4000,
  newestOnTop: false,
  position: "bottom-right",
  className: "toastr-style"
};

export const ts = (message, title = "Success") => {
  toastr.success(title, message);
};
export const te = (message, title = "Error") => {
  toastr.error(title, message);
};
export const ti = (message, title = "Info") => {
  toastr.info(title, message);
};
export const tw = (message, title = "Warning") => {
  toastr.warning(title, message);
};
export const tConfirm = (
  message,
  onOkFunc = () => {},
  onCancelFunc = () => {}
) => {
  const toastrConfirmOptions = {
    onOk: onOkFunc,
    onCancel: onCancelFunc
  };
  toastr.confirm(message, toastrConfirmOptions);
};

const Toastr = () => {
  return <ReduxToastr {...toastrOptions} closeOnToastrClick />;
};

export default Toastr;
