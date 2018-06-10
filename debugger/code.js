var config = {
	urlEndpoint: "http://betty.scripting.com/RPC2",
	verb: "examples.getStateName",
	params: "23",
	format: "xml"
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
	var params = eval (config.params);
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
	if (localStorage.xmlRpcConfig !== undefined) {
		try {
			config = JSON.parse (localStorage.xmlRpcConfig);
			}
		catch (err) {
			}
		}
	$("#idEndpoint").val (config.urlEndpoint);
	$("#idVerb").val (config.verb);
	$("#idParams").val (config.params);
	$("#idFormatMenu").val (config.format);
	setFormLabels ();
	hitCounter (); 
	initGoogleAnalytics (); 
	}
