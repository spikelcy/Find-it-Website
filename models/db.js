/**
 * Created by spike on 12/4/2017.
 */
// Create database
var mongoose = require('mongoose');
mongoose.connect('ADD UPDATED MONGO USER FOR USE', function(
  err) {
  if (!err) {
    console.log('Connected to mongo');
  } else {
    console.log('Failed to connect to mongo');
  }
});

require('./people.js');
require('./comments.js');
require('./places.js');
