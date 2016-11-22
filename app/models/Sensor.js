var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//https://github.com/garzoc/GUSgroup8/blob/Erlang-Dev/sensor_json_formatter.erl

var packageSchema = new mongoose.Schema({
sensor_package: {
  type: String,
  required: true,
  unique: true
}.
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

//var Gr8data = mongoose.model('Gr8data', packageSchema);


//ADD FUNCTIONS FOR

//Exported to require on app.js so it could be refrenced from another schema.
module.exports = mongoose.model('Package', packageSchema);
