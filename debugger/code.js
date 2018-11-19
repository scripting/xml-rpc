var appConsts = {
	productnameForDisplay: "XML-RPC Debugger"
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
	$("#idCallButton").blur (); 
	getConfigFromForm ();
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
	setupFormFromConfig ();
	hitCounter (); 
	initGoogleAnalytics (); 
	}
