* 8/30/20; 11:54:08 AM by DW
   * Fixed a problem in getXmlValue where if the value was not a recognized type (i.e. not string, boolean, number, struct or array) it would generate an error because we were calling a routine that is not defined in Node.js. This should be fixed in version 0.4.26.
* 7/1/20; 9:55:06 AM by DW
   * Fix in the davexmlrpc package in xmlRpcClient. The error messaging code assumed that <i>err</i> was non-null, but the error could have been caused by response.statusCode not being 200. I fixed it so it no longer fails in that case and produces an appropriate message in the console. 
* 12/29/19; 9:09:45 AM by DW
   * Let's go ahead and do the switchover
      * xmlrpc.scripting.com becomes 1998.xmlrpc.com 
      * xmlrpc.scripting.com redirects to xmlrpc.com
      * js.xmlrpc.com becomes xmlrpc.com
   * breakage
      * This will break links to pages on xmlrpc.scripting.com other than the main pages, the home page and the spec. All others will fail. This can be fixed by re-generating the pages at teh same url on the new site. Something that's doable. 
   * Let's get the notes page on the new site too.
* 12/10/19; 9:55:40 AM by DW
   * New Shareable URL command in Tests menu in XML-RPC Debugger app.
      * choose the command and the browser opens a new tab with the params in the dialog in the URL. this makes docs and demos easier to share. 
      * here's an <a href="http://scripting.com/code/xmlrpcdebugger/?endpoint=http%3A%2F%2Fbetty.userland.com%2FRPC2&verb=examples.getStateNames&params=%5B12%2C%2022%2C%2032%2C%2042%5D&format=xml">example</a> of a URL it generates. 
   * Commented random debugging code. 
   * Testing code.
      * tcp.dns.getdottedid ("betty.scripting.com")
         * "157.230.11.43"
      * ["xmlrpc://betty.scripting.com/RPC2"].examples.getStateName (19)
         * "Maine"
      * ["xmlrpc://betty.userland.com:5392/RPC2"].examples.getStateName (19)
         * "Maine"
* 11/21/18; 9:11:46 AM by DW
   * My next project is to find out how much life is left in XML-RPC.
   * I'm going to do a simple update to the client test app, allowing you to enter the URL of an XML-RPC endpoint. Click the button to have the standard test suite, from 15 years ago, run against the server. A report displays how the server did. 
* 11/19/18; 12:35:24 PM by DW
   * work on the debugger
      * add menu bar so there's room for more functionality
* 11/1/18; 1:16:07 PM by DW
   * docs
      * Comparting XML-RPC sytax in XML and JSON with examples
   * Getting started.
