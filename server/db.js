var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/local";
var Q = require('Q');
var dbDefer = Q.defer();
var dbPromise = dbDefer.promise;

//connect to database and save the connection pool for use
MongoClient.connect(dbUrl, function(err,database){
  if(err) {console.log("db connection error: ", err);}
  dbDefer.resolve(database);
  console.log("successfully connected to DB");
});


//Might eventually want to use something like Mongoose to interact with DB
var DB = module.exports = function ()
{

}
DB.connection = dbPromise;
DB.find = function(collection_name, query) {
  var query = query || {};
  var deferred = Q.defer();
  var promise = deferred.promise;

  dbPromise.then(function(db){
    db.createCollection(collection_name, function(err, collection) {
      var stream = collection.find(query).stream();
      var result = [];
      stream.on('data', function(item){
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

  dbPromise.then(function(db){
    db.createCollection(collection_name, function(err, collection) {
      collection.insert(doc, function(err, records){
        if(err){deferred.reject(err)}

        deferred.resolve(records);
      });
    });
  })

  return promise;
}

DB.findOrCreate = function(collection_name, doc) {
  var deferred = Q.defer();
  var promise = deferred.promise;
  dbPromise.then(function(db){
    db.createCollection(collection_name, function(err, collection) {
      //first try to find the doc, a User for the moment
      collection.findOne({openId: doc.openId}, function(err, result){

        if(err){deferred.reject(err)}
        else {
          //save will update the record or create a new one
          var saveObject = result || doc;
          collection.save(saveObject, function(err, data){
            if(err || data==0){deferred.reject(err, data)}
            else{
              if(data==1){
                deferred.resolve(saveObject)
              }
              else {
                deferred.resolve(data);
              }
           }
         })

        }

      });

    });
  })

  return promise;
};

DB.findOne = function(collection_name, query){
  var query = query || {};
  var deferred = Q.defer();
  var promise = deferred.promise;

  dbPromise.then(function(db){
    db.createCollection(collection_name, function(err, collection) {
      collection.findOne(query, function(err, result){
        if (err){
          deferred.reject(err)
        }
        else {
          deferred.resolve(result);
        }
      })

    });
  });

  return promise;
}