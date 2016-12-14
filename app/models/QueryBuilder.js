//
//	Author 			: Ioannis Gkikas, Sami Sindi
//	Description : The driver of the database. This file includes all needed queries for storing and getting data from
//                the database.Prospective developers can add their own custom queries here.All queries are done
//                utilising mongoDB standards.
//

//
//  IMPORT ---------------------------------------------------------------------------------------------------
//

// Import all our models
var User = require('../models/User');
var Sensor = require('../models/Sensor');
var Sensor_hub =require('../models/Sensor_hub');
var Value =require('../models/Value');


//
//  EXPORTED FUNCTIONS ----------------------------------------------------------------------------------------
//

module.exports = {
  //procedure to check if user with a username exists and if not discard message.
  //if the user exists, start the chain of checks that shall result in the storing of all individual values
  checkUser:function(message){
    User.findOne({"username" : message.user}).exec(function(err, user) {
      if (!user) {
        //discard message
        console.log("discarded msg" + Date.now());
      }
      else {
        //goto next step - find which package we are referencing
      fetchHub(message);
      }
    });
  }
  //rangeFinder:function(options){
  // case x of options -> refer to x internal function for ranges
  //}
  //
}

//
// INTERNAL FUNCTIONS ----------------------------------------------------------------------------------------
//

//procedure to fetch hub with owner and name provided by incoming message
function fetchHub(message) {
  //native mongoose function to find a specific sensor_hub
  Sensor_hub.findOne({"owner" : message.user, "hub_name" : message.sensor_hub}).exec(function(err,sensor_hub) {
    if (err) return handleError(err);

    // if there isn't a sensor hub with this name and owner create one
    if (!sensor_hub) {
      var sensor_hub = new Sensor_hub();
      sensor_hub.owner = message.user;
      sensor_hub.hub_name = message.sensor_hub;
      //native mongoose function to save a document of the model Sensor_hub
      sensor_hub.save(function(err) {
  			if (err) {
  				// duplicate entry
  				if (err.code == 11000)
  					return console.log('A hub with that username already exists.');
  				else
  					return console.log(err);
  			}
  			console.log('Hub created!');
        fetchSensor(message);
  		});

    } else {
      //proceed if there is already a sensor hub with that name owned by this username
      fetchSensor(message);
  }

  });
};


// procedure to fetch specific hub from the db with the provided owner,name and host of the incoming message
  function fetchSensor(message) {
  // native mongoose function to retrieve a specific sensor
  Sensor.findOne({"sensor_id" : message.sensorID, "owner" : message.user, "host" : message.sensor_hub}).exec(function(err,sensor) {
    //if the sensor doesnt exist in the database create one - probably the user just now set up the new sensor
    if (!sensor) {
      // new document of model Sensor
      var sensor = new Sensor();
      sensor.owner = message.user;
      sensor.sensor_id = message.sensorID;
      sensor.unit_type = message.sensor_unit;
      sensor.host = message.sensor_hub;
      //native mongoose function to save a document of model Sensor
      sensor.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000)
            return console.log('A sensor with that name under that package and user already exists. ');
          else
            return console.log(err);
        }

        // return a message
        console.log('Sensor created!');
        storeValue(message);
      });
    } else {
      //store the  value
      storeValue(message);
    }

  });
};

// Storing the value from the incoming message
function storeValue(message){
  // new object of the model Value
  var input = new Value();
  input.timestamp = Date.now();
  input.value = message.value;
  //way of creating a unique reference key for a specific sensor
  input.sensor_id = message.user + message.sensor_hub + message.sensorID;
  // native mongoose function to save a new document of the model Value
  input.save(function(err) {
    if (err) {
      // duplicate entry
      if (err.code == 11000)
        return console.log('A hub with that name already exists. ');
      else
        return console.log(err);
    }
    console.log('value stored!');
  });
};

/*
//queries with packages
PackageSchema.methods.range(query)= {
  //query is a string that can only hold three different string values : hour, day, week
  var pack = this;
  var d = Date.now()
  hour = d.getHour();


  if (query == "hour") {
  //remove quotes from timestamp
  //pass timestamp to function
function rangeHour(){
	pack.find({
		"timestamp": {$lt: d, $gt: d(hour - 1) }
	})

}
}
  else if (query == "day") {
function rangeDay(){
	pack.find({
		"timestamp": {$lt: d, $gt: d(hour - 24) }
	})

}
}
  else if (query == "week") {


function rangeWeek(){
	pack.find({
		"timestamp": {$lt: d, $gt: d(hour - 168) }
	})

}
}
}
end of query functions */


//save
 // Jmsg.save(function (err) {
 //    if (err) return handleError(err);
 //    console.log(err, 'Uh oh! something went wrong: save failed ')
 //  });


//need to test is this work!
// This should view the result from 5 days ago to the current date..to be aded to the rest of the queries.
// var cutoff = new Date();
// cutoff.setDate(cutoff.getDate()-5);
// MyModel.find({modificationDate: {$lt: cutoff}}, function (err, docs) { ... });
