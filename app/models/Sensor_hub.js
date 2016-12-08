var mongoose = require('mongoose');
var Schema = mongoose.Schema;

Sensor_hubSchema = new Schema({
  owner : {
    type : String,
    required : true
  },
  hub_name : {
    type : String,
    required : true
  }
});


module.exports = mongoose.model('Sensor_hub', Sensor_hubSchema);
