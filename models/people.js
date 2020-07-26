/**
 * Created by spike on 12/4/2017.
 */

var mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  SALT_WORK_FACTOR = 10;
var path = require('path');

// changed follows and comments to string array makes thing alot easier to manipulate.

var personSchema = mongoose.Schema(
    {
        "Username": { type: String, required: true, index: { unique: true } },
        "postalcode":String,
        "email":String,
        "course":String,
        "follows":[String],
        "img": String ,
        "img_id": String,
        "password" : { type: String, required: true },
        "comments":[String],
        "myplaces":[String]
    }
);

personSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

personSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


mongoose.model('Person',personSchema);
