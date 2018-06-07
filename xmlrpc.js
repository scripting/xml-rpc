var myProductName = "xmlrpc"; myVersion = "0.4.16";

exports.client = xmlRpcClient;
exports.server = xmlRpcServer; 
exports.buildCall = xmlRpcBuildCall; 
exports.getReturnText = getReturnText;
exports.getFaultText = getFaultText;

const xml2js = require ("xml2js");
const request = require ("request");
const utils = require ("daveutils");

const config = {
	flProcessJsonRpcCalls: true
	};

function firstNonWhitespaceChar (s) { //6/3/18 by DW
	for (var i = 0; i < s.length; i++) {
		var ch = s [i];
		if (!utils.isWhitespace (ch)) {
			return (ch);
			}
		}
	return (undefined);
	}
function encode (s) {
	return (utils.encodeXml (s));
	}
function getXmlValue (theValue) { //xmlize a JavaScript value
	switch (typeof (theValue)) {
		case "string":
			return ("<string>" + encode (theValue) + "</string>");
		case "boolean":
			return ("<boolean>" + utils.getBoolean (theValue) + "</boolean>");
		case "number":
			if (Number.isInteger (theValue)) {
				return ("<i4>" + theValue + "</i4>");
				}
			else {
				return ("<double>" + theValue + "</double>");
				}
		case "object":
			var xmltext = "", indentlevel = "";
			function add (s) {
				xmltext += utils.filledString ("\t", indentlevel) + s + "\n";
				}
			if (Array.isArray (theValue)) {
				add ("<array>"); indentlevel++;
				add ("<data>"); indentlevel++;
				for (var i = 0; i < theValue.length; i++) {
					add ("<value>" + getXmlValue (theValue [i]) + "</value>");
					}
				add ("</data>"); indentlevel--;
				add ("</array>"); indentlevel--;
				return (xmltext);
				}
			else {
				if (Buffer.isBuffer (theValue)) {
					return ("<base64>" + theValue.toString ("base64") + "</base64>");
					}
				else {
					if (theValue instanceof Date) { 
						return ("<dateTime.iso8601>" + theValue.toISOString () + "</dateTime.iso8601>");
						}
					else {
						add ("<struct>"); indentlevel++;
						for (var x in theValue) {
							add ("<member>"); indentlevel++;
							add ("<name>" + encode (x) + "</name>");
							add ("<value>" + getXmlValue (theValue [x]) + "</value>");
							add ("</member>"); indentlevel--;
							}
						add ("</struct>"); indentlevel--;
						return (xmltext);
						}
					}
				}
		default:
			return ("<base64>" + btoa (theValue) + "</base64>");
		}
	}
function getReturnText (theValue, format) { //get xml or json for a returned value
	var rpctext = "", indentlevel = "";
	function add (s) {
		rpctext += utils.filledString ("\t", indentlevel) + s + "\n";
		}
	switch (format) {
		case "xml": case undefined:
			add ("<?xml version=\"1.0\"?>");
			add ("<methodResponse>"); indentlevel++;
			add ("<params>"); indentlevel++;
			add ("<param>"); indentlevel++;
			add ("<value>"); indentlevel++;
			add (getXmlValue (theValue));
			add ("</value>"); indentlevel--;
			add ("</param>"); indentlevel--;
			add ("</params>"); indentlevel--;
			add ("</methodResponse>"); indentlevel--;
			break;
		case "json":
			var jstruct = {
				methodResponse: {
					value: theValue
					}
				};
			rpctext = utils.jsonStringify (jstruct);
			break;
		}
	return (rpctext);
	}
function getFaultText (err, format) { //get xml or json for an error return, or fault
	const theStruct = {
		faultCode: 1,
		faultString: err.message
		};
	switch (format) {
		case "xml": case undefined:
			var xmltext = "", indentlevel = "";
			function add (s) {
				xmltext += utils.filledString ("\t", indentlevel) + s + "\n";
				}
			add ("<?xml version=\"1.0\"?>");
			add ("<methodResponse>"); indentlevel++;
			add ("<fault>"); indentlevel++;
			add ("<value>"); indentlevel++;
			add (getXmlValue (theStruct));
			add ("</value>"); indentlevel--;
			add ("</fault>"); indentlevel--;
			add ("</methodResponse>"); indentlevel--;
			return (xmltext);
		case "json":
			var jstruct = {
				methodResponse: {
					fault: theStruct
					}
				};
			return (utils.jsonStringify (jstruct));
		}
	}
