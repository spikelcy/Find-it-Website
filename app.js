// Set up express
var express = require('express');
var app = express();
var path = require('path');
var session = require('client-sessions');
var multer = require('multer')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})); //this is needed for req.body


// Database setup
require('./models/db.js');


//creates session for cookie
app.use(session({
  cookieName: 'session', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  httpOnly: true, //prevents browser JavaScript from accessing cookies.
  secure: true, // ensures cookies are only used over HTTPS
  ephemeral: true  //deletes the cookie when the browser is closed.

}));


var mongoose = require('mongoose');
var Person = mongoose.model('Person');

//checks for session and user to use when going through website
app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    Person.findOne({ Username: req.session.user.Username }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});

// Routes setup

var routes = require('./routes/routes.js');
app.use('/', routes);






app.use(express.static('/findit'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');





app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.get('/', function(req, res) {
  var usercheck = 1;
  if(!req.user){
      usercheck = 0
    console.log("no user");
  }
  res.render("home", {
    LoggedIn: usercheck
  })
});

app.get('/LogIn', function(req, res) {
  res.render("LogIn");
});


var port = process.env.PORT || 5000

var server = app.listen(port, function(req, res) {
  var host = server.address().address;


  console.log("Example app listening at http://%s:%s", host, port)
});
