const xmlrpc = require ("./lib/xmlrpc.js");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const mail = require ("davemail");
const fs = require ("fs");

var config = {
	port: 1417,
	flPostEnabled: true,
	flLogToConsole: true, 
	xmlRpcPath: "/rpc2",
	archiveFolder: "data/archive/",
	fnameStats: "data/stats.json"
	}
var stats = {
	fileSerialnum: 0
	};
var flStatsChanged = false;

function statsChanged () {
	flStatsChanged = true;
	}
function readStats (callback) {
	fs.readFile (config.fnameStats, function (err, data) {
		if (!err) {
			try {
				var jstruct = JSON.parse (data);
				for (var x in jstruct) {
					stats [x] = jstruct [x];
					}
				}
			catch (err) {
				}
			}
		callback ();
		});
	}
function everySecond () {
	if (flStatsChanged) {
		flStatsChanged = false;
		utils.sureFilePath (config.fnameStats, function () {
			fs.writeFile (config.fnameStats, utils.jsonStringify (stats), function (err) {
				});
			});
		}
	}

setInterval (everySecond, 1000); 
readStats (function () {
	xmlrpc.startServerOverHttp (config, function (xmlRpcRequest) {
		function mailSend (params, callback) {
			var recipient = params [0];
			var title = params [1];
			var mailtext = params [2];
			var sender = params [3];
			mail.send (recipient, title, mailtext, sender, function (err, data) {
				callback (err, data);
				var now = new Date ();
				var obj = {
					recipient, title, mailtext, sender,
					when: now
					};
				if (err) {
					obj.err = err;
					}
				var f = config.archiveFolder + utils.getDatePath (now) + utils.padWithZeros (stats.fileSerialnum++, 4) + ".json";
				statsChanged ();
				utils.sureFilePath (f, function () {
					fs.writeFile (f, utils.jsonStringify (obj), function (err) {
						});
					});
				});
			}
		switch (xmlRpcRequest.verb) {
			case "mail.send":
				mailSend (xmlRpcRequest.params, xmlRpcRequest.returnVal);
				return (true); //we handled it
			}
		return (false); //we didn't handle it
		});
	});


