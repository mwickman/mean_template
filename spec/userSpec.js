var User = require("../server/User.js");
var DB = require("../server/db.js");
jasmine.getEnv().defaultTimeoutInterval = 10000;

describe("User Model", function(){
  var testUser = {
    openId: "testUniqueID123",
    name: "matt"
  }

  it("should findOrCreate a User", function(done){
    User.findOrCreate(testUser).then(function(user){
      expect(user.openId).toEqual(testUser.openId);
      done();
    }, function(err) {
      console.log("REJECTED");
      expect(err).toBeUndefined();
      done();
    });
  });

});