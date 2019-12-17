var appConsts = {
	productnameForDisplay: "XML-RPC Debugger",
	version: "0.4.3"
	}
var config = {
	urlEndpoint: "http://betty.userland.com/RPC2",
	verb: "examples.getStateName",
	params: "23",
	format: "xml"
	}

var examples = {
	getStateName: {
		verb: "examples.getStateName",
		params: "23"
		},
	getStateList: {
		verb: "examples.getStateList",
		params: "[" + "[15, 25, 35, 45]]"
		},
	getStateNames: {
		verb: "examples.getStateNames",
		params: "[12, 22, 32, 42]"
		},
	getStateStruct: {
		verb: "examples.getStateStruct",
		params: '{"a": 22, "b": 48}'
		}
	};

function initMenus () {
	var cmdKeyPrefix = getCmdKeyPrefix (); //10/6/14 by DW
	$("#idMenuProductName").text (appConsts.productnameForDisplay);
	$("#idVersionNumber").text ("v" + appConsts.version);
	document.getElementById ("idMenuProductName").innerHTML = appConsts.productnameForDisplay; 
	$("#idMenubar .dropdown-menu li").each (function () {
		var li = $(this);
		var liContent = li.html ();
		liContent = liContent.replace ("Cmd-", cmdKeyPrefix);
		li.html (liContent);
		});
	}
function aboutTestsMenu () {
	alertDialog ("Each command sets up the debugger to call one of the standard test XML-RPC calls.");
	}
function setupFormFromConfig () {
	$("#idEndpoint").val (config.urlEndpoint);
	$("#idVerb").val (config.verb);
	$("#idParams").val (config.params);
	$("#idFormatMenu").val (config.format);
	setFormLabels ();
	}
function setupExample (example) {
	config.verb = example.verb;
	config.params = example.params;
	setupFormFromConfig ();
	}


function getConfigFromForm () {
	config.urlEndpoint = $("#idEndpoint").val ();
	config.verb = $("#idVerb").val ();
	config.params = $("#idParams").val ();
	config.format = $("#idFormatMenu").val ();
	localStorage.xmlRpcConfig = jsonStringify (config);
	console.log ("getConfigFromForm: localStorage.xmlRpcConfig == " + localStorage.xmlRpcConfig);
	}
function getShareableUrl () { //12/10/19 by DW
	var url = window.location.href;
	if (stringContains (url, "?")) {
		url = stringNthField (url, "?", 1);
		}
	url += "?";
	function addparam (name, val, fllastparam) {
		url += name + "=" + encodeURIComponent (val)
		if (!fllastparam) {
			url += "&";
			}
		}
	getConfigFromForm ();
	addparam ("endpoint", config.urlEndpoint)
	addparam ("verb", config.verb)
	addparam ("params", config.params)
	addparam ("format", config.format, true)
	return (url);
	}
function getConfigFromUrlparams () { //12/10/19 by DW
	var flallparamspresent = true;
	function getparam (name) {
		var val = getURLParameter (name);
		if (val != "null") {
			return (decodeURIComponent (val));
			}
		else {
			flallparamspresent = false;
			return (undefined);
			}
		}
	var endpoint = getparam ("endpoint");
	var verb = getparam ("verb");
	var params = getparam ("params");
	var format = getparam ("format");
	if (flallparamspresent) {
		config.urlEndpoint = endpoint;
		config.verb = verb;
		config.params = params;
		config.format = format;
		}
	}
function setFormLabels () {
	var format = config.format.toUpperCase ();
	$("#idCallLabel").text (format + " call");
	$("#idResponseLabel").text (format + " response");
	$("#idFormatInTitle").text (format);
	}
function formatMenuSelect () {
	getConfigFromForm ();
	setFormLabels ();
	$("#idFormatMenu").blur (); 
	}
function callButtonClick () {
	function fixTabs (s) {
		return (replaceAll (s, "\t", "   "));
		}
	function reportError (message) {
		alertDialog ("Error: " + message + ".");
		}
	$("#idCallButton").blur (); 
	getConfigFromForm ();
	try {
		var params = eval (JSON.parse (config.params));
		xmlRpcClient (config.urlEndpoint, config.verb, params, config.format, function (err, value, xmlForCall, xmlResponse) {
			$("#idXmlCall").text (fixTabs (xmlForCall));
			if (err) {
				console.log (err.message);
				$("#idResponse").html ("<span class=\"spErrorMessage\">" + err.message + "</span>");
				}
			else {
				let jsontext = jsonStringify (value);
				console.log (jsontext);
				$("#idResponse").text (jsontext);
				$("#idError").text ("");
				}
			$("#idXmlResponse").text (fixTabs (xmlResponse));
			});
		}
	catch (err) {
		reportError (err.message);
		}
	}
function startup () {
	console.log ("startup");
	initMenus ();
	if (localStorage.xmlRpcConfig !== undefined) {
		try {
			config = JSON.parse (localStorage.xmlRpcConfig);
			}
		catch (err) {
			}
		}
	getConfigFromUrlparams (); //12/10/19 by DW
	setupFormFromConfig ();
	hitCounter (); 
	initGoogleAnalytics (); 
	}
