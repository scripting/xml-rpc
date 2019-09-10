# XML-RPC

An XML-RPC client and server in JavaScript.

* Client and server <a href="https://www.npmjs.com/package/davexmlrpc">for Node.js</a>.

* Client for the <a href="https://github.com/scripting/xml-rpc/tree/master/client">browser</a>.

* Pure JavaScript.

* Written by one of the <a href="http://scripting.com/?tab=about">designers</a> of the protocol.

### Example client

Here's code that makes a simple XML-RPC call in a Node.js app.

<pre>const xmlrpc = require ("davexmlrpc");

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
</pre>

It sends a call to the demo server, betty.userland.com. 

The procedure it calls is "examples.getStateName," with a single parameter, the number 5.

The call will be made in XML (it could also use JSON if we know the server supports it). 

When the server returns, the callback receives the standard Node error object in the first param, and if there was no error, the data returned through XML-RPC in the second parameter.

### Example server

Here's the code for a simple XML-RPC server. 

<pre>const xmlrpc = require ("davexmlrpc");

var config = {
	port: 1417,
	xmlRpcPath: "/rpc2"
	}

xmlrpc.startServerOverHttp (config, function (request) {
	switch (request.verb) {
		case "uppercase":
			if (request.params.length > 0) {
				request.returnVal (undefined, request.params [0].toUpperCase ());
				}
			else {
				request.returnVal ({message: "There must be at least one parameter."});
				}
			return (true); //we handled it
		}
	return (false); //we didn't handle it
	});
</pre>

Here's pseudo-code that calls this service. It returns THIS IS A TEST.

<pre>["xmlrpc://localhost:1417/rpc2"].uppercase ("this is a test")</pre>

### Please help test for interop

If you're running XML-RPC in your world, could you try testing against the server 

I have running at betty.scripting.com. The server is accessible through port 80. The calls it handles are exactly the ones handled by the userland version of the test server. Demo <a href="https://github.com/scripting/xml-rpc/blob/master/client/code.js">code</a> that calls the actual server is provided, in JavaScript.

The goal is to replace betty.userland.com with the one running here. But only after enough testing to be confident that it makes a good reference server. 

If you have success, or find problems, please post a note in the <a href="https://github.com/scripting/xml-rpc/issues">issues section</a> here. Thanks!

### Simple XML-RPC debugger

I've put up a <a href="http://scripting.com/code/xmlrpcdebugger/">simple app</a> that lets you try calling an XML-RPC procedure from an HTML form, where you supply the URL of the endpoint, the verb you want to call, and its parameters as a JavaScript expression. 

It then displays the result in JSON in a box below. 

If there's an error message it's displayed in red.

You can try calling these routines on betty.scripting.com (it's the default endpoint):

1. examples.getStateName, params = 31

2. examples.getStateNames, params = [12, 22, 32, 42]

3. examples.getStateList, params = [\[12, 22, 32, 42]\] 

4. examples.getStateStruct, params = [{state1: 3, state2: 42}] 

5. examples.getStateName, params = 900 (error)

5. noSuchName (error)

If you open the JavaScript console, you'll see the actual XML-RPC cals, in XML, as they go over the wire. <a href="http://scripting.com/images/2018/05/30/xmlRpcOverTheWire.png">Screen shot</a>.

### How params work in the xmlRpcClient

The third param to the xmlRpcClient routine is either a value or a list of values.

If it's a value, the XML-RPC procedure is called with a single parameter.

If it's a list with N elements, the procedure is called with N params. 

If you want to call a procedure with a single param that's a list, send a list with a single element that's the list. It's the one weird case for this calling convention, and is illustrated with the third call, above.

### Using JSON in place of XML

The XML-RPC standard specifies using XML, of course, but in this implementation, as an experiment, you can also use JSON.

When processing a request, we look at the first non-whitespace character. If it's a left curly brace, we treat it as JSON, not XML.

I haven't written a spec for the JSONified version, but I have created a <a href="http://scripting.com/misc/xmlrpc-in-json.html">cribsheet</a> with examples that I used to guide the implementation. 

Two types, &lt;base64> and &lt;dateTime.iso8601> are represented as strings. There is no way for the toolkit to know they are binary data or dates. This means that the XML and JSON versions are not exactly the same. Not sure what the implications of this will be. I wrote up the issue <a href="http://scripting.com/2018/06/10/152333.html">on Scripting News</a>.

### Docs and resources

I started a page at <a href="http://reboot.xmlrpc.com/">reboot.xmlrpc.com</a> with links to new stuff related to this work. 

### Questions, comments?

Post an <a href="https://github.com/scripting/xml-rpc/issues">issue</a> here. 

