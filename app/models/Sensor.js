var mongoose = require('mongoose');
var Schema = mongoose.Schema;

SensorSchema = new Schema({
  sensor_id : {
    type : String,
    required : true
  },
  unit_type : {
    type : String,
    required : true
  },
  owner : {
    type : String,
    required : true
  },
  host : {
    type : String,
    required : true
  }
});

module.exports = mongoose.model('Sensor', SensorSchema);
