<i>Tue, Jun 15, 1999; by Dave Winer.</i>

# XML-RPC Specification

<i><a href="#update3">Updated 6/30/03 DW</a></i><br><i><a href="#update2">Updated 10/16/99 DW</a></i><br><i><a href="#update1">Updated 1/21/99 DW</a></i>

This specification documents the XML-RPC protocol implemented in <a href="http://frontier.userland.com/">UserLand Frontier</a> 5.1. 

For a non-technical explanation, see <a href="http://davenet.userland.com/1998/07/14/xmlRpcForNewbies">XML-RPC for Newbies</a>. 

This page provides all the information that an implementor needs.

### Overview

XML-RPC is a Remote Procedure Calling protocol that works over the Internet.

An XML-RPC message is an HTTP-POST request. The body of the request is in XML. A procedure executes on the server and the value it returns is also formatted in XML.

Procedure parameters can be scalars, numbers, strings, dates, etc.; and can also be complex record and list structures.

### Request example

Here's an example of an XML-RPC request:

```xml

POST /RPC2 HTTP/1.0

User-Agent: Frontier/5.1.2 (WinNT)

Host: betty.userland.com

Content-Type: text/xml

Content-length: 181



<?xml version="1.0"?>

<methodCall>

<methodName>examples.getStateName</methodName>

<params>

<param>

<value><i4>41</i4></value>

</param>

</params>

</methodCall>

```

### Header requirements



The format of the URI in the first line of the header is not specified. For example, it could be empty, a single slash, if the server is only handling XML-RPC calls. However, if the server is handling a mix of incoming HTTP requests, we allow the URI to help route the request to the code that handles XML-RPC requests. (In the example, the URI is /RPC2, telling the server to route the request to the "RPC2" responder.)



A User-Agent and Host must be specified. 



The Content-Type is text/xml. 



The Content-Length must be specified and must be correct.



### Payload format



The payload is in XML, a single &lt;methodCall> structure.



The &lt;methodCall> must contain a &lt;methodName> sub-item, a string, containing the name of the method to be called. The string may only contain identifier characters, upper and lower-case A-Z, the numeric characters, 0-9, underscore, dot, colon and slash. It's entirely up to the server to decide how to interpret the characters in a methodName. 



For example, the methodName could be the name of a file containing a script that executes on an incoming request. It could be the name of a cell in a database table. Or it could be a path to a file contained within a hierarchy of folders and files.



If the procedure call has parameters, the &lt;methodCall> must contain a &lt;params> sub-item. The &lt;params> sub-item can contain any number of &lt;param>s, each of which has a &lt;value>. 



### <a name="scalars">Scalar &lt;value>s</a>



&lt;value>s can be scalars, type is indicated by nesting the value inside one of the tags listed in this table:



<table cellspacing=3 border=0>

<tr><td valign="top"><b>Tag</b></td><td valign="top" width="35%"><b>Type</b></td><td valign="top"><b>Example</b></td></tr>



<tr><td valign="top">&lt;i4> or &lt;int></td><td valign="top" width="35%">four-byte signed integer</td><td valign="top">-12</td></tr>



<tr><td valign="top">&lt;boolean></td><td valign="top">0 (false) or 1 (true)</td><td valign="top">1</td></tr>



<tr><td valign="top">&lt;string></td><td valign="top">string</td><td valign="top">hello world</td></tr>



<tr><td valign="top">&lt;double></td><td valign="top">double-precision signed floating point number</td><td valign="top">-12.214</td></tr>



<tr><td valign="top">&lt;dateTime.iso8601></td><td valign="top">date/time</td><td valign="top">19980717T14:08:55</td></tr>



<tr><td valign="top">&lt;base64></td><td valign="top">base64-encoded binary</td><td valign="top">eW91IGNhbid0IHJlYWQgdGhpcyE=</td></tr>

</table>



If no type is indicated, the type is string.



### &lt;struct>s



A value can also be of type &lt;struct>.



A &lt;struct> contains &lt;member>s and each &lt;member> contains a &lt;name> and a &lt;value>. 



