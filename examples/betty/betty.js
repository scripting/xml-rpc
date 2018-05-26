const xmlrpc = require ("davexmlrpc");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const fs = require ("fs");

var config = {
	port: 1409,
	flPostEnabled: true,
	flLogToConsole: true
	}
function nthState (n) {
	var states = [
		"Alabama",
		"Alaska",
		"Arizona",
		"Arkansas",
		"California",
		"Colorado",
		"Connecticut",
		"Delaware",
		"Florida",
		"Georgia",
		"Hawaii",
		"Idaho",
		"Illinois",
		"Indiana",
		"Iowa",
		"Kansas",
		"Kentucky",
		"Louisiana",
		"Maine",
		"Maryland",
		"Massachusetts",
		"Michigan",
		"Minnesota",
		"Mississippi",
		"Missouri",
		"Montana",
		"Nebraska",
		"Nevada",
		"New Hampshire",
		"New Jersey",
		"New Mexico",
		"New York",
		"North Carolina",
		"North Dakota",
		"Ohio",
		"Oklahoma",
		"Oregon",
		"Pennsylvania",
		"Rhode Island",
		"South Carolina",
		"South Dakota",
		"Tennessee",
		"Texas",
		"Utah",
		"Vermont",
		"Virginia",
		"Washington",
		"West Virginia",
		"Wisconsin",
		"Wyoming"
		];
	return (states [n - 1]);
	}
function getStateList (numlist) {
	var s = "";
	for (var i = 0; i < numlist.length; i++) {
		s += nthState (numlist [i]) + ",";
		}
	return (utils.stringMid (s, 1, s.length - 1));
	}
function getStateName (statenum) {
	return (nthState (statenum));
	}
function getStateNames (num1, num2, num3, num4) {
	return (nthState (num1) + "\r" + nthState (num2) + "\r" + nthState (num3) + "\r" + nthState (num4));
	}
function getStateStruct (statestruct) {
	var s = "";
	for (var x in statestruct) {
		s += nthState (statestruct [x]) + ",";
		}
	return (utils.stringMid (s, 1, s.length - 1));
	}
function handleBettyCall (verb, params) {
	switch (verb) {
		case "examples.getStateList":
			return (getStateList (params [0]));
		case "examples.getStateName":
			return (getStateName (params [0]));
		case "examples.getStateNames":
			return (getStateNames (params [0], params [1], params [2], params [3]));
		case "examples.getStateStruct":
			return (getStateStruct (params [0]));
		}
	return (undefined);
	}
davehttp.start (config, function (theRequest) {
	function notFoundReturn () {
		theRequest.httpReturn (404, "text/plain", "Not found.");
		}
	function errorReturn (err) {
		theRequest.httpReturn (500, "text/plain", err.message);
		}
	switch (theRequest.lowerpath) {
		case "/rpc2":
			xmlrpc.server (theRequest.postBody, function (err, verb, params) {
				if (err) {
					errorReturn (err);
					}
				else {
					try {
						var returnValue = handleBettyCall (verb, params); //entirely in JavaScript
						if (returnValue === undefined) {
							notFoundReturn ();
							}
						else {
							var xmltext = xmlrpc.getReturnXml (returnValue); //translate result to XML
							theRequest.httpReturn (200, "text/xml", xmltext); //return the XML
							}
						}
					catch (err) {
						errorReturn (err);
						}
					}
				});
			return;
		}
	notFoundReturn ();
	});
