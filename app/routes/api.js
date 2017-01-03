//
//	Author 			: Ioannis Gkikas
//	Description : A RESTful API implementation. This file handles all the incoming requests from the
//								end client.Requests are in the form of Http Get, Post, Update, Delete verbs. Depending
//								on the type of request and the route at which it is made, this api interfaces components
//								of the webserver (modules,functions etc). Parameters req and res stand for request and response
//								respectively. All requests are utilising JSON and thus any fields can be referenced to as with
//								usual Javascript objects
//


//
//	DEPENDENCIES - IMPORTS - LIBRARIES  -----------------------------------------------------------------------
//

// Importing external npm modules
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');

// Importing our custom webserver configuration file
var config = require('../../config');

//Importing our data/mongoose Models
var User = require('../models/User');
var Sensor_hub = require('../models/Sensor_hub');
var Sensor = require('../models/Sensor');
var Value = require('../models/Value')

//secret-salt for creating the Authorization tokens
var superSecret = config.secret


//
//	BODY OF API -----------------------------------------------------------------------------------------------
//

//export declaration
module.exports = function(app, express) {

	// create an instance of the express router, to handle all different requests and routing options
	var apiRouter = express.Router();

//
// ROUTES-REQUEST HANDLING ------------------------------------------------------------------------------------
//

	// POST request at host.host.host/api/users - used for creating a new user/registration
	apiRouter.post('/users', function(req, res) {
		// create a new instance of the User model
		var user = new User();
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		// Native mongoose model function, to add a new user
		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else
					return res.send(err);
			}

			// return a message
			res.json({ message: 'User created!' , success: true });
		});
	});


	// GET request at host.host.host/api/me - Used to get the current user information from the DB
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	//accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({message: 'welcome to our api'});
	});

	// POST request at host.host.host/api/packages - Used to get the sensor hubs for a user from the DB
	apiRouter.post('/packages', function(req, res) {
		Sensor_hub.find({owner : req.body.username}).exec(function(err, hub) {
			if (err) throw err;
			console.log(req.body.username);
			// returns a list of sensor hubs
			res.json({
				array : hub
			});
		});
	});

	// POST request at host.host.host/api/sensors - Used to get the sensors for a user's sensor hub from the DB
	apiRouter.post('/sensors', function(req, res) {
		Sensor.find({owner : req.body.username, host : req.body.sensor_hub}).exec(function(err, sensor) {
			if (err) throw err;
			res.json({
				// returns a list of sensors
				array : sensor
			});
		});
	});

	apiRouter.post('/details', function(req, res) {
		var value = new Value();
		var digest = value.getDigest(req.body.sensor_id, req.body.range, function(digest){
			res.json({
				values : digest
			});
		});

	});

	// POST at host.host.host/api/authenticate - Used to transfer login attempts to the server and validate a user
	apiRouter.post('/authenticate', function(req, res) {
		console.log('someone tried to authenticate')
		//Native mongoose model function, to find a user
		User.findOne({
			username : req.body.username
		}).select('username password').exec(function(err, user) {
			if (err) throw err;

			//no user with that username
			if (!user) {
				res.json({
					success: false,
					message: 'Auth failed.No such user'
				});

			} else if (user) {

			//check if password matches with custom model function
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Auth failed, wrong password'
					});
				} else {
					//if user gave correct password
					//create a token
					var token = jwt.sign({
							username : user.username
						}, superSecret
					);

					//return the information including token  as json
					res.json({
						success: true,
						message: 'Auth successful',
						token: token,
						user: req.body.username
					});
				}
			}
		});
	});


	//
	// MIDDLEWARE - TOKEN VALIDATION ----------------------------------------------------------------------------
	//


	//route middleware to validate a token
	apiRouter.use(function(req, res, next) {
		//check header or url params or post params for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//decode token if one was found
		if (token) {
			//verifies secret-salt

			jwt.verify(token, superSecret, function(err, decoded) {

				if(err) {
					res.status(403).send({
						success: false,
						message: 'Failed to auth token'
					});
				} else {
					//if everything went well,save to request for other routes
					req.decoded = decoded;
					next();// only continue if you have the right token
				}
			});
		}
	});

	return apiRouter;
};
