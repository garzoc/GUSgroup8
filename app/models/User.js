var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

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
