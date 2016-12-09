//dependencies later
var User = require('../models/User');
var Sensor = require('../models/Sensor');
var Sensor_hub =require('../models/Sensor_hub');
var Value =require('../models/Value');


module.exports = {
//procedure to check if user with a username exists and if not discard message
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

}
//procedure to fetch hub for specific user and reference the sensor we want
function fetchHub(message) {
  Sensor_hub.findOne({"owner" : message.user, "hub_name" : message.sensor_hub}).exec(function(err,sensor_hub) {
    console.log(sensor_hub);
    if (err) return handleError(err);

    if (!sensor_hub) {
      var sensor_hub = new Sensor_hub();
      sensor_hub.owner = message.user;
      sensor_hub.hub_name = message.sensor_hub;

      sensor_hub.save(function(err) {
  			if (err) {
  				// duplicate entry
  				if (err.code == 11000)
  					return console.log({ success: false, message: 'A hub with that username already exists. '});
  				else
  					return console.log(err);
  			}

  			// return a message
  			console.log({ message: 'Hub created!' , success: true });
  		});

    } else {

    Sensor.findOne({"sensor_id" : message.sensorID, "owner" : message.user, "host" : message.sensor_hub}).exec(function(err,sensor) {

      if (!sensor) {

        var sensor = new Sensor();
        sensor.owner = message.user;
        sensor.sensor_id = message.sensorID;
        sensor.unit_type = message.sensor_unit;
        sensor.host = message.sensor_hub;

        sensor.save(function(err) {
    			if (err) {
    				// duplicate entry
    				if (err.code == 11000)
    					return console.log({ success: false, message: 'A hub with that username already exists. '});
    				else
    					return console.log(err);
    			}

    			// return a message
    			console.log({ message: 'Sensor created!' , success: true });
          storeValue(message);
    		});
      } else {
        //store the  value
        storeValue(message);
      }

    });
  }

  });
};

function storeValue(message){
  var input = new Value();
  input.timestamp = Date.now();
  input.value = message.value;
  input.sensor_id = message.user + message.sensor_hub + message.sensorID;

  input.save(function(err) {
    if (err) {
      // duplicate entry
      if (err.code == 11000)
        return console.log({ success: false, message: 'A hub with that username already exists. '});
      else
        return console.log(err);
    }

    // return a message
    console.log({ message: 'value stored!' , success: true });

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
