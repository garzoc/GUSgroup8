var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var ObjectId = Schema.ObjectId;
var Package = require('./Package.js');

//user Schema
var UserSchema = new Schema({
  username: {
    type : String,
    required : true,
    index: true,
    unique : true
  },
  // generates a default id number to this user
  user_Id:{
        type:ObjectId,
        default: function () {return new ObjectId(); }
      },
  password: {
    type : String,
    required : true,
    select: false
  },
  //select false means the password field wont be retrieved in json requests by default
  // package: {
  //   type  : String,  // array of strings,populated by the internal IDS allocated by mongoose.
  //   required : true
  // }
  //added this..itll take the packeges IDs and store it as an array under the user 
  packages: [{
    type: mongoose.Schema.ObjectId,  // array of strings,populated by the internal IDS allocated by mongoose.
    ref: 'Package' //package here is refrenced by using the id generated in Package.js model
  }]
});



//model functions
//hash the password
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

//method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);

};

module.exports = mongoose.model('User', UserSchema);
