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
  default: '0000',
  required: true,
  trim: true
},

sensorID: {
  type: String,
  required: true,
  trim: true
  },

  unit: {
  type: String,
  required: 'Please enter unit type...',
  trim: true
  },

timestamp: {
  type: Date,
  default: Date.now,
  required: true

},

//'default' is default time the jason was saved to the DB.
//`Date.now()` returns the current unix timestamp as a number
created: {
  type: Date.now,
  required: true
},

sensor_unit: String,

//http://stackoverflow.com/questions/10006218/which-schematype-in-mongoose-is-best-for-timestamp
timestamp: true

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


module.exports = mongoose.model('Package', packageSchema);

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

