var appConsts = {
	version: "0.4.0"
	};

const urlEndpoint = "http://betty.scripting.com/RPC2";

function testStateList (callback) {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateList", [ [15, 25, 35, 45] ], function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			}
		else {
			console.log (jsonStringify (data));
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateName () {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateName", 23, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			}
		else {
			console.log (jsonStringify (data));
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateName (callback) {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateName", 23, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			}
		else {
			console.log (jsonStringify (data));
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateNames (callback) {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateNames", [12, 22, 32, 42], function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			}
		else {
			console.log (jsonStringify (data));
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testStateStruct (callback) {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateStruct", {a: 22, b: 48}, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			}
		else {
			console.log (jsonStringify (data));
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}
function testFault (callback) {
	var whenstart = new Date ();
	xmlRpcClient (urlEndpoint, "examples.getStateName", 900, function (err, data) {
		if (err) {
			console.log ("err.message == " + err.message);
			}
		else {
			console.log (jsonStringify (data));
			}
		if (callback !== undefined) {
			callback ();
			}
		});
	}

function startup () {
	console.log ("startup");
	testFault (function () {
		testStateList (function () {
			testStateName (function () {
				testStateNames (function () {
					testStateStruct (function () {
						});
					});
				});
			});
		});
	}
