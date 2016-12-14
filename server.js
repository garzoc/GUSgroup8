//
//	Authors 		: Ioannis Gkikas
//	Description : The main server file. Using the node.js infrastructure, this file can be run in a V8 Virtual Machine.
//								all the WebServer components are imported and initialised here.The main thread starts here, as well
//								as the event loop.It is the equivalent of the void Main() function of JAVA applications
//


//
//	DEPENDENCIES - IMPORTS - LIBRARIES  -----------------------------------------------------------------------
//

// Importing external npm modules
var express = require('express');
var path = require('path')
var mongoose = require('mongoose');
var morgan = require('morgan');
var express = require('express');
var bodyParser     = require('body-parser');

// Importing our custom WebServer configuration file
var config = require('./config');
// Importing and initiating the websockets server
var server = require('./app/modules/sockets.js').init(config.socketsPortFE,config.socketsPortBE);
// Optional testing Suite
var test = require('./testing/testSuite.js');
// Initialising the express framework for handling the routing
var app = express();
//bodyparser setup
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//var modJoin=new Object;
//modJoin.serverId=0;
//var modInit=new Object;
//modInit.name="test";
//modInit.type="package";


//
//	SETUP -----------------------------------------------------------------------------------------------------
//

//Allow app to handle CORS requests - for cross domain data transfers
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//connect to our database
mongoose.connect(config.database);

//set static files location
//that are used for frontend (like images,views,libs)
app.use(express.static(__dirname + '/public'));

//Api routes
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// GET requests at host.host.host/* (Where * is anything except for the above declaration- i.e. /api)
// Triggered by simply visiting the address on a browser, sends user to the login page
//	has to be registered AFTER specific routes (like /api routes)
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});



// Start listening for HTTP traffic
app.listen(config.httpPort);

//testing init
test.startTest();

// from here on, what does all this do and why do we still need it
var modJoin=new Object;
modJoin.serverId=0;

var modInit=new Object;
modInit.name="test";
modInit.type="package";

var client=server.dummy();
var client1=server.dummy();
client.send("hej");
client1.send("hej1");
console.log(client);
console.log(client1);
server.initProcess(modInit,client);
//server.msgRelay('{"hej":"pa dig"}',client);
//server.joinProcess(modJoin,client1);
