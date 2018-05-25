var myProductName = "xmlrpc"; myVersion = "0.4.0";

exports.client = xmlRpcClient; 
exports.server = xmlRpcServer; 
exports.buildCall = xmlRpcBuildCall; 
exports.getReturnValue = getReturnValue;

const xml2js = require ("xml2js");
const request = require ("request");
const utils = require ("daveutils");

function encode (s) {
	return (utils.encodeXml (s));
	}
function getJavaScriptValue (theValue) {
	switch (typeof (theValue)) {
		case "string":
			return ("<string>" + encode (theValue) + "</string>");
		case "boolean":
			return ("<boolean>" + theValue + "</boolean>");
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
					add ("<value>" + getJavaScriptValue (theValue [i]) + "</value>");
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
							add ("<value>" + getJavaScriptValue (theValue [x]) + "</value>");
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
function getReturnValue (theValue) {
	var xmltext = "", indentlevel = "";
	function add (s) {
		xmltext += utils.filledString ("\t", indentlevel) + s + "\n";
		}
	add ("<?xml version=\"1.0\"?>");
	add ("<methodResponse>"); indentlevel++;
	add ("<params>"); indentlevel++;
	add ("<param>"); indentlevel++;
	add ("<value>"); indentlevel++;
	add (getJavaScriptValue (theValue));
	add ("</value>"); indentlevel--;
	add ("</param>"); indentlevel--;
	add ("</params>"); indentlevel--;
	add ("</methodResponse>"); indentlevel--;
	return (xmltext);
	}
function xmlRpcBuildCall (verb, params) {
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
		add ("<value>" + getJavaScriptValue (params [x]) + "</value>")
		add ("</param>"); indentlevel--;
		}
	add ("</params>"); indentlevel--;
	add ("</methodCall>"); indentlevel--;
	return (xmltext);
	}
function xmlRpcGetValue (value) {
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
			case "i4": case "double": //all numbers in JavaScript are floating point
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
function xmlRpcClient (urlEndpoint, verb, params, callback) {
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
			console.log (utils.jsonStringify (jstruct));
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
					badResponse ("params");
					}
				}
			else {
				badResponse ("methodResponse");
				}
			});
		}
	
	var xmltext = xmlRpcBuildCall (verb, params);
	
	console.log ("xmlRpcClient: verb == " + verb + ", urlEndpoint == " + urlEndpoint);
	console.log ("xmlRpcClient: xmltext == \n" + xmltext);
	
	var theRequest = {
		url: urlEndpoint,
		followRedirect: true, 
		method: "POST",
		body: xmltext
		};
	request (theRequest, function (err, response, xmlresponse) {
		if (!err && response.statusCode == 200) {
			if (callback !== undefined) {
				callback (undefined, parseReturnedXml (xmlresponse));
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
function xmlRpcServer (xmltext, callback) {
	console.log ("xmlRpcServer: xmltext == \n\n" + xmltext);
	var options = {
		explicitArray: false
		};
	xml2js.parseString (xmltext, options, function (err, jstruct) {
		function badCall (whereBad) {
			console.log ("badCall: whereBad == " + whereBad);
			var err = {
				message: "Bad XML-RPC call, missing \"" + whereBad + "\" element."
				};
			callback (err);
			}
		
		console.log (utils.jsonStringify (jstruct));
		
		
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
				callback (undefined, verb, params);
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
