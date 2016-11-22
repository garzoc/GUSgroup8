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
	//api route to get info on current user
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});
	//test route to make sure that everything is working
	//accessed at GET http://localhost:8080/api
	apiRouter.get('*', function(req, res) {
		console.log("hej");
		res.json({message: 'welcome to our api'});
	});
	return apiRouter;
};
