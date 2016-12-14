//deprecated file, used to define a model for storing incoming messages as-is
// maybe storing them for a limited amount of time and letting the server handle them on its own leisure
// would be more efficient and less bocking though the latency would be greater.


//https://github.com/garzoc/GUSgroup8/blob/Erlang-Dev/sensor_json_formatter.erl
var mongoose    = require('mongoose');
//var uri         = 'mongodb://localhost:27017/test'
//var connection  = mongoose.createConnection(uri);
Schema          = mongoose.Schema;


/*SensorSchema = new Schema({ //helper schema
  sensor_id : {
    type : String
  },
  sensor_type : {
    type : String
  },
  sensor_unit : {
    type : String
  }
}); */

//Create Schema
var PackageSchema = new Schema({

sensor_package: {
  type: String,
  required: true
},
owner : {   //there exists a string == owner inside the Users document.
  type: String
},

group: {      // this is the topic on the broker right?
  type: String
}

/*sensors: {
  type: [SensorSchema], //holds the ids/names of each sensor of a sensor_package
  required: true
}
  */
 });



/* PackageSchema.pre('save', function(next){
  var pack = this;
// Handler **must** take 3 parameters: the error that occurred, the document
if (this.timestamp !== undefined){
  this.timeStamp = new Date(this.timestamp);//get the time in string
    // next( new Error('Timestamp does not exit'));
  }

  next();
});
*/



module.exports = mongoose.model('Package', PackageSchema);
//module.exports = mongoose.model('Sensor', SensorSchema);
