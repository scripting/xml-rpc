# XML-RPC

An XML-RPC client and server in JavaScript.

* Client and server for Node.js.

* Client for the browser.

* Pure JavaScript.

* Written by one of the designers of the protocol.

### Client and server for Node.js

### Client for the browser

The core file for the browser version is <a href="https://github.com/scripting/xml-rpc/blob/master/client/xmlrpc.js">xmlrpc.js</a> in the client folder. 

It uses routines in several of my libraries: 

utils.js -- stringMid, stringNthField, filledString, encodeXml, 

xml.js -- xmlGetAddress, 

It also uses jQuery.

The demo app, in index.html and its two included files, code.js and styles.css, make six calls to the betty server, two to test error reporting, and four to test various combinations of scalars, parameter lists, structs and array. 

The betty server it calls is a clone of the one we used in the earlier work on XML-RPC.