Here's an example of a two-element &lt;struct>:



<pre>

&lt;struct>

&lt;member>

&lt;name>lowerBound&lt;/name>

&lt;value>&lt;i4>18&lt;/i4>&lt;/value>

&lt;/member>

&lt;member>

&lt;name>upperBound&lt;/name>

&lt;value>&lt;i4>139&lt;/i4>&lt;/value>

&lt;/member>

&lt;/struct>

</pre>



&lt;struct>s can be recursive, any &lt;value> may contain a &lt;struct> or any other type, including an &lt;array>, described below.



### &lt;array>s



A value can also be of type &lt;array>.



An &lt;array> contains a single &lt;data> element, which can contain any number of &lt;value>s.



Here's an example of a four-element array:



<pre>

&lt;array>

&lt;data>

&lt;value>&lt;i4>12&lt;/i4>&lt;/value>

&lt;value>&lt;string>Egypt&lt;/string>&lt;/value>

&lt;value>&lt;boolean>0&lt;/boolean>&lt;/value>

&lt;value>&lt;i4>-31&lt;/i4>&lt;/value>

&lt;/data>

&lt;/array>

</pre>



&lt;array> elements do not have names. 



You can mix types as the example above illustrates.



&lt;arrays>s can be recursive, any value may contain an &lt;array> or any other type, including a &lt;struct>, described above.



### Response example



Here's an example of a response to an XML-RPC request:



<pre>

HTTP/1.1 200 OK

Connection: close

Content-Length: 158

Content-Type: text/xml

Date: Fri, 17 Jul 1998 19:55:08 GMT

Server: UserLand Frontier/5.1.2-WinNT



&lt;?xml version="1.0"?>

&lt;methodResponse>

&lt;params>

&lt;param>

&lt;value>&lt;string>South Dakota&lt;/string>&lt;/value>

&lt;/param>

&lt;/params>

&lt;/methodResponse>

</pre>



### Response format



Unless there's a lower-level error, always return 200 OK.



The Content-Type is text/xml. Content-Length must be present and correct.



The body of the response is a single XML structure, a &lt;methodResponse>, which can contain a single &lt;params> which contains a single &lt;param> which contains a single &lt;value>.



<a name="faults"></a>The &lt;methodResponse> could also contain a &lt;fault> which contains a &lt;value> which is a &lt;struct> containing two elements, one named &lt;faultCode>, an &lt;int> and one named &lt;faultString>, a &lt;string>.



A &lt;methodResponse> can not contain both a &lt;fault> and a &lt;params>.



### Fault example



<pre>

HTTP/1.1 200 OK

Connection: close

Content-Length: 426

Content-Type: text/xml

Date: Fri, 17 Jul 1998 19:55:02 GMT

Server: UserLand Frontier/5.1.2-WinNT



&lt;?xml version="1.0"?>

&lt;methodResponse>

&lt;fault>

&lt;value>

&lt;struct>

&lt;member>

&lt;name>faultCode&lt;/name>

&lt;value>&lt;int>4&lt;/int>&lt;/value>

&lt;/member>

&lt;member>

&lt;name>faultString&lt;/name>

&lt;value>&lt;string>Too many parameters.&lt;/string>&lt;/value>

&lt;/member>

&lt;/struct>

&lt;/value>

&lt;/fault>

&lt;/methodResponse>

</pre>



### <a name="goals">Strategies/Goals</a>



<i>Firewalls.</i> The goal of this protocol is to lay a compatible foundation across different environments, no new power is provided beyond the capabilities of the CGI interface. Firewall software can watch for POSTs whose Content-Type is text/xml. 



<i>Discoverability.</i> We wanted a clean, extensible format that's very simple. It should be possible for an HTML coder to be able to look at a file containing an XML-RPC procedure call, understand what it's doing, and be able to modify it and have it work on the first or second try. 



<i>Easy to implement.</i> We also wanted it to be an easy to implement protocol that could quickly be adapted to run in other environments or on other operating systems.



### <a name="update1">Updated 1/21/99 DW</a>

