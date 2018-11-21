/*
	We make six calls to the betty server, two to test error reporting, and four to test various combinations of scalars, parameter lists, structs and array. The "betty" server it calls is a clone of the one we used in the earlier work on XML-RPC.
	*/
var appConsts = {
	version: "0.4.0"
	};

var urlEndpoint = "http://betty.userland.com/RPC2";

const format = "xml";

var tests = {
	stateStruct: undefined,
	stateNames: undefined,
	stateName: undefined,
	stateList: undefined,
	noSuchVerb: undefined,
	fault: undefined
	};

function viewTests () {
	var htmltext = "", indentlevel = 0;
	function add (s) {
		htmltext +=  filledString ("\t", indentlevel) + s + "\n";
		}
	add ("<table>"); indentlevel++;
	for (var x in tests) {
		let val = "";
		if (tests [x] !== undefined) {
			if (tests [x]) {
				val = "<i class=\"fa fa-check iOK\"></i>";
				}
			else {
				val = "<i class=\"fa fa-times iError\"></i>";
				}
			}
		add ("<tr><td>" + x + "</td><td>" + val + "</td></tr>");
		}
	add ("</table>"); indentlevel--;
	$("#idTests").html (htmltext);
	}
function reportTestsResult () {
	var flPass = true, s = "";
	for (var x in tests) {
		if (!getBoolean (tests [x])) {
			flPass = false;
			break;
			}
		}
	if (flPass) {
		s = "Congratulations, your server passed all our tests.";
		}
	else {
		s = "Sorry, your server failed one or more of our tests.";
		}
	s += " Please let us know about your test in <a href=\"https://github.com/scripting/xml-rpc/issues/7\">this thread</a>.";
	s = "<p>" + s + "</p>";
	$("#idResult").html (s);
	}

function testStateList (callback) {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateList", [ [15, 25, 35, 45] ], format, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			tests.stateList = false;
			}
		else {
			console.log (jsonStringify (data));
			tests.stateList = true;
			}
		viewTests ();
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateName (callback) {
	xmlRpcClient (urlEndpoint, "examples.getStateName", 23, format, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			tests.stateName = false;
			}
		else {
			console.log (jsonStringify (data));
			tests.stateName = true;
			}
		viewTests ();
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateNames (callback) {
	xmlRpcClient (urlEndpoint, "examples.getStateNames", [12, 22, 32, 42], format, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			tests.stateNames = false;
			}
		else {
			console.log (jsonStringify (data));
			tests.stateNames = true;
			}
		viewTests ();
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateStruct (callback) {
	xmlRpcClient (urlEndpoint, "examples.getStateStruct", {a: 22, b: 48}, format, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			tests.stateStruct = false;
			}
		else {
			console.log (jsonStringify (data));
			tests.stateStruct = true;
			}
		viewTests ();
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testFault (callback) {
	xmlRpcClient (urlEndpoint, "examples.getStateName", 900, format, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			tests.fault = true; //passed
			}
		else {
			console.log (jsonStringify (data));
			tests.fault = false; //failed
			}
		viewTests ();
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testNoSuchVerb (callback) {
	xmlRpcClient (urlEndpoint, "doesNotExist", undefined, format, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			tests.noSuchVerb = true; //passed
			}
		else {
			console.log (jsonStringify (data));
			tests.noSuchVerb = false; //failed
			}
		viewTests ();
		if (callback !== undefined) {
			callback ();
			}
		});
	}

function testsButtonClick () {
	$("#idTestButton").blur ();
	urlEndpoint = $("#idEndpointUrl").val ();
	localStorage.bettyEndpoint = urlEndpoint;
	for (var x in tests) {
		tests [x] = undefined;
		}
	viewTests ();
	testNoSuchVerb (function () {
		testFault (function () {
			testStateList (function () {
				testStateName (function () {
					testStateNames (function () {
						testStateStruct (function () {
							reportTestsResult ();
							});
						});
					});
				});
			});
		});
	}

function startup () {
	console.log ("startup");
	if (localStorage.bettyEndpoint !== undefined) {
		urlEndpoint = localStorage.bettyEndpoint;
		}
	$("#idEndpointUrl").val (urlEndpoint);
	}
