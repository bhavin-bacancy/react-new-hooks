import React from "react";
import PropTypes from "prop-types";

const changeHandler = (e, onChangeFunc, props) => {

	let error = "";

	if (e.target.files.length > 6) {
		error = `Maximum 5 files`
	}
	props.validationFunc(props.name, error);
	Object.keys(e.target.files).map((res, index) => {
		let file = e.target.files[index];
		if (!file) {
			return false;
		}
		let event = e;
		let response = validationHandlerImage(e, props, file);
		if (response == true) {
			//image(event, props, file);
			onChangeFunc(props.name, file, null);
		}
	});

	document.getElementById(props.id).value = "";
};
const remove = props => {
	var element = document.getElementById("imagePreview");
	element.style.backgroundImage = `url('/assets/images/upload.png')`;
	props.onChangeFunc(props.name, "", `Please Select ${props.title}`);
};
const image = (e, props, file) => {
	validationHandlerImage(e, props, file);
	document.getElementById("avatar-preview").innerHTML = "";
	let avatar_upload = document.getElementById("avatar-preview");
	let imagePreview = document.createElement("DIV");
	imagePreview.setAttribute("id", "imagePreview");
	imagePreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
	avatar_upload.appendChild(imagePreview);
};
const validationHandlerImage = (e, props, file) => {
	if (!props.validationFunc) return;
	let type = file.type.split("/");
	console.log(type[1].trim())
	if (
		!props.fileType
			.trim()
			.toLowerCase()
			.includes(type[1].trim().toLowerCase()) ||
		parseFloat(file.size / 1000000) > parseInt(props.size / 1024)
	) {
		let error = " ";
		if (parseFloat(file.size / 1000000) > parseInt(props.size / 1024)) {
			error = `File size should be maximum ${props.size / 1024} MB`;
		}
		if (
			!props.fileType
				.trim()
				.toLowerCase()
				.includes(type[1].trim().toLowerCase())
		) {
			error = `This file type is not supported (${file.name})`;
		}
		// if (e.target.file.length < 6) {

		//   error = `Maximum 5 files`
		// }
		props.validationFunc(props.name, error);
		return false;
	} else {
		return true;
	}
};

const File = props => {
	const reqErrorMsg = `Please Select ${props.title}`;
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
		prefix,
		id,
		size,
		fileType,
		disabled,
		ismultiple
	} = props;
	const inputProps = {
		type: "file",
		className: className,
		value: value,
		id: id
	};
	if (placeholder) inputProps.placeholder = placeholder;
	if (name) inputProps.name = name;
	if (onKeyUpFunc) inputProps.onKeyUp = onKeyUpFunc;
	return (
		<div
			className={`form-group ${
				loading !== null ? "input-loading" : ""
				} ${prefix && "input-prefix"} error-msg image-upload`}
		>
			{title ? (
				<label className="col-form-label">
					{title}
					{isReq ? <span className="reqEstric">*</span> : null}
				</label>
			) : null}
			{/* <input
        {...inputProps}
        onChange={(e) => changeHandler(e, onChangeFunc, props)}
        //onBlur={(e) => validationHandler(e, props, reqErrorMsg)}
        accept={accept} 
      /> */}
			{/*  File */}
			<div className="avatar-upload">
				{props.iconUpload === false ? (
					<div>
						<div className="avatar-btn">
							<input
								type="file"
								id={props.id}
								onChange={e => changeHandler(e, onChangeFunc, props)}
								accept={fileType}
								{...inputProps}
								disabled={disabled}
								multiple={ismultiple}
							/>
							<label htmlFor={props.id}></label>
						</div>
						{/* <div className="avatar-btn delete">
              <input type="button" id="imageUpload" />
              <label
                htmlFor="imageUploa"
                onClick={() => {
                  remove(props);
                }}
              ></label>
            </div> */}
					</div>
				) : null}
				<div id="avatar-preview" className="avatar-preview">
					<div
						id="imagePreview"
						style={{
							backgroundImage: `url(${
								value != "" ? value : "/assets/images/upload.png"
								})`
						}}
					></div>
				</div>
			</div>
			{/* File */}
			<span id="attachment"></span>
			{prefix && <span className="prefix-ic">{prefix}</span>}
			{loading && <i className="fa fa-spinner fa-pulse fa-fw font-16"></i>}
			{/* {error} */}
			{error && (
				<span className={`reqEstric ${props.iconUpload ? "abs-ps" : ""}`}>
					{error === true ? reqErrorMsg : error}
				</span>
			)}
			{props.iconUpload === true ? (
				<div className="btns">
					<div className="edit-icon">
						<input
							className="edit-input"
							type="file"
							id="imageUpload"
							onChange={e => changeHandler(e, onChangeFunc, props)}
						//accept=".png, .jpg, .jpeg"
						/>
						<label
							style={{ cursor: "pointer" }}
							className="text-blue"
							htmlFor="imageUpload"
						>
							Edit Icon
            </label>
					</div>
					<div className="delete-icon">
						<button
							className="btn text-blue"
							style={{ background: "transparent" }}
							id="imageUpload"
							onClick={() => {
								remove(props);
							}}
						>
							Delete Icon
            </button>
					</div>
				</div>
			) : null}
		</div>
	);
};
File.defaultProps = {
	iconUpload: false,
	type: "text",
	className: "form-control",
	isReq: null,
	reqType: "",
	value: "",
	onChangeFunc: () => { },
	onKeyUpFunc: () => { },
	loading: null,
	disabled: false,
	size: "2048",
	ismultiple: true
};
File.propTypes = {
	title: PropTypes.string,
	isReq: PropTypes.bool,
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
	size: PropTypes.number,
	maxLength: PropTypes.number,
	onKeyUpFunc: PropTypes.func,
	loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	prefix: PropTypes.string,
	iconUpload: PropTypes.bool,
	disabled: PropTypes.bool,
	ismultiple: PropTypes.bool,
};
export default React.memo(File);