The following questions came up on the UserLand <a href="http://discuss.userland.com/">discussion group</a> as XML-RPC was being implemented in Python. <ul>

<li>The Response Format section says "The body of the response is a single XML structure, a &lt;methodResponse>, which <i>can</i> contain a single &lt;params>..." This is confusing. Can we leave out the  &lt;params>?

No you cannot leave it out if the procedure executed successfully. There are only two options, either a response contains a &lt;params> structure or it contains a &lt;fault> structure. That's why we used the word "can" in that sentence.

<li>Is "boolean" a distinct data type, or can boolean values be interchanged with integers (e.g. zero=false, non-zero=true)? 

Yes, boolean is a distinct data type. Some languages/environments allow for an easy coercion from zero to false and one to true, but if you mean true, send a boolean type with the value true, so your intent can't possibly be misunderstood.

<li>What is the legal syntax (and range) for integers? How to deal with leading zeros? Is a leading plus sign allowed? How to deal with whitespace? 

An integer is a 32-bit signed number. You can include a plus or minus at the beginning of a string of numeric characters. Leading zeros are collapsed. Whitespace is not permitted. Just numeric characters preceeded by a plus or minus.

<li>What is the legal syntax (and range) for floating point values (doubles)? How is the exponent represented? How to deal with whitespace? Can infinity and "not a number" be represented? 

There is no representation for infinity or negative infinity or "not a number". At this time, only decimal point notation is allowed, a plus or a minus, followed by any number of numeric characters, followed by a period and any number of numeric characters. Whitespace is not allowed. The range of allowable values is implementation-dependent, is not specified.

<li>What characters are allowed in strings? Non-printable characters? Null characters? Can a "string" be used to hold an arbitrary chunk of binary data? 

Any characters are allowed in a string except &lt; and &, which are encoded as &amp;lt; and &amp;amp;. A string can be used to encode binary data.

<li>Does the "struct" element keep the order of keys. Or in other words, is the struct "foo=1, bar=2" equivalent to "bar=2, foo=1" or not? 

The struct element does not preserve the order of the keys. The two structs are equivalent.

<li>Can the &lt;fault> struct contain other members than &lt;faultCode> and &lt;faultString>? Is there a global list of faultCodes? (so they can be mapped to distinct exceptions for languages like Python and Java)? 

A &lt;fault> struct <b>may not</b> contain members other than those specified. This is true for all other structures. We believe the specification is flexible enough so that all reasonable data-transfer needs can be accomodated within the specified structures. If you believe strongly that this is not true, please post a message on the discussion group.

There is no global list of fault codes. It is up to the server implementer, or higher-level standards to specify fault codes.

<li>What timezone should be assumed for the dateTime.iso8601 type? UTC? localtime? 

Don't assume a timezone. It should be specified by the server in its documentation what assumptions it makes about timezones.

</ul>



### Additions

<ul>

<li>&lt;base64> type. 1/21/99 DW.

</ul>

### <a name="update3">Updated 6/30/03 DW</a>



Removed "ASCII" from definition of string.



Changed copyright dates, below, to 1999-2003 from 1998-99.



### <a name="update2">Copyright and disclaimer</a>

&copy; Copyright 1998-2003 UserLand Software. All Rights Reserved.

This document and translations of it may be copied and furnished to others, and derivative works that comment on or otherwise explain it or assist in its implementation may be prepared, copied, published and distributed, in whole or in part, without restriction of any kind, provided that the above copyright notice and these paragraphs are included on all such copies and derivative works.  

This document may not be modified in any way, such as by removing the copyright notice or references to UserLand or other organizations. Further, while these copyright restrictions apply to the written XML-RPC specification, no claim of ownership is made by UserLand to the protocol it describes. Any party may, for commercial or non-commercial purposes, implement this protocol without royalty or license fee to UserLand. The limited permissions granted herein are perpetual and will not be revoked by UserLand or its successors or assigns.

This document and the information contained herein is provided on an "AS IS" basis and USERLAND DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT THE USE OF THE INFORMATION HEREIN WILL NOT INFRINGE ANY RIGHTS OR ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.

