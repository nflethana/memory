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
	// memories = {};
	// memoriesDB.getSet('ea', function(err, data) {
	// 	if (err) {
	// 		logger.error(err);
	// 	} else {
	// 		memories = data;
	// 		if (data == null) {
	// 			memories = [];
	// 		} else {
	// 			for (i=0; i < memories.length; i++) {
	// 				memories[i] = JSON.parse(memories[i]);
	// 			}
	// 		}
	// 		res.render('home.ejs', {memories: memories});
	// 	}
	// });

	pollsDB.scanKeys(function(err, keys) {
		if (err) logger.error(err);
		else {
			// logger.info(keys);
			res.render('home.ejs', {PollQuestions: keys});
		}
	});
}

var ajaxSavePoll = function(req, res) {
	// logger.info("in here");
	// logger.infod(req.body);
	var poll = req.body;
	pollsDB.addToSet(poll.question, JSON.stringify(poll), function(err, data) {
		if (err) {
			logger.error(err);
		} else {
			response = {};
			response.err = false;
			response.poll = poll;
			res.send(response);
		}
	});
}

var getPoll = function(req, res) {
	pollsDB.getSet(req.params.question, function(err, data) { 
		if (err) logger.info(err);
		else {
			res.render("poll.ejs", {Polls: data})
		}
	});
}

//====================================================
//	Define Routing Functions
//====================================================

var routes = {
	init: init,
	getHome: getHome,
	ajaxSavePoll: ajaxSavePoll,
	getPoll: getPoll
};
module.exports = routes;