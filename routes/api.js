// Dependencies
var express = require('express');
var router = express.Router();

// Models
var Data = require('../models/data');

// Routes
Data.methods(['get', 'put', 'post', 'delete']);
Data.register(router, '/data');

// Return router
module.exports = router;