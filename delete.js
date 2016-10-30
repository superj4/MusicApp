var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


var url = 'mongodb://localhost:27017/mydb';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.dropCollection('artists', function(){
			console.log("dropped");
		});
  db.close();

});

