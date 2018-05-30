# XML-RPC

An XML-RPC client and server in JavaScript.

* Client and server for Node.js.

* Client for the browser.

* Pure JavaScript.

* Written by one of the <a href="http://scripting.com/?tab=about">designers</a> of the protocol.

### Client and server for Node.js

It's available as davexmlrpc on NPM.

``npm install davexmlrpc

Example <a href="https://github.com/scripting/xml-rpc/tree/master/examples/betty">server</a> is provided. 

It is designed to be hooked up to any protocol, not just HTTP. For example, you could use XML-RPC to communicate over websockets.

The RPC handlers in the betty example are coded in the app, but in other apps they could be loaded from the file system, a database, or an S3 bucket. The design isn't bound to any storage method for handlers. 

It's designed to be used where ever you can use Node apps. 

### Client for the browser

The core code for the browser version is <a href="https://github.com/scripting/xml-rpc/blob/master/client/xmlrpc.js">xmlrpc.js</a> in the client folder. 

It uses routines in several of my libraries: 

* utils.js -- stringMid, stringNthField, filledString, encodeXml.

* xml.js -- xmlGetAddress.

It also uses jQuery.

The demo app, in <a href="https://github.com/scripting/xml-rpc/blob/master/client/index.html">index.html</a> and its two included files, code.js and styles.css, make six calls to the betty server, two to test error reporting, and four to test various combinations of scalars, parameter lists, structs and array. 

The betty server it calls is a clone of the one we used in the earlier work on XML-RPC.

You can run the test app <a href="http://scripting.com/code/xmlrpcbrowserclient/">from</a> scripting.com.   

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

### How params work in the xmlRpcClient

The third param to the xmlRpcClient routine is either a value or a list of values.

If it's a value, the XML-RPC procedure is called with a single parameter.

If it's a list with N elements, the procedure is called with N params. 

If you want to call a procedure with a single param that's a list, send a list with a single element that's the list. It's the one weird case for this calling convention, and is illustrated with the third call, above.

### Questions, comments?

Post an <a href="https://github.com/scripting/xml-rpc/issues">issue</a> here. 

