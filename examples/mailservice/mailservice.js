const xmlrpc = require ("davexmlrpc");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 
const mail = require ("davemail");
const persists = require ("persists");
const fs = require ("fs");

var config = {
	port: 1417,
	flPostEnabled: true,
	flLogToConsole: true, 
	flAllowAccessFromAnywhere: true, //3/8/20 by DW
	xmlRpcPath: "/rpc2",
	archiveFolder: "data/archive/"
	}
var stats;

function initStats (callback) {
	const initialStats = {
		fileSerialnum: 0
		};
	persists ("stats", initialStats, undefined, function (sharedObject) {
		stats = sharedObject;
		callback ();
		});
	}
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
		utils.sureFilePath (f, function () {
			fs.writeFile (f, utils.jsonStringify (obj), function (err) {
				});
			});
		});
	}

initStats (function () {
	xmlrpc.startServerOverHttp (config, function (xmlRpcRequest) {
		switch (xmlRpcRequest.verb) {
			case "mail.send":
				mailSend (xmlRpcRequest.params, xmlRpcRequest.returnVal);
				return (true); //we handled it
			}
		return (false); //we didn't handle it
		});
	});
