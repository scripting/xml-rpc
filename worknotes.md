#### 4/28/26; 11:07:14 AM by DW

Fixed a bug where there's no body to the XML-RPC request. 

Changed version to 0.5.0, previously it was 0.4.27. It's been a long time since we updated. 

#### 4/28/23; 12:16:57 PM by DW

Started this file. 

If you're looking for the browser client, for some reason it's in xmlRpcValidator.

config.nodeEditor.projects.xmlRpcValidator

These were some notes that were here before. 

betty.scripting.com

at least four endpoints

examples.getStateList

examples.getStateName

examples.getStateNames

examples.getStateStruct

good description of betty examples

http://lists.xml.org/archives/xml-dev/200003/msg00349.html

testing locally

["xmlrpc://localhost:5392/RPC2"].examples.getStateName (19)

["xmlrpc://localhost:5392/RPC2"].examples.getStateList ({12, 13, 14, 22, 44})

["xmlrpc://localhost:5392/RPC2"].examples.getStateNames (14, 35, 6, 47)

local (t); new (tabletype, @t); t.a = 12; t.b = 42; ["xmlrpc://localhost:5392/RPC2"].examples.getStateStruct (t)

testing on detroit

["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateName (19)

["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateList ({12, 13, 14, 22, 44})

["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateNames (14, 35, 6, 47)

local (t); new (tabletype, @t); t.a = 12; t.b = 42; ["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateStruct (t)

betty.scripting.com testing



wp.newtextobject (tcp.httpreadurl ("http://betty.scripting.com/nowxml"), @scratchpad.bettyboop)







["xmlrpc://betty.scripting.com:5392/RPC2"].examples.getStateName (19)

["xmlrpc://betty.scripting.com:5392/RPC2"].examples.getStateList ({12, 13, 14, 22, 44})

["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateNames (14, 35, 6, 47)

local (t); new (tabletype, @t); t.a = 12; t.b = 42; ["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateStruct (t)

betty.scripting.com errors

["xmlrpc://localhost:5392/RPC2"].examples.getStateName (900)

["xmlrpc://betty.scripting.com:5392/RPC2"].examples.getStateList ({12, 13, 14, 22, 44})

["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateNames (14, 35, 6, 47)

local (t); new (tabletype, @t); t.a = 12; t.b = 42; ["xmlrpc://detroit.scripting.com:5392/RPC2"].examples.getStateStruct (t)

