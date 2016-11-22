//var mqtt = require('mqtt');
//var mqttClient  = mqtt.connect('mqtt://broker.hivemq.com');
var mongoose = require('mongoose');


//connect to our database
//mongoose.Promise = global.Promise; //problem with mongoose promises
mongoose.connect("mongodb://localhost:27017/test");

var User = require('./app/models/User');
var user = new User();		// create a new instance of the User model // set the users name (comes from the request)
user.username ="admin";  // set the users username (comes from the request)
user.password = "admin";  // set the users password (comes from the request)
user.save();


