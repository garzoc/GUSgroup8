//
//	Author 			: Ioannis Gkikas, Sami Sindi
//	Description : Mongoose model of Sensor. The Schema defines our data model structure, to be used
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

SensorSchema = new Schema({
	key : {
    type : String,
    required : true,
    unique:true
  },
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

//exporting our model
module.exports = mongoose.model('Sensor', SensorSchema);
