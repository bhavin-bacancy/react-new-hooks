import { cloneDeep } from "lodash";
import moment from "moment";
import axios from "axios";
// get token of loggedIn user
export const getToken = () => {
	return localStorage.getItem("api_token");
};

// get id of loggedIn user
export const getProfileId = () => {
	return localStorage.getItem("profile_id");
};

// get IP
export const getIP = () => {
	return localStorage.getItem("ip");
};

export const getUniqueNumber = () => {
	return localStorage.getItem("unique_number");
};

export const setUniqueNumber = () => {
	let uniqueNumber = Math.floor(Date.now() / 1000);
	return localStorage.setItem("unique_number", uniqueNumber);
};

// get role of loggedIn user
export const getRole = () => {
	return localStorage.getItem("role");
};

export const setIP = async () => {
	await axios
		.get("https://api.ipify.org/?format=json")
		.then(async res => {
			await localStorage.setItem("ip", res.data.ip);
		})
		.catch(error => {
			console.log(error);
		});
};

// set session data in local storage
export const setSession = (token, id, role) => {
	localStorage.setItem("api_token", token);
	localStorage.setItem("profile_id", id);
	localStorage.setItem("role", role);
};

// remove session data from local storage
export const removeSession = () => {
	localStorage.removeItem("api_token");
	localStorage.removeItem("profile_id");
	localStorage.removeItem("role");
};

// get letter icon by name
export const getUserLetter = (firstName, lastName) => {
	let letter = "";
	if (firstName) letter = firstName.substr(0, lastName ? 1 : 2);
	if (lastName) letter += lastName.substr(0, 1);
	return letter;
};

// append scripts in body
export const appendScriptLink = sources => {
	sources.map(src => {
		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		document.body.appendChild(script);
	});
};

// load script into body part
export const loadScript = source => {
	const s = document.createElement("script");
	s.type = "text/javascript";
	s.async = true;
	s.innerHTML = source;
	document.body.appendChild(s);
};

// load script for admin part
export const loadAdminScript = () => {
	return `   
    // Custom js
    $(function() {
        "use strict";
    
        $(".preloader").fadeOut();
        // ============================================================== 
        // Theme options
        // ==============================================================     
        // ============================================================== 
        // sidebar-hover
        // ==============================================================
    
        $(".left-sidebar").hover(
            function() {
                $(".navbar-header").addClass("expand-logo");
            },
            function() {
                $(".navbar-header").removeClass("expand-logo");
            }
        );
        // this is for close icon when navigation open in mobile view
        $(".nav-toggler").on('click', function() {
            $("#main-wrapper").toggleClass("show-sidebar");
            $(".nav-toggler i").toggleClass("ti-menu");
        });
        $(".nav-lock").on('click', function() {
            $("body").toggleClass("lock-nav");
            $(".nav-lock i").toggleClass("mdi-toggle-switch-off");
            $("body, .page-wrapper").trigger("resize");
        });
        $(".search-box a, .search-box .app-search .srh-btn").on('click', function() {
            $(".app-search").toggle(200);
            $(".app-search input").focus();
        });
    
        // ============================================================== 
        // Right sidebar options
        // ==============================================================
        $(function() {
            $(".service-panel-toggle").on('click', function() {
                $(".customizer").toggleClass('show-service-panel');
    
            });
            $('.page-wrapper').on('click', function() {
                $(".customizer").removeClass('show-service-panel');
            });
        });
        // ============================================================== 
        // This is for the floating labels
        // ============================================================== 
        $('.floating-labels .form-control').on('focus blur', function(e) {
            $(this).parents('.form-group').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
        }).trigger('blur');
    
        // ============================================================== 
        //tooltip
        // ============================================================== 
        $(function() {
            $('[data-toggle="tooltip"]').tooltip()
        })
        // ============================================================== 
        //Popover
        // ============================================================== 
        $(function() {
            $('[data-toggle="popover"]').popover()
        })
    
        // ============================================================== 
        // Perfact scrollbar
        // ============================================================== 
        $('.message-center, .customizer-body, .scrollable').perfectScrollbar({
            wheelPropagation: !0
        });
    
        /*var ps = new PerfectScrollbar('.message-body');
        var ps = new PerfectScrollbar('.notifications');
        var ps = new PerfectScrollbar('.scroll-sidebar');
        var ps = new PerfectScrollbar('.customizer-body');*/
    
        // ============================================================== 
        // Resize all elements
        // ============================================================== 
        $("body, .page-wrapper").trigger("resize");
        $(".page-wrapper").show();
        // ============================================================== 
        // To do list
        // ============================================================== 
        $(".list-task li label").click(function() {
            $(this).toggleClass("task-done");
        });
    
        //****************************
        /* This is for the mini-sidebar if width is less then 1170*/
        //**************************** 
        var setsidebartype = function() {
            var width = (window.innerWidth > 0) ? window.innerWidth : this.screen.width;
            if (width < 1170) {
                $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
            } else {
                $("#main-wrapper").attr("data-sidebartype", "full");
            }
        };
        $(window).ready(setsidebartype);
        $(window).on("resize", setsidebartype);
        //****************************
        /* This is for sidebartoggler*/
        //****************************
        $('.sidebartoggler').on("click", function() {
            $("#main-wrapper").toggleClass("mini-sidebar");
            if ($("#main-wrapper").hasClass("mini-sidebar")) {
                $(".sidebartoggler").prop("checked", !0);
                $("#main-wrapper").attr("data-sidebartype", "mini-sidebar");
            } else {
                $(".sidebartoggler").prop("checked", !1);
                $("#main-wrapper").attr("data-sidebartype", "full");
            }
        });
    });
    `;
};

