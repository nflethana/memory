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

var init = function(memories, callback) {
	memoriesDB = memories;

	callback();
}

var getHome = function(req, res) {
	res.render('home.ejs', {});
}

var ajaxSaveMemory = function(req, res) {
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
	ajaxSaveMemory: ajaxSaveMemory
};
module.exports = routes;