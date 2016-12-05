
/* The main challinge is quering all the sensors under a certian sensor package, in other words once you click on a package on the front end to view all the sensors under that package.
how will that play through.. As it stands, the JSON message gets to our database, then it gets handeled according to our Schema.

If you scroll down to the queries section you'll see some .find functions that querys 1 specific field that we pass it to it.. the question is as follow,
when we query a package (aka sensor package) lets say "group8" for example, how will Mongo know that is should view all the sensors that belongs to that package?
how do we make that query?
As I understand it, this specific query that we have now is only looking inside the content of 1 json message at the time, and this json message only have the values of 1 sensor, it doesnt. 
A possible sulotion I'm thinking about is to create a new sensorPackage Schema, it has 3 fields, we populate this new schema/model with data from the 2 existing schemas,

Full example:
mongoose = require 'mongoose'
Schema = mongoose.Schema
sensorSchema = new mongoose.Schema
req(User)
req (Package)

  packageName: {
  type:String,
  required : true,
  } 
  owner:{
    type: Schema.Types.ObjectId,
    ref: 'User'
    }
  sensors: [{
    type: Schema.Types.ObjectId,
    ref: 'Package.'
  }]

League = mongoose.model 'League', leagueSchema

=======SEE THIS FOR REFRENCE http://jaketrent.com/post/mongoose-population/========

*/

//https://github.com/garzoc/GUSgroup8/blob/Erlang-Dev/sensor_json_formatter.erl
Schema          = mongoose.Schema;
var mongoose    = require('mongoose');
var User        = require('./User.js'); 
var uri         = 'mongodb://localhost:27017/test'
var connection  = mongoose.createConnection(uri);
var ObjectId    = Schema.ObjectId;
var UserSchema  = require('mongoose').model('User ').schema


//Create Schema
var PackageSchema = new Schema({

sensor_package: {
  type: String,
  default: 'Group8',
  required: true,
  //unique: true,
  index: true,
  trim: true
},
    user: { 
      type: String, 
      required: true,
      index: true,
     trim: true
    },
//generates a default id for this package
 _id:{
   type:ObjectIdSchema,
   default: function () { return new ObjectId()} 
},
group: {
  type: String,
  required: true,
  index: true,
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
  index: true,
  trim: true
  },

unit_type: {
  type: String,
  trim: true
  },

timestamp: {
  type: Date,
  default: Date.now(),
  index: true,
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

module.exports = mongoose.model('Package', PackageSchema);



//Save some mock data
var jsonpack = new Package{(
    user : "Tester",
    group : "Group8",
    value : 88,
    sensorID : "Sensor0",
    timestamp : Date.now(),
    unit : "%"
    owner : 
    });

  jsonpack.save(function (err) {
  if (err) return handleError(err);
    });

//Querry on saved model
Package
.findOne({ user: 'Tester' })
.exec(function (err, package) {
  if (err) return handleError(err);
  console.log('Current selected user is %s', Package.name);
  // prints "Current selected user is Tester"
});

Package
.find ({group: 'Group8'})
.exec(function(err, package){
  if (err) return handleError(err);
    console.log('Current selected Group is %s', Package.group);
});

Package
.findOne ({sensorID: 'Sensor0'})
.exec(function(err, package){
  if (err) return handleError(err);
    console.log('Current selected Sensor is %s', Package.sensorID);
});

/*-----Time range queries-------*/
PackageSchema.methods.range(query)= {
  //query is a string that can only hold three different string values : hour, day, week
  var pack = this;
  var d = new Date.now();
  hour = d.getHour();


  if (query == "hour") {
  //if doesnt work: remove quotes from timestamp
  //second option will be: pass timestamp to function
function rangeHour(){
  pack.find({"timestamp": {$lt: Date.now(), $gt: hour()-1 }
});

}
}
  else if (query == "day") {
function rangeDay(){
  pack.find({
    "timestamp": {$lt: Date.now(), $gt: hour()-24 }
  });

}
}
  else if (query == "week") {


function rangeWeek(){
  pack.find({
    "timestamp": {$lt: Date.now(), $gt: hour() - 168 }
  });

}
}
}
/*end of query functions */

















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
