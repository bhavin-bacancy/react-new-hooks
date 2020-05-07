import React from "react";
import PropTypes from "prop-types";

import ToolTip from "./ToolTip";
import { isEmpty } from "../../Utility/Helper";

const changeHandler = (e, onChangeFunc) => {
  onChangeFunc(e.target.name, e.target.value);
};

const validationHandler = (e, props, reqErrorMsg) => {
  if (!props.validationFunc) return;
  const { name, value } = e.target;
  const { isReq } = props;
  let error = null;
  if (isEmpty(value) && isReq) {
    error = reqErrorMsg;
  }
  props.validationFunc(name, error);
};

const TextArea = props => {
  const reqErrorMsg = props.errorMsg || `Please Enter ${props.title}`;
  const {
    isReq,
    title,
    className,
    placeholder,
    value,
    name,
    error,
    onKeyUpFunc,
    loading,
    onChangeFunc,
    rows,
    cols,
    toolInfo,
    minHeight,
    disabled,
    maxLength
  } = props;
  const inputProps = { className, value, rows, cols,disabled };
  if (placeholder) inputProps.placeholder = placeholder;
  if (name) inputProps.name = name;
  if (onKeyUpFunc) inputProps.onKeyUp = onKeyUpFunc;
  const styleObj = { height: "auto", paddingRight: 30 };
  if (minHeight) styleObj.minHeight = minHeight;
  if (maxLength) inputProps.maxLength = maxLength;
  return (
    <div className={`form-group ${loading !== null ? "input-loading" : ""}`}>
      {title ? (
        <label className="col-form-label">
          {title}
          {isReq && <span className="reqEstric">*</span>}
          {toolInfo && (
            <a className="toolTip" title={toolInfo}>
              <i className="fa fa-question-circle"></i>
            </a>
          )}
        </label>
      ) : null}
      <textarea
        {...inputProps}
        style={styleObj}
        onChange={e => changeHandler(e, onChangeFunc)}
        onBlur={e => validationHandler(e, props, reqErrorMsg)}
      />
      {loading && <i className="fa fa-spinner fa-pulse fa-fw font-16"></i>}
      {error && (
        <span className="reqEstric">
          {error === true ? reqErrorMsg : error}
        </span>
      )}
    </div>
  );
};

TextArea.defaultProps = {
  className: "form-control",
  isReq: null,
  errorMsg: null,
  value: "",
  onChangeFunc: () => {},
  onKeyUpFunc: () => {},
  loading: null,
  rows: 3,
  cols: 70,
  minHeight: null,
  disabled:false
};

TextArea.propTypes = {
  title: PropTypes.string,
  isReq: PropTypes.bool,
  name: PropTypes.string,
  errorMsg: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  error: PropTypes.any,
  onChangeFunc: PropTypes.func,
  validationFunc: PropTypes.func,
  onKeyUpFunc: PropTypes.func,
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  rows: PropTypes.number,
  cols: PropTypes.number,
  minHeight: PropTypes.string,
  disabled:PropTypes.bool
};

export default React.memo(TextArea);
