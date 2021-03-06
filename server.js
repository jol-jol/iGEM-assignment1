// loading modules
var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var child_process = require('child_process');
var mongoose = require('mongoose');

// loading configuration
var port = process.env.PORT || 8080;

// connecting to the mongoDB database
// change db.url to the correct path first before uncomment
// mongoose.connect(db.url);

// setting the static files location
app.use(express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.use(morgan('combined'));

// parsing incoming requests
app.use(bodyParser.json());
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
				response.status(500).send(stderr);
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
	});
});

// initalize a database
child_process.exec("mongod --dbpath ./data/db",
	function(err) {console.log("problem" + err)});
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
app.get('/request-search-history', function (request, response) {
	if (!connectedToMongodb) {
		mongoose.connect('mongodb://localhost/test');
		connectedToMongodb = true;
	}
	console.log("getting");
	Query.find({}, function(err, docs) {
		console.log(docs);
		response.json({history: docs});
		response.end();
	});
});
	

// start app ==============================================
app.listen(port);

// expose app
// exports = module.expors = app;
