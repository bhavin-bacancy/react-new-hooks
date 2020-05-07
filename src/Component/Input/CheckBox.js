import React from "react";
import PropTypes from "prop-types";

const changeHandler = (e, value, onChangeFunc) => {
  const { name, checked } = e.target;
  let oppValue = null;
  if (typeof value == "boolean") oppValue = false;
  else if (typeof value == "number") oppValue = 0;
  onChangeFunc(name, checked ? value : oppValue);
};

const Checkbox = props => {
  const { value, name, title, checked, onChangeFunc, isReq } = props;
  return (
    <div className="form-group checkbox-main">
      {title && (
        <label className="col-form-label">
          {title} {isReq ? <span className="reqEstric">*</span> : null}
        </label>
      )}
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={name}
          name={name}
          value={value}
          checked={checked == value}
          onChange={e => changeHandler(e, value, onChangeFunc)}
        />
        <label className="custom-control-label" htmlFor={name}></label>
      </div>
    </div>
  );
};

Checkbox.defaultProps = {
  value: null,
  onChangeFunc: () => {}
};

Checkbox.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.any,
  checked: PropTypes.any,
  onChangeFunc: PropTypes.func
};

export default React.memo(Checkbox);
