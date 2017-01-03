//
//	Author 			: Ioannis Gkikas, Sami Sindi
//	Description : Mongoose model of Value. The Schema defines our data model structure, to be used
//                according to MongoDB guidelines
//

//
//  IMPORT & SETUP--------------------------------------------------------------------------------------------
//

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//
//  SCHEMA ---------------------------------------------------------------------------------------------------
//

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


ValueSchema.methods.getDigest = function(sensor_id_r, range, callback) {
  var Value = mongoose.model('Value', ValueSchema);
  var timestamp_range = convertToTimestamp(range);
  console.log(timestamp_range);
  var start = new Date(timestamp_range.min);
  var end = new Date(timestamp_range.max);
  Value.find({
    sensor_id : sensor_id_r,
    timestamp : {$gt : timestamp_range.min, $lt : timestamp_range.max }
  }).select('value -_id').exec(function(err, result) {
    if (err) throw err;
    callback(result);
    });
};

convertToTimestamp = function(range){
  var timestamp_range = {};
  timestamp_range.max = new Date();
  timestamp_range.min = new Date(timestamp_range.max.getTime() - range).toISOString();
  timestamp_range.max = timestamp_range.max.toISOString();
  return timestamp_range;
}
//exporting our model
module.exports = mongoose.model('Value', ValueSchema);
