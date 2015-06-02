// loading modules
var express = require('express')
var app = express(); // I would put this after all the modules, but totally personal pref.
var bodyParser = require('body-parser');
var methodOverride = require('method-override'); // cool, didn't know about this
var morgan = require('morgan');
var child_process = require('child_process');
var mongoose = require('mongoose');

// loading configuration
var port = process.env.PORT || 8080; // +1 for process.env.PORT, but did you set it? or just use 8080

// connecting to the mongoDB database
// change db.url to the correct path first before uncomment
// mongoose.connect(db.url);

// setting the static files location
app.use(express.static(__dirname + '/public')); // +1 for __dirname, just 'public' works too lol
app.use('/libs', express.static(__dirname + '/public/libs'));

app.use(morgan('combined'));

// parsing incoming requests
app.use(bodyParser.json()); // I would have put a new line or 2 here, switching from middleware to routes
app.post('/request-conversion', function (request, response) {
	origin = "";
	destination = "";
	switch(request.body.from) {
		case(0): origin = "DNA"; break;
		case(1): origin = "RNA"; break;
		case(2): origin = "protein";
	}
	switch(request.body.to) {
		case(0): destination = "DNA"; break;
		case(1): destination = "RNA"; break;
		case(2): destination = "protein";
	}
	child_process.exec(
		"python3 sequence.py " + origin + ' ' + 
		destination + ' ' + request.body.content,
		function(err, stdout, stderr) {
			if (err) {
				response.status(500).send(stderr); // awesome
				return;
			}
			response.end(stdout);
			var newQuery = new Query({
				id:	currentID,
				date:	new Date(),
				from:	origin,
				to:	destination,
				query:	request.body.content,
				result: stdout
			});
			newQuery.save();
			currentID ++;
                        // cool that you did currentID's, but where does this
                        // come from? ah nvm line 76 lol. It's good convention
                        // to make sure variables are declared before there are
                        // used. (even though in this case it still works)
                        // Also the way you did this, the currentID starts from
                        // 1 every time the server is restarted
	});
});

// initalize a database
//child_process.exec("mongod --dbpath ./data/db", function(err) {console.log("problem" + err)});
// using child process to init mongo is cool, but in a real situation you
// wouldn't do this since it adds another level of confusion. and usually an
// entire server(s) is dedicated to only MongoDB and another server(s) is just
// for the Node API. and yeah this was too specific, failed on my machine. so I 
// commented it out.

var connectedToMongodb = false;
var Schema = mongoose.Schema;
var querySchema = new Schema({
	id:		Number,
	date:	Date,
	from:	String,
	to:		String,
	query:	String,
	result:	String
});
var Query = mongoose.model('Query', querySchema);
var currentID = 1;
// see above, I think this gets reset back to 1 every time the server
// restarts..
app.get('/request-search-history', function (request, response) {
	if (!connectedToMongodb) {
		mongoose.connect('mongodb://localhost/test');
		connectedToMongodb = true;
	}
        // what about the post route? no "!connectedToMongodb" in there
        // so what happens if you POST /request-conversion before 
        // GET /request-search-history ?
	console.log("getting");
	Query.find({}, function(err, docs) {
		console.log(docs);
		response.json({history: docs});
		response.end();
	});
});
	

// start app ==============================================
app.listen(port);

// should notify about startup:
console.log('Express server listenting on port ' + port);

// expose app
// exports = module.expors = app; // typo here lol. but yeah sometimes people do
// this and then require in the app instance in other files to apply middleware,
// routes, etc.
