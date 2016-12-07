
var mongoose    = require('mongoose');
Schema          = mongoose.Schema;
var User        = require('./User.js'); 
var uri         = 'mongodb://localhost:27017/test'
mongoose.connect(uri);
var connection  = mongoose.createConnection(uri);
var ObjectId    = Schema.ObjectId;
var UserSchema  = require('mongoose').model('User').schema


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
//  _id:{
//    type:ObjectId,
//    default: function () { return new ObjectId()}
// },
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
  // Handler **must** take 3 parameters: the error that occurred, the document
  if(this.timestamp !== undefined){
    this.timeStamp = new Date(this.timestamp);
    //get the time in string
    // next( new Error('Timestamp does not exit'));
  }
  next();
});

module.exports = mongoose.model('Package', PackageSchema);



//Save some mock data
var Package = mongoose.model('Package', PackageSchema);
var package = new Package({
    user : "Tester",
    group : "Group8",
    value : 88,
    sensorID : "Sensor1"  ,
    timestamp : Date.now(),
    unit : "%"
    });

console.log("saving");
package.save(function(){console.log("saved"); findByGroup('Group8')});

//Querry on saved model
function findByUser (userNmae){
Package
  .findOne({ user: userNmae })
  .exec(function (err, package) {
    if (err) return handleError(err);
    console.log('Current selected user is %s', Package.name); // prints "Current selected user is Tester"
  });
}

function findByGroup(groupName){
    Package
      .find ({group: groupName})
      //.distinct('sensorID') get a list of distinct values for the field sensorID
      .exec(function(err, package){
        if (err) return handleError(err);
      console.log('The package looks like this ', package);
  });
}
function findBySensor(sensorName){
Package
.findOne ({sensorID: sensorName})
.exec(function(err, package){
  if (err) return handleError(err);
    console.log('Current selected Sensor is %s', Package.sensorID);
});
}
function 
/*-----Time range queries-------*/
PackageSchema.methods.range = function(query){
  //query is a string that can only hold three different string values : hour, day, week
  var pack = this;
  var d = new Date.now();
  hour = d.getHour();


  if (query == "hour") {
  //if doesnt work: remove quotes from timestamp
  //second option will be: pass timestamp to function
function rangeHour(){
  Package.find({"timestamp": {$lt: Date.now(), $gt: hour()-1 }
});

}
}
  else if (query == "day") {
function rangeDay(){
  Package.find({
    "timestamp": {$lt: Date.now(), $gt: hour()-24 }
  });

}
}
  else if (query == "week") {


function rangeWeek(){
  Package.find({
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
