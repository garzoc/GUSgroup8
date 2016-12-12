//
//	Author 			: Ioannis Gkikas
//	Description : Mongoose model of User. The Schema defines our data model structure, to be used
//                according to MongoDB guidelines.Also included are exclusive functions that are used
//                for password validation, encryption and storing.
//

//
//  IMPORT & SETUP--------------------------------------------------------------------------------------------
//

var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//
//  SCHEMA ---------------------------------------------------------------------------------------------------
//

UserSchema = new Schema({
  username : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true,
    select : false
  }
});


//
//  MODEL FUNCTIONS -------------------------------------------------------------------------------------------
//

// mongoose middleware that executes right before saving a new user
UserSchema.pre('save', function(next) {
  var user = this;

  // hash the password only if the password hasnt been stayed the same or if user is new
  if (!user.isModified('password')) return next();

  //generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    //change the password to hashed version
    user.password = hash;
    next();
  });
});


//our custom method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);

};


// exporting our model
module.exports = mongoose.model('User', UserSchema);