// load script for home part
export const loadHomeScript = () => {
	return `
        $('.testimonial-carousel').owlCarousel({
            items: 1,
            loop: true,
            margin: 0,
            nav: true,
            loop: true,
            autoplay: false,
            autoplayTimeout: 1000
        });

        $('.fadeOut').owlCarousel({
            items: 1,
            animateOut: 'fadeOut',
            loop: true,
            margin: 10,
            autoplay: true,
        });
    `;
};

// get regexp by type
export const getRegExp = type => {
	let regx = null;
	switch (type) {
		case "email":
			regx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			break;
		case "mobile10":
			regx = /^[7896]\d{9}$/;
			break;
		case "mobile14":
			regx = /^(?=.*[0-9])[- +()0-9]{10,14}$/;
			break;
		case "mobile":
			regx = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/;
			break;
		case "number":
			regx = /^[0-9]*$/;
			break;
		case "floatNumber":
			regx = /^((\+|-)?(0|([1-9][0-9]*))(\.[0-9][0-9])?)$/;
			break;
		case "url":
			regx = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
			break;
		case "cvv":
			regx = /^[0-9]{3,4}$/;
			break;
		case "expiryDate":
			regx = /(0[1-9]|10|11|12)\/[0-9]{2}|\./;
			break;
		case "latitude":
			regx = /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?[0-8]\d((\.)|\.\d{1,6})?)|(0*?90((\.)|\.0{1,6})?))$/;
			break;
		case "longitude":
			regx = /^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?\d\d((\.)|\.\d{1,6})?)|(0*?1[0-7]\d((\.)|\.\d{1,6})?)|(0*?180((\.)|\.0{1,6})?))$/;
			break;
		case "promoCode":
			regx = /^([a-zA-Z0-9]{1,15})$/;
			break;
		case "Amount":
			regx = /^\d*\.?\d*$/;
			break;
		case "Percentage":
			regx = /^\d{0,2}(\.\d{1,4})?$/;
			break;
		case "password":
			regx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			break;
		case "onlyAlphbate":
			regx = /^[a-zA-Z ]*$/;
			break;
		case "alphaNumeric":
			regx = /^([a-zA-Z0-9 _-]+)$/;
			break;
		case "tanNumber":
			regx = /^([A-Z]){4}([0-9]){5}([A-Z]){1}?$/;
			return regx;
			break;
		case "IFSCCode":
			regx = /^[A-Z]{4}0[0-9]{6}$/;
			break;
		case "address":
			regx = /^[a-zA-Z0-9\s,.'-]{3,}$/;
			break;
		case "onlyCharacter":
			regx = /^[a-zA-Z\s]*$/;
			break;
		case "numberPosNeg":
			regx = /^-?\d*\.?\d*$/;
			break;
		// case 'password':
		//     regx = /(?=^.{6,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/;
		//     break;
		default:
			break;
	}
	return regx;
};

// get object of state form
export const getFormDetails = (form, changeValidation) => {
	let failed;
	for (let val in form.errors) {
		const fieldError = form.errors[val];
		if (fieldError) {
			failed = true;
		} else if (fieldError === null && !form[val]) {
			failed = true;
			changeValidation(val, true);
		}
	}
	if (failed) {
		return false;
	} else {
		const cloneObj = cloneDeep(form);
		delete cloneObj["errors"];
		return cloneObj;
	}
};

