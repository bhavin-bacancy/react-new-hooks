import React from "react";
import ReactSelect, { components } from "react-select";
import PropTypes from "prop-types";
import { map } from "lodash";

const { Option, SingleValue, MultiValue } = components;

const CustomMultiValue = props => (
  <MultiValue {...props}>
    {/* <div> */}
    <img
      style={{ width: "30px", height: "30px" }}
      src={
        props.options.filter(
          val => val[props.valueKey] === props.data[props.valueKey]
        )["0"][props.iconKey]
      }
    />{" "}
    &nbsp; &nbsp;&nbsp;
    {props.data[props.labelKey]}
    {/* </div> */}
  </MultiValue>
);

const CustomSingleValue = props => (
  <SingleValue {...props}>
    <img
      style={{ width: "30px", height: "30px" }}
      src={
        props.options.filter(
          val => val[props.valueKey] === props.data[props.valueKey]
        )["0"][props.iconKey]
      }
    />{" "}
    &nbsp; &nbsp;&nbsp;
    {props.data[props.labelKey]}
  </SingleValue>
);

const IconOption = props => (
  <Option {...props}>
    <img
      style={{ width: "30px", height: "30px" }}
      src={props.data[props.iconKey]}
    />
    &nbsp;&nbsp;&nbsp;
    {props.data[props.labelKey]}
  </Option>
);
const onBlur = (value, props, reqErrorMsg) => {
  const { isReq, valueKey, isMulti } = props;
  value = value;
  let errorMsg = undefined;
  if (isReq !== null) {
    if (!value && isReq) errorMsg = reqErrorMsg;
    else errorMsg = null;
  }
  props.onChangeFunc(props.name, value, errorMsg);
};
const changeHandler = (obj, props, reqErrorMsg) => {
  const { isReq, valueKey, isMulti } = props;
  let value = null;
  if (isMulti)
    value =
      obj && obj.length > 0 ? map(obj, [valueKey].toString()).join(",") : null;
  else value = obj ? obj[valueKey] : null;

  let errorMsg = undefined;
  if (isReq !== null) {
    if (!value && isReq) errorMsg = reqErrorMsg;
    else errorMsg = null;
  }
  props.onChangeFunc(props.name, value, errorMsg);
};
const getObjectByValue = (options, valueKey, labelKey, value) => {
  if (!options || (options && options.length == 0)) return null;
  const selectedObj = options.find(o => o[valueKey] == value);
  if (!selectedObj) return null;
  return {
    [valueKey]: selectedObj[valueKey],
    [labelKey]: selectedObj ? selectedObj[labelKey] : ""
  };
};
const customStyles = {
  control: (base, state) => ({
    ...base,
    boxShadow: "none"

    // You can also use state.isFocused to conditionally style based on the focus state
  })
};
const Select = props => {
  const reqErrorMsg = `Please select ${props.title}`;
  let { options } = props;
  const {
    isReq,
    title,
    className,
    classNamePrefix,
    placeholder,
    isClearable,

    value,
    name,
    valueKey,
    labelKey,
    iconKey,
    error,
    isMulti,
    icon,
    isSearchable,
    isLoading,
    disabled,
    filter
  } = props;
  // if (filter && filter.length > 0) {
  //   let filterOption = [];
  //  // console.log("Filter", filter);
  //   options.filter(res => {
  //     if (
  //       filter &&
  //       filter.filter(filterRes => filterRes.includes(res[valueKey])).length ==
  //         0
  //     ) {
  //       filterOption.push(res);
  //     }
  //   });
  //   if (value) {
  //     options.filter(opResponse => {
  //       if (
  //         opResponse[valueKey].includes(value) &&
  //         filterOption.filter(filterRes => filterRes[valueKey].includes(value)).length == 0
  //       ) {
  //         console.log("---",opResponse)
  //       }else
  //       {
  //        // console.log("+++",opResponse)
  //       }
  //     });
  //   }
  // }
  const inputProps = {
    className,
    classNamePrefix,
    valueKey,
    labelKey,
    placeholder: placeholder === null ? `Select ${title}` : placeholder,
    isClearable,
    isSearchable,
    isMulti,
    isLoading,
    isDisabled: disabled
  };
  if (icon)
    inputProps.components = {
      SingleValue: other => (
        <CustomSingleValue
          {...other}
          labelKey={labelKey}
          valueKey={valueKey}
          iconKey={iconKey}
        />
      ),
      MultiValue: other => (
        <CustomMultiValue
          {...other}
          labelKey={labelKey}
          valueKey={valueKey}
          iconKey={iconKey}
        />
      ),
      Option: other => (
        <IconOption {...other} labelKey={labelKey} iconKey={iconKey} />
      )
    };
  if (name) inputProps.name = name;
  if (options) inputProps.options = options;
  if (value) {
    if (isMulti) {
      const valueArr = [];
      value.toString().includes(",")
        ? value
            .split(",")
            .map(v =>
              valueArr.push(getObjectByValue(options, valueKey, labelKey, v))
            )
        : valueArr.push(getObjectByValue(options, valueKey, labelKey, value));

      inputProps.value = valueArr;
    } else {
      inputProps.value = getObjectByValue(options, valueKey, labelKey, value);
    }
  }
  if (inputProps.value == undefined) inputProps.value = null;
  return (
    <div className="form-group">
      {title ? (
        <label className="col-form-label">
          {title}
          {isReq && <span className="reqEstric">*</span>}
        </label>
      ) : null}
      <ReactSelect
        {...inputProps}
        getOptionLabel={option => option[labelKey]}
        getOptionValue={option => option[valueKey]}
        menuPlacement="auto"
        onChange={e => changeHandler(e, props, reqErrorMsg)}
        onBlur={e => onBlur(value, props, reqErrorMsg)}
        styles={customStyles}
      />

      {error && (
        <span className="reqEstric">
          {error === true ? reqErrorMsg : error}
        </span>
      )}
    </div>
  );
};
Select.defaultProps = {
  isReq: null,
  className: "form-control select-control",
  classNamePrefix: "prefix-select",
  placeholder: null,
  isClearable: true,
  isSearchable: true,
  options: [],
  valueKey: "value",
  labelKey: "label",
  labelIcon: "icon",
  isMulti: false,
  isLoading: false,
  onChangeFunc: () => {},
  disabled: false
};
Select.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  classNamePrefix: PropTypes.string,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
  value: PropTypes.any,
  options: PropTypes.array,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  labelIcon: PropTypes.string,
  onChangeFunc: PropTypes.func,
  isReq: PropTypes.bool,
  isLoading: PropTypes.bool,
  error: PropTypes.any,
  isMulti: PropTypes.bool,
  disabled: PropTypes.bool
};
export default React.memo(Select);
