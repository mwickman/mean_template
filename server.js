var port = process.env.PORT || 8000;
var express = require('express');
var app = express()
    , server = require('http').createServer(app);
var DB = require("./server/db.js");
var passport = require('passport')
    , GoogleStrategy = require('passport-google').Strategy;
var User = require("./server/User.js");

server.listen(port, function(){
  console.log('server started on port ', port);
});

app.configure(function () {
  app.use(express.static(__dirname + '/app'));
  app.use("/bower_components", express.static(__dirname + '/bower_components'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'ofM4n4' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

//Authentication
passport.use(new GoogleStrategy({
      returnURL: 'http://localhost:8000/auth/google/return', //where to send after login
      realm: 'http://localhost:8000'
    },
    function (identifier, profile, done) {
      profile["openId"] = identifier;
      console.log("profile: ", profile);
      User.findOrCreate(profile, function(err, user) {
        console.log('found/created', user, err);
        done(err, user);
      });
    }
));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'), function(req, res){
  console.log('called /auth/google');
});

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return',
    passport.authenticate('google', { successRedirect: '/',
      failureRedirect: '/login' }),
    function(req,res){
     console.log('called /auth/google/return');
    }
);


//Routes
app.get('/login', function(req, res){
  res.sendfile(__dirname + '/app/partials/login.html');
})

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/app/index.html');
});

app.put('/db/:collection', function (req, res){
  console.log('request body', req.body);
  DB.insert(req.params.collection, req.body).then(function(data){
    console.log('got write result');
    res.send(data);
  }, function(error){
    console.log('rejected write');
    res.send(error);
  });
});

app.get('/db/:collection', function(req, res) {
  DB.find(req.params.collection, {}).then(function(data){
    res.send(data);
  });
});