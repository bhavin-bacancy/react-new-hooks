import React from "react";
import PropTypes from "prop-types";

const changeHandler = (
  e,
  value,
  props,
  selectedVal,
  onChangeFunc,
  reqErrorMsg
) => {
  console.log("data",selectedVal)
  const { name, checked } = e.target;
  
  let allValues = value !== "" ? value.split(",") : [];
  if (checked) {
   
    allValues && allValues.push(selectedVal);
  } else {
  
    allValues = allValues.filter(ele => {
      return ele != selectedVal;
    });
   
  }
  // if (typeof value == "boolean") oppValue = false;
  // else if (typeof value == "number") oppValue = 0;
  onChangeFunc(name, allValues.join(","));
  validationHandler(e, value, props, reqErrorMsg);
};
const validationHandler = (e, value, props, reqErrorMsg) => {
  if (!props.validationFunc) return;
  const { name, checked } = e.target;
  const { isReq, validationMessage } = props;
  let errorMsg = isReq ? null : undefined;

  if (value.split(",").length <= 1 && !checked && isReq) {
    errorMsg = validationMessage
      ? validationMessage.isReq
        ? validationMessage.isReq
        : reqErrorMsg
      : reqErrorMsg;
  } else {
    errorMsg = false;
  }
  props.validationFunc(name, errorMsg);
};

const CheckboxMulti = props => {
  let msg = props.errorMsg || `Please Select ${props.title}.`;
  const reqErrorMsg = props.validationMessage
    ? props.validationMessage.isReq
      ? props.validationMessage.isReq
      : msg
    : msg;
  const { error } = props;
  const {
    options,
    value,
    name,
    title,
    onChangeFunc,
    customClass,
    lableClassName,
    className,
    labelKey,
    valueKey,
    isReq,
    disabled
  } = props;
  return (
    <React.Fragment>
      {title && (
        <label className={lableClassName}>
          {title}
          {isReq ? <span className="reqEstric">*</span> : null}
        </label>
      )}
      <div className={className}>
        {options.map((o, i) => {
          if (o[valueKey])
            return (
              <React.Fragment key={i}>
                <div className="custom-control">
                  <input
                    type="checkbox"
                    className={`custom-control-input ${customClass}`}
                    id={name + i + o[valueKey]}
                    name={name}
                    checked={
                      value && value.split(",").includes(o[valueKey].toString())
                    }
                    disabled={disabled}
                    onChange={e =>
                      changeHandler(
                        e,
                        value,
                        props,
                        o[valueKey],
                        onChangeFunc,
                        reqErrorMsg
                      )
                    }
                    // onBlur={(e) => validationHandler(e, value, props, reqErrorMsg)}
                  />

                  <label
                    className={`custom-control-label `}
                    htmlFor={name + i + o[valueKey]}
                  >
                    {o[labelKey]}
                  </label>
                </div>
              </React.Fragment>
            );
        })}
        {error && (
          <span className="reqEstric">
            {error === true ? reqErrorMsg : error}
          </span>
        )}
      </div>
    </React.Fragment>
  );
};

CheckboxMulti.defaultProps = {
  options: [],
  valueKey: "value",
  labelKey: "label",
  name: "",
  value: [],
  lableClassName: "col-form-label font-semi-bold mr-2 mb-20 pb-0",
  className: " mb-0",
  onChangeFunc: () => {}
};

CheckboxMulti.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  labelClassName: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  value: PropTypes.string,
  onChangeFunc: PropTypes.func,
  validationFunc: PropTypes.func
};

export default React.memo(CheckboxMulti);
