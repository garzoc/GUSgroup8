// Dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var mongodb = require ('mongodb');

var uri = 'mongodb://localhost/gr8db'
// MongoDB
mongoose.connect(uri);//, function(error, db);
// {
		// DB operations
//  	if (error){
//  		console.log(error);
//  		process.exit(1);
//  	}
//  	// Insert into collection
//  	db.collection('sensordata').Insert({x: 1}, function(error, result) {
//  		if (error) {
//  			console.log (error);
// 			process.exit(1);
// 		}
//  		// Query 
// 		db.collection ('sensordata').find.toArray(function(error, docs) {
//  			if (error){
//  				console.log(error);
// 				process.exit(1);

//  			}
// 				console.log('Found docs:');
// 				docs.forEach (function(doc) {
// 					console.log(JSON.stringify(doc));
// 				});
// 				process.exit(0);
//  		});
//  	});
// });
// {
// 	// DB operations
//  	if (error){
//  		console.log(error);
//  		process.exit(1);
//  	}
//  	// Insert into collection
//  	db.collection ('sensordata').Insert({x: 1}, function(error, result) {
//  		if (error) {
//  			console.log (error);
// 			process.exit(1);
// 		}
//  		//
// 		db.collection ('sensordata').find.toArray(function(error, docs) {
//  			if (error){
//  				console.log(error);
// 				process.exit)(1);

//  			}
// 				console.log('Found docs:');
// 				docs.forEach (function(doc) {
// 					console.log(JSON.stringify(doc));
// 				});
// 				process.exit(0);
//  		});
//  	});
//  };

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api', require('./routes/api'));

// Start server
app.listen(3000);
console.log('Listening on port 3000...');