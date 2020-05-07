import React from "react";
import PropTypes from "prop-types";
import { getRegExp } from "../../Utility/Helper";
import ToolTip from "./ToolTip";

import NumberFormat from "react-number-format";

const changeHandler = (e, onChangeFunc) => {
	onChangeFunc(
		e.target.name.trim(""),
		e.target.value,
		e.target.name.trim("") && ""
	);
};

const validationHandler = (e, props, reqErrorMsg) => {
	if (!props.validationFunc) return;
	const { value, name } = e.target;
	const { title, isReq, reqType, minLength, validationMessage } = props;
	let errorMsg = isReq ? null : undefined;
	if (!value.replace(/\s/g, "").length == true && isReq) {
		errorMsg = validationMessage
			? validationMessage.isReq
				? validationMessage.isReq
				: reqErrorMsg
			: reqErrorMsg;
	} else if (value && reqType && !getRegExp(reqType).test(value)) {
		let msg = `Please enter valid ${title}`;

		errorMsg = validationMessage
			? validationMessage[reqType]
				? validationMessage[reqType]
				: msg
			: msg;
	} else if (minLength && value.length < minLength) {
		let msg = `${title} must be at least ${minLength} characters long`;
		errorMsg = validationMessage
			? validationMessage.minLength
				? validationMessage.minLength
				: msg
			: msg;
	}
	props.validationFunc(name, errorMsg);
};

const validateNumber = (evt, regex) => {
	var theEvent = evt || window.event;

	// Handle paste
	if (theEvent.type === "paste") {
		key = theEvent.clipboardData.getData("text/plain");
	} else {
		// Handle key press
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode(key);
	}

	if (!regex.test(key)) {
		theEvent.returnValue = false;
		if (theEvent.preventDefault) theEvent.preventDefault();
	}
};

const promoCode = e => {
	if (e.which === 32) e.preventDefault();
};

const Input = props => {
	let msg = props.errorMsg || `Please Enter ${props.title}`;
	const reqErrorMsg = props.validationMessage
		? props.validationMessage.isReq
			? props.validationMessage.isReq
			: msg
		: msg;
	const {
		isReq,
		reqType,
		title,
		type,
		className,
		placeholder,
		disabled,
		onKeyPress,
		value,
		name,
		error,
		onKeyUpFunc,
		loading,
		onChangeFunc,
		prefix,
		maxLength,
		minLength,
		toolInfo,
		min,
		id,
		search,
		max
	} = props;
	const inputProps = {
		type: type,
		className: className,
		value: value
		// defaultValue: value
	};
	if (min) inputProps.min = min;
	if (max) inputProps.max = max;
	if (id) inputProps.id = id;
	if (onKeyPress) inputProps.onKeyPress = onKeyPress;
	if (disabled) inputProps.disabled = disabled;
	if (placeholder) inputProps.placeholder = placeholder;
	if (name) inputProps.name = name;
	if (onKeyUpFunc) inputProps.onKeyUp = onKeyUpFunc;
	if (reqType === "mobile10") inputProps.maxLength = 10;
	if (reqType === "mobile14") inputProps.maxLength = 14;
	if (
		reqType === "number" ||
		reqType === "mobile10" ||
		reqType === "expiryDate" ||
		reqType === "cvv"
	)
		inputProps.onKeyPress = e => {
			validateNumber(e, /[0-9]|\./);
		};
	if (reqType === "promoCode") inputProps.onKeyPress = promoCode;
	if (reqType === "amount")
		inputProps.onKeyPress = inputProps.onKeyPress = e => {
			validateNumber(e, /^\d*\.?\d*$/);
		};
	
	if (reqType === "onlyAlphbate")
		inputProps.onKeyPress = inputProps.onKeyPress = e => {
			validateNumber(e, /^[a-zA-Z ]*$/);
		};
	if (maxLength) inputProps.maxLength = maxLength;
	if (minLength) inputProps.minLength = minLength;
	return (
		<div
			className={`form-group mb-3 ${
				loading !== null ? "input-loading" : ""
				} ${prefix && "input-prefix"}`}
		>
			{title ? (
				<label className="col-form-label">
					{title}
					{isReq ? <span className="reqEstric">*</span> : null}
					{toolInfo && (
						<ToolTip
							info={toolInfo}
							className="toolTip"
							icon="fa fa-question-circle"
						/>
					)}
				</label>
			) : null}
			{reqType === "mobile" ? (
				<NumberFormat
					format="(###) ###-####"
					mask="_"
					{...inputProps}
					onChange={e => {
						changeHandler(e, onChangeFunc);
					}}
					onBlur={e => {
						validationHandler(e, props, reqErrorMsg);
					}}
					autoComplete="off"
				/>
			) : (
					<div className="search-icon">
						{search && <i className="fa fa-search"></i>}
						<input
							{...inputProps}
							onChange={e => changeHandler(e, onChangeFunc)}
							onBlur={e => validationHandler(e, props, reqErrorMsg)}
							autoComplete="off"
						/>
					</div>
				)}
			{/* {reqType === "mobile10" && (
        <div style={{ fontSize: 10 }}>{title} should be 10 digits.</div>
      )} */}
			{prefix && <span className="prefix-ic">{prefix}</span>}
			{loading && <i className="fa fa-spinner fa-pulse fa-fw font-16"></i>}
			{error && (
				<span className="reqEstric">
					{error === true ? reqErrorMsg : error}
				</span>
			)}
		</div>
	);
};

Input.defaultProps = {
	type: "text",
	className: "form-control",
	isReq: null,
	reqType: "",
	value: "",
	onChangeFunc: () => { },
	onKeyUpFunc: () => { },
	loading: null
};

Input.propTypes = {
	title: PropTypes.string,
	isReq: PropTypes.bool,
	disabled: PropTypes.bool,
	reqType: PropTypes.string,
	type: PropTypes.string,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	value: PropTypes.any,
	error: PropTypes.any,
	onChangeFunc: PropTypes.func,
	validationFunc: PropTypes.func,
	minLength: PropTypes.number,
	maxLength: PropTypes.number,
	onKeyPress: PropTypes.func,
	loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	prefix: PropTypes.string
};

export default React.memo(Input);
