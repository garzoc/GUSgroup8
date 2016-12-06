var mongoose    = require('mongoose');
Schema          = mongoose.Schema;

var SensorValueSchema = new Schema({
  sensor_id:
  timestamp:

  value: {
    type: Number,
    default: 0,
    required: true,
    trim: true
  },

  sensorID: {     //sensor to which this value belongs
    type: String,
    required: true,
    trim: true
    },

  host: {
    type: String  ///package_id to which the value document will be referenced to
  }

})
//documents are instances of data in the form of the defined schema (as in java : a document would be an object of a class which is a schema)



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

module.exports = mongoose.model('SensorValue', SensorValueSchema);