function xmlRpcBuildCall (verb, params, format) {
	switch (format) {
		case "xml": case undefined:
			var xmltext = "", indentlevel = "";
			function add (s) {
				xmltext += utils.filledString ("\t", indentlevel) + s + "\n";
				}
			if (params === undefined) {
				params = new Object ();
				}
			add ("<?xml version=\"1.0\"?>");
			add ("<methodCall>"); indentlevel++;
			add ("<methodName>" + encode (verb) + "</methodName>");
			add ("<params>"); indentlevel++;
			for (var x in params) {
				add ("<param>"); indentlevel++;
				add ("<value>" + getXmlValue (params [x]) + "</value>")
				add ("</param>"); indentlevel--;
				}
			add ("</params>"); indentlevel--;
			add ("</methodCall>"); indentlevel--;
			return (xmltext);
		case "json":
			var jstruct = {
				methodCall: {
					methodName: verb
					}
				};
			if ((typeof (params) == "object") && Array.isArray (params)) {
				jstruct.methodCall.params = params;
				}
			else {
				jstruct.methodCall.params = [params];
				}
			return (utils.jsonStringify (jstruct));
		}
	
	}
function xmlRpcGetValue (value) { //get a JavaScript value from an XML-specified value
	var returnedValue = undefined;
	function parseDate (theString) {
		var theDate = Date.parse (theString);
		if (isNaN (theDate)) {
			var datePart = utils.stringNthField (theString, "T", 1);
			var timePart = utils.stringNthField (theString, "T", 2);
			var year = utils.stringMid (datePart, 1, 4);
			var month = utils.stringMid (datePart, 5, 2);
			var day = utils.stringMid (datePart, 7, 2);
			theString = year + "-" + month + "-" + day + "T" + timePart;
			theDate = Date.parse (theString);
			}
		return (new Date (theDate));
		}
	function badResponse (whereBad) {
		console.log ("xmlRpcGetValue:badResponse: whereBad == " + whereBad);
		var err = {
			message: "Bad response to XML-RPC call, missing \"" + xxx + "\" element."
			};
		callback (err);
		}
	for (x in value) {
		switch (x) {
			case "i4": case "int": case "double": //all numbers in JavaScript are floating point
				returnedValue = Number (value [x]);
				break;
			case "string":
				returnedValue = value [x];
				break;
			case "boolean":
				returnedValue = getBoolean (value [x]);
				break;
			case "dateTime.iso8601":
				returnedValue = parseDate (value [x]);
				break;
			case "base64":
				var buf = new Buffer (value [x], "base64");
				returnedValue = buf.toString ();
				break;
			case "struct":
				returnedValue = new Object ();
				var member = value [x].member;
				if (!Array.isArray (member)) { //5/24/18 by DW
					member = [member];
					}
				for (var i = 0; i < member.length; i++) {
					var item = member [i];
					returnedValue [item.name] = xmlRpcGetValue (item.value);
					}
				break;
			case "array":
				returnedValue = new Array ();
				var data = value [x].data
				if (data !== undefined) {
					var value = data.value;
					if (value !== undefined) {
						if (!Array.isArray (value)) { //5/24/18 by DW
							value = [value];
							}
						
						for (var i = 0; i < value.length; i++) {
							let newvalue = xmlRpcGetValue (value [i]);
							returnedValue.push (newvalue);
							}
						}
					}
				else {
					badResponse ("value");
					}
			}
		}
	if (returnedValue === undefined) { //the default type is string
		returnedValue = value;
		}
	return (returnedValue);
	}