// perform column sorting
export const getColumnSorting = (key, type, columns) => {
	const sortType = type ? (type === "asc" ? "desc" : null) : "asc";
	columns.map(x => {
		x.sortType = x.key === key ? sortType : null;
	});

	return {
		columns,
		sortType,
		sortKey: sortType ? key : null
	};
};

// generate random number
export const getRandomNumber = () => {
	return Math.random()
		.toString()
		.substr(2);
};
// Return Form Data

export const ConvertInFormData = (obj = {}, file = "") => {
	let formData = new FormData();
	Object.keys(obj).map(res => {
		if (file == res) {
			Object.keys(obj[res]).map((response, index) => {
				console.log("Image", obj[res][response]);
				formData.append(`${res}`, obj[res][response]);
			});
		} else {
			formData.append(res, JSON.stringify(obj[res]));
		}
	});
	return formData;
};
// get server validation in string format
export const getServerValidation = errorObj => {
	let messages = [];
	Object.keys(errorObj).map(val => {
		errorObj[val].map(arr_val => messages.push(arr_val));
	});
	return messages.join(",");
};

// convert UTC date to Local date
export const convertUTCtoLocal = (date, format = "YYYY-MM-DD HH:mm:ss") => {
	if (!date) return "";
	const utcDate = moment.utc(date).format(); //is used to convert to consider input as UTC if timezone offset is not passed
	return moment(utcDate).format(format);
};

// convert Local date to UTC date
export const convertlocaltoUTC = (date, format = "YYYY-MM-DD HH:mm:ss") => {
	if (!date) return "";
	return moment.utc(date).format(format);
};
//set document element value
export const setDocumentData = (tag, value) => {
	if (tag === "title") {
		document.title = value + " — SAMI-Aid";
	}
};
export const isEmpty = value => {
	return (
		(typeof value == "string" && !value.trim()) ||
		typeof value == "undefined" ||
		value === null
	);
};

export const getDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
	return !date ? moment().format(format) : moment(date).format(format);
};

let entity = [
	{
		subcat_type: "Private Limited Company",
		subcat_desc: "Private Limited Company",
		id: "4"
	},
	{
		subcat_type: "Sole Proprietorship Concern",
		subcat_desc: "Sole Proprietorship Concern",
		id: "5"
	},
	{ subcat_type: "Partnership Firm", subcat_desc: "Partnership Firm", id: "7" },
	{
		subcat_type: "Limited Liability Partnership",
		subcat_desc: "Limited Liability Partnership",
		id: "8"
	},
	{
		subcat_type: "Public Limited Company (Unlisted)",
		subcat_desc: "Public Limited Company (Unlisted)",
		id: "2"
	},
	{
		subcat_type: "Public Limited Company (Listed)",
		subcat_desc: "Public Limited Company (Listed)",
		id: "3"
	},
	{ subcat_type: "Society", subcat_desc: "Society", id: "1012" },
	{ subcat_type: "TRUSTS", subcat_desc: "TRUSTS", id: "1002" }
];
export const entityArray = array => {
	let response = [];
	array.map(res => {
		if (res.id == 1012) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 1012)[0].id,
				apiId: res.id
			});
		} else if (res.id == 1002) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 1002)[0].id,
				apiId: res.id
			});
		} else if (res.id == 3) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 3)[0].id,
				apiId: res.id
			});
		} else if (res.id == 2) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 2)[0].id,
				apiId: res.id
			});
		} else if (res.id == 8) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 8)[0].id,
				apiId: res.id
			});
		} else if (res.id == 7) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 7)[0].id,
				apiId: res.id
			});
		} else if (res.id == 6) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity && entity.filter(res => res.id == 6)[0].id,
				apiId: res.id
			});
		} else if (res.id == "A01") {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity && entity.filter(res => res.id == "A01")[0].id,
				apiId: res.id
			});
		} else if (res.id == 5) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 5)[0].id,
				apiId: res.id
			});
		} else if (res.id == 4) {
			response.push({
				subcat_type: res.subcat_type,
				subcat_desc: res.subcat_desc,
				id: entity.filter(res => res.id == 4)[0].id,
				apiId: res.id
			});
		}
	});
	return response;
};
