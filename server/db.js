var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/local";
var Q = require('Q');

var DB = module.exports = function ()
{

}

DB.query = function(collection, query) {
  var deferred = Q.defer();
  var promise = deferred.promise;

  MongoClient.connect(dbUrl, function(err, db) {
    if (!err){ deferred.reject(err) }
    var message = 'connected yay!';
    console.log(message), query;

    db.createCollection('test', function(err, collection) {
      console.log('1');
      var stream = collection.find(query).stream();
      var result = [];
      stream.on('data', function(item){
        console.log('2');
        result.push(item);
      });
      stream.on('end', function(){
        deferred.resolve(result);
      })

    });

  });

  return promise;
}

DB.insert = function(collection_name, doc) {
  var deferred = Q.defer();
  var promise = deferred.promise;

  MongoClient.connect(dbUrl, function(err, db) {
    if (err){ deferred.reject(err) }
    var message = 'connected to insert yay!';
    console.log(message, collection_name, doc);

    db.createCollection(collection_name, function(err, collection) {
      collection.insert(doc, function(err, records){
        if(err){deferred.reject(err)}

        deferred.resolve(records);
      });
    });

  });

  return promise;
}