var mongoose = require('mongoose');
var Schema = mongoose.Schema;

ValueSchema = new Schema({
  timestamp : {
    type : Date,
    default : Date.now(),
    required : true
  },
  value : {
    type : Number,
    required : true
  },
  sensor_id : {
    type : String,
    required : true
  }
});

module.exports = mongoose.model('Value', ValueSchema);
