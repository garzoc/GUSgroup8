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

//exporting our model
module.exports = mongoose.model('Value', ValueSchema);
