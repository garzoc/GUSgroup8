//
//	Author 			: Ioannis Gkikas, Sami Sindi
//	Description : Mongoose model of Sensor_hubs. The Schema defines our data model structure, to be used
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

Sensor_hubSchema = new Schema({
	key:{
		type:String,
		required:true,
		unique:true
		},
  owner : {
    type : String,
    required : true
  },
  hub_name : {
    type : String,
    required : true
  }
});

//exporting our  model
module.exports = mongoose.model('Sensor_hub', Sensor_hubSchema);
