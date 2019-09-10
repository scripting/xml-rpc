const xmlrpc = require ("davexmlrpc");

const urlEndpoint = "http://betty.userland.com/rpc2";
const verb = "examples.getStateName";
const params = [5]; //an array containing one element, the number 5
const format = "xml"; //could also be "json"

xmlrpc.client (urlEndpoint, verb, params, format, function (err, data) {
	if (err) {
		console.log ("err.message == " + err.message);
		}
	else {
		console.log (JSON.stringify (data));
		}
	});
