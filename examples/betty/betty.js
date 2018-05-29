var myProductName = "betty"; myVersion = "0.4.3";

const xmlrpc = require ("davexmlrpc");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const fs = require ("fs");

var config = {
	port: 5392,
	flPostEnabled: true,
	flAllowAccessFromAnywhere: true,
	flLogToConsole: true
	}
var stats = {
	callCounts: new Object (),
	whenLastCall: new Date (0),
	ctStatsWrites: 0
	};
var flStatsChanged = false;
const fnameStats = "stats.json";

function nthState (n) {
	const states = [
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
	var theName = states [n - 1];
	if (theName === undefined) {
		throw {message: "Can't get the name for state #" + n + " because the number must be between 1 and 50."};
		}
	return (theName);
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
function nowXml () {
	var xmltext = "", indentlevel = "";
	function add (s) {
		xmltext += utils.filledString ("\t", indentlevel) + s + "\n";
		}
	add ("<?xml version=\"1.0\"?>");
	add ("<now>" + new Date ().toISOString () + "</now>");
	return (xmltext);
	}
function handleBettyCall (verb, params) {
	if (stats.callCounts [verb] === undefined) {
		stats.callCounts [verb] = 0;
		}
	stats.callCounts [verb]++;
	stats.whenLastCall = new Date ();
	flStatsChanged = true;
	
	switch (verb) {
		case "examples.getStateList":
			return (getStateList (params [0]));
		case "examples.getStateName":
			return (getStateName (params [0]));
		case "examples.getStateNames":
			return (getStateNames (params [0], params [1], params [2], params [3]));
		case "examples.getStateStruct":
			return (getStateStruct (params [0]));
		default: 
			throw {message: "Can't make the call because \"" + verb + "\" is not defined."};
		}
	return (undefined);
	}
function readStats (callback) {
	fs.readFile (fnameStats, function (err, jsontext) {
		if (!err) {
			try {
				stats = JSON.parse (jsontext);
				}
			catch (err) {
				}
			}
		callback ();
		});
	}
function everySecond () {
	if (flStatsChanged) {
		if (utils.secondsSince (stats.whenLastCall) > 1) {
			flStatsChanged = false;
			stats.ctStatsWrites++;
			fs.writeFile (fnameStats, utils.jsonStringify (stats), function (err) {
				});
			}
		}
	}
function startup () {
	readStats (function () {
		davehttp.start (config, function (theRequest) {
			function notFoundReturn () {
				theRequest.httpReturn (404, "text/plain", "Not found.");
				}
			function errorReturn (err) {
				theRequest.httpReturn (200, "text/plain", xmlrpc.getFaultXml (err)); 
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
									theRequest.httpReturn (200, "text/plain", xmltext); //return the XML
									}
								}
							catch (err) {
								errorReturn (err);
								}
							}
						});
					return;
				case "/now":
					theRequest.httpReturn (200, "text/plain", new Date ());
					return;
				case "/nowxml":
					theRequest.httpReturn (200, "text/plain", nowXml ());
					return;
				}
			notFoundReturn ();
			});
		setInterval (everySecond, 1000); 
		});
	}
startup ();
