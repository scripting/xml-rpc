const xmlrpc = require ("davexmlrpc");

const urlserver = "http://betty.userland.com/rpc2";

xmlrpc.client (urlserver, "examples.getStateName", [5], "xml", function (err, data) {
	if (err) {
		console.log ("err.message == " + err.message);
		}
	else {
		console.log (JSON.stringify (data));
		}
	});
