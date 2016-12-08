//var mqtt = require('mqtt');
//var mqttClient  = mqtt.connect('mqtt://broker.hivemq.com');
var express = require('express');
var path = require('path')
var mongoose = require('mongoose');
var morgan = require('morgan');
var express = require('express');
var config = require('./config');
var bodyParser     = require('body-parser');
var server = require('./app/modules/sockets.js').init(8000,1338);
var query = require('./app/models/QueryBuilder.js'); //remove after testing
var app = express();

//console.log(server);
//var client=server.msgRelay("aas");

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
server.joinProcess(modJoin,client1);

//bodyparser setup
app.use(bodyParser.json());
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//Allow app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

//log all requests to console
//app.use(morgan('dev'));


//connect to our database
//mongoose.Promise = global.Promise; //problem with mongoose promises
mongoose.connect("mongodb://localhost:27017/test");

//set static files location
//that are used for frontend (like images,views,libs)
app.use(express.static(__dirname + '/public'));

//Api routes
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

//main catch-all routes
//sends users to frontend
//has to be registered AFTER specific routes (like /api routes)
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

var a = {
	sensor_package : "Bathroom",
	user : "admin",
	group : "random",
	value : "145",
	sensorID : "temperature",
	sensor_unit : "oC",
	smart_mirror_ID : "wedontcare",
	timestamp : Date.now()
};

//query.checkUser(a);
app.listen(config.port);
