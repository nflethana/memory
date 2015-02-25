//====================================================
//	Initial Setup code...
//====================================================

var express = require('express');
var routes = require('./routes/routes.js');
var http = require('http');
var path = require('path');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var async = require('async');
var async = require('crypto');

app.set('port', process.env.PORT || 8080);
app.engine('ejs', engine);
app.set('views', path.join( __dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use( express.static( path.join( __dirname, 'public' )));

app.use(cookieParser());
app.use(session({
	secret: "thisisaSECRET", 
}));

var aws = require("./models/KVstore.js");

var memories = new aws('memories')
var polls = new aws('polls')

memories.init(function() {
polls.init(function() {

	//====================================================
	//	Routes Setup
	//====================================================
	routes.init(memories, polls, function() {
		// app.get('/ea', routes.getHome);
		// app.post('/ajax/saveMemory', routes.ajaxSaveMemory);
		app.get('/', routes.getHome);
		app.post('/ajax/savePoll', routes.ajaxSavePoll);
		app.get('/poll/:question', routes.getPoll);
		app.get('/vote/:poll/:response', routes.getVote);

		//====================================================
		//	Run the Server
		//====================================================

		app.listen(app.get('port'));
		console.log('Server on ' + app.get('port') + ' ===========================');
	});

});
});