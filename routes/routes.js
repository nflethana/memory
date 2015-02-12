//====================================================
//	Import libraries
//====================================================

// var db = require('../models/awsdb.js');
var logger = require('tracer').colorConsole();
var db = require('../models/KVstore.js');

//====================================================
//	Handle First Step for User Connections
//====================================================
var memoriesDB;
var pollsDB;

var init = function(memories, polls, callback) {
	memoriesDB = memories;
	pollsDB = polls;

	callback();
}

var getHome = function(req, res) {
	memories = {};
	memoriesDB.getSet('ea', function(err, data) {
		if (err) {
			logger.error(err);
		} else {
			memories = data;
			if (data == null) {
				memories = [];
			} else {
				for (i=0; i < memories.length; i++) {
					memories[i] = JSON.parse(memories[i]);
				}
			}
			res.render('home.ejs', {memories: memories});
		}
	});
}

var ajaxSavePoll = function(req, res) {
	// logger.info("in here");
	// logger.info(req.body);
	var memory = req.body;
	memoriesDB.addToSet("ea", JSON.stringify(memory), function(err, data) {
		if (err) {
			logger.error(err);
		} else {
			response = {};
			response.err = false;
			response.memory = memory;
			res.send(response);
		}
	});
}

//====================================================
//	Define Routing Functions
//====================================================

var routes = {
	init: init,
	getHome: getHome,
	ajaxSavePoll: ajaxSavePoll
};
module.exports = routes;