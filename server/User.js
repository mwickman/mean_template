var DB = require('./db.js');

var User = module.exports = function(){}

//callback is optional, otherwise returns promise. Callback returns err, user
User.findOrCreate = function(user, callback) {

  if(!callback){
  return DB.findOrCreate('users', user);
  } else {
    DB.findOrCreate('users', user).then(function(user){
      callback(null, user);
    }, function(err){
      callback(err, {});
    })
  }
}

User.findById = function(id, callback){
  var query = {_id: id};
  if(!callback){
    return DB.findOne(query);
  } else{
    DB.findOne(query).then(function(user){
      callback(null, user);
    }, function(err){
      callback(err, null);
    });
  }
}