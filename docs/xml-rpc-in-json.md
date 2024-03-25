<i>June 2018 by Dave Winer</i> 

# XML-RPC-in-JSON examples

The new <a href="/">JavaScript toolkit</a> for XML-RPC supports a <a href="/#using-json-in-place-of-xml">JSON syntax</a>.

Below are five examples first showing the standard XML-RPC syntax followed by the experimental JavaScript syntax.

### Single param

```xml<methodCall>	<methodName>examples.getStateName</methodName>	<params>		<param>			<value><int>50</int></value>			</param>		</params>	</methodCall>```

```json{	"methodCall": {		"methodName": "examples.getStateName",		"params": [			23			]		}	}```

### Param is an array

```xml<methodCall>	<methodName>examples.getStateList</methodName>	<params>		<param>			<value>				<array>					<data>						<value><int>12</int></value>						<value><int>44</int></value>						<value><int>4</int></value>						<value><int>1</int></value>						</data>					</array>				</value>			</param>		</params>	</methodCall>```

```json{	"methodCall": {		"methodName": "examples.getStateList",		"params": [			[				12,				44,				4				]			]		}	}```

### Param is a struct

```xml<methodCall>	<methodName>examples.getStateStruct</methodName>	<params>		<param>			<value>				<struct>					<member>						<name>state1</name>						<value>							<int>12</int>							</value>						</member>					<member>						<name>state2</name>						<value>							<int>8</int>							</value>						</member>					</struct>				</value>			</param>		</params>	</methodCall>```

```json{	"methodCall": {		"methodName": "examples.getStateStruct",		"params": [			{				"state1": 12,				"state2": 8				}			]		}	}```

### Normal, non-error response

```xml<methodResponse>	<params>		<param>			<value>				<string>South Carolina</string>				</value>			</param>		</params>	</methodResponse>```

```json{	"methodResponse": {		"value": "South Carolina"		}	}```

### Error response

```xml<methodResponse>	<fault>		<value>			<struct>				<member>					<name>faultCode</name>					<value><i4>1</i4></value>					</member>				<member>					<name>faultString</name>					<value><string>Can't delete the file because it doesn't exist.</string></value>					</member>				</struct>			</value>		</fault>	</methodResponse>```

```json{	"methodResponse": {		"fault": {			"faultCode": 1,			"faultString": "Can't delete the file because it doesn't exist."			}		}	}```

