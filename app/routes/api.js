var bodyParser = require('body-parser');
var User = require('../models/User');
var jwt = require('jsonwebtoken');
var config = require('../../config');

//secret for creating the tokens
var superSecret = config.secret

module.exports = function(app, express) {

	var apiRouter = express.Router();

	//route to authenticate a user
	apiRouter.post('/authenticate', function(req, res) {
		console.log('someone tried to authenticate')
		//find the user
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

			//check if password matches
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
						token: token
					});
				}
			}
		});
		console.log("authentication done, with username = " + req.body.username + "and" + req.body.password);
	});
	//route middleware to validate a token
	apiRouter.use(function(req, res, next) {
		//do logging
		console.log('Someone tried entering');
		//check header or url params or post params for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		//decode token
		if (token) {
			//verifies secret and checks exp

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

		}else {

			//if there is no token
			//return a response of 403 (access forbidden) and an error message
			res.status(403).send({
				success: false,
				message: 'no token provided'
			});

		}
	});
	//test route to make sure that everything is working
	//accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({message: 'welcome to our api'});
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {

			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
				console.log(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			console.log(req.params.user_id);
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});
	return apiRouter;
};
