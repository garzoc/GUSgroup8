var mongoose = require ('mongoose');
var schema = mongoose.Schema;


//Schemas define the structure of documents within a collection, and models are 
//used to create instances of data that will be stored in documents

//Schema taken from here:
//https://github.com/garzoc/GUSgroup8/blob/Erlang-Dev/sensor_json_formatter.erl
var dbSchema = new mongoose.Schema({
sensor_package: [{
  type: String,
  required: true,
  unique: true
}].
user : {
  type: String,
  required: true,
  unique: true
}

group: String,

value: {
  type: Number,
  required: true,
}

sensorID: [{
  type: String,
  required: true,  
  }],

timestamp: Number,
sensor_unit: String,

  });

var Gr8data = mongoose.model('Gr8data', dbSchema);

//Exported to require on app.js so it could be refrenced from another schema.
module.exports = mongoose.model('Gr8data', dbSchema);