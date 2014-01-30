var port = process.env.PORT || 8000;
var express = require('express');
var app = express()
    , server = require('http').createServer(app);
var DB = require("./server/db.js");

server.listen(port, function(){
  console.log('server started on port ', port);
});

app.configure(function () {
  app.use(express.static(__dirname + '/app'));
  app.use("/bower_components", express.static(__dirname + '/bower_components'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + 'app/index.html');
});

app.put('/db/:collection', function (req, res){
  console.log('request body', req.body);
  DB.insert(req.params.collection, req.body).then(function(data){
    console.log('got result');
    res.send(data);
  }, function(error){
    console.log('rejecting');
    res.send(error);
  });
});

app.get('/db/:collection', function(req, res) {
  DB.query(req.params.collection, {}).then(function(data){
    res.send(data);
  });
});