function xmlRpcClient (urlEndpoint, verb, params, format, callback) {
	const method = "POST";
	function parseReturnedXml (xmltext) {
		var options = {
			explicitArray: false
			};
		xml2js.parseString (xmltext, options, function (err, jstruct) {
			function badResponse (whereBad) {
				console.log ("badResponse: whereBad == " + whereBad);
				var err = {
					message: "Bad response to XML-RPC call, missing \"" + whereBad + "\" element."
					};
				callback (err);
				}
			var returnedValue = undefined, methodResponse = jstruct.methodResponse;
			if (methodResponse !== undefined) {
				var params = methodResponse.params;
				if (params !== undefined) {
					var param = params.param;
					if (param !== undefined) {
						var value = param.value;
						if (value !== undefined) {
							returnedValue = xmlRpcGetValue (value);
							callback (undefined, returnedValue);
							}
						else {
							badResponse ("value");
							}
						}
					else {
						badResponse ("param");
						}
					}
				else {
					var fault = methodResponse.fault;
					if (fault !== undefined) {
						var value = fault.value;
						if (value !== undefined) {
							returnedValue = xmlRpcGetValue (value);
							if (returnedValue.faultString !== undefined) {
								returnedValue.message = returnedValue.faultString;
								}
							callback (returnedValue);
							}
						else {
							badResponse ("value");
							}
						}
					else {
						badResponse ("params or fault");
						}
					}
				}
			else {
				badResponse ("methodResponse");
				}
			});
		}
	function parseReturnedJson (jsontext) {
		function errorCallback (s) {
			callback ({message: s});
			}
		try {
			var jstruct = JSON.parse (jsontext);
			var methodResponse = jstruct.methodResponse;
			if (methodResponse !== undefined) {
				if (methodResponse.value !== undefined) {
					callback (undefined, methodResponse.value);
					}
				else {
					if (methodResponse.fault !== undefined) {
						var fault = methodResponse.fault;
						if (fault.faultString !== undefined) { //JavaScript convention for error reporting
							fault.message = fault.faultString;
							}
						callback (fault);
						}
					}
				}
			else {
				errorCallback ("RPC response must contain a methodResponse object.");
				}
			}
		catch (err) {
			callback (err);
			}
		}
	
	var rpctext = xmlRpcBuildCall (verb, params, format);
	
	
	var theRequest = {
		url: urlEndpoint,
		followRedirect: true, 
		method: "POST",
		body: rpctext
		};
	request (theRequest, function (err, response, rpcresponse) {
		if (!err && response.statusCode == 200) {
			if (callback !== undefined) {
				switch (format) {
					case "xml": case undefined: 
						parseReturnedXml (rpcresponse);
						break;
					case "json": 
						parseReturnedJson (rpcresponse);
						break;
					}
				}
			}
		else {
			console.log ("xmlRpcClient: err.message == " + err.message);
			if (callback !== undefined) {
				callback (err);
				}
			}
		});
	}
function xmlRpcServer (rpctext, callback) {
	function badCall (whereBad) {
		console.log ("badCall: whereBad == " + whereBad);
		var err = {
			message: "Bad XML-RPC call, missing \"" + whereBad + "\" element."
			};
		callback (err);
		}
	if (config.flProcessJsonRpcCalls && (firstNonWhitespaceChar (rpctext) == "{")) { //treat it as JSON -- 6/3/18 by DW
		var jstruct, methodCall = undefined, verb = undefined;
		try {
			jstruct = JSON.parse (rpctext);
			methodCall = jstruct.methodCall;
			}
		catch (err) {
			callback (err);
			}
		if (methodCall !== undefined) {
			verb = methodCall.methodName;
			if (verb !== undefined) {
				if (methodCall.params !== undefined) {
					params = methodCall.params;
					}
				else {
					params = new Array ();
					}
				callback (undefined, verb, params, "json");
				}
			else {
				badCall ("methodName");
				}
			}
		else {
			badCall ("methodCall");
			}
		}
	else {
		var options = {
			explicitArray: false
			};
		xml2js.parseString (rpctext, options, function (err, jstruct) {
			
			
			
			var methodCall = jstruct.methodCall, verb = undefined, params = new Array ();
			if (methodCall !== undefined) {
				verb = methodCall.methodName;
				if (verb !== undefined) {
					if (methodCall.params !== undefined) {
						var param = methodCall.params.param;
						if (param !== undefined) {
							if (!Array.isArray (param)) {
								param = [param];
								}
							for (var i = 0; i < param.length; i++) {
								params.push (xmlRpcGetValue (param [i].value));
								}
							}
						}
					callback (undefined, verb, params, "xml");
					}
				else {
					badCall ("methodName");
					}
				}
			else {
				badCall ("methodCall");
				}
			});
		}
	}
