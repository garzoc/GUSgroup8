//https://github.com/garzoc/GUSgroup8/blob/Erlang-Dev/sensor_json_formatter.erl
var mongoose    = require('mongoose');
var uri         = 'mongodb://localhost:27017/test'
var connection  = mongoose.createConnection(uri);
Schema          = mongoose.Schema;


//Create Schema
var PackageSchema = new Schema({

sensor_package: {
  type: String,
  default: 'Group8',
  required: true,
  unique: true,
  trim: true
},
user : {
  type: String,
  required: true,
  unique: true,
  trim: true
},

group: {
  type: String,
  required: true,
  trim: true
},

value: {
  type: Number,
  default: 0,
  required: true,
  trim: true
},

sensorID: {
  type: String,
  required: true,
  trim: true
  },

  unit_type: {
  type: String,
  required: 'Please enter unit type...',
  trim: true
  },

timestamp: {
  type: Date,
  default: Date.now(),
  required: true

}


  });

PackageSchema.pre('save', function(next){
  var pack = this;
// Handler **must** take 3 parameters: the error that occurred, the document
if (this.timestamp !== undefined){
  this.timeStamp = new Date(this.timestamp);//get the time in string
    // next( new Error('Timestamp does not exit'));
  }

  next();
});

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

module.exports = mongoose.model('Package', PackageSchema);

//Use the schema to register a model with MongoDb
// mongoose.model('Package', packageSchema);
// var Package = mongoose.model('Package', packageSchema);




// //connect
// var Package = connection.model('Package', packageSchema);

//Export


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
