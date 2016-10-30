var client_id = 'F8b435be37e444b9a563ddeae7a60316'; // Your client id
var client_secret = '4f3dadce8a4846eca2aa5a8dae4a838b'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
var access_token = 'BQD4IucnbyOAjJQrJ8pSyKW77Co1j0Uf_51PtKrSHbWKE6y6eg8WDQLLIWB57swODlkkSh5DraKA-OakSAr_8MyAYPoovToX6ioKCV7BEfN9ivOa5IOb0wceyTKuPsCXcEE2NGQ8q764daRaNyLmvf8QM5J38Z7r9-tHMlU07WuvTutaj-_pFDAtLoThasl0fenxf9Q2BXcwzztoVA-7VKd8FcqDitIkaGkVjMRikZb6_OGmAAtkG9jwbJ98mAwClgVUGpOvOYXwWC-E8wk';




var request = require('request');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');



var tracks = {
  	url: 'https://api.spotify.com/v1/artists/3WrFJ7ztbogyGnTHbHJFl2/top-tracks?country=GB',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };

var country ={
  url: 'http://data.okfn.org/data/core/country-list/r/data.json'
};

request.get(country, function(error,response,body){
  console.log(body);
});

var insertDocuments = function(db, callback) {
	request.get(country, function(error, response, body){
		var collection = db.collection('country');
		collection.insert(body,function(){
			console.log("inserted");
      callback(body.tracks);
		});

	});
  	// Get the documents collection
  	
}

var findDocuments = function(db, callback) {
  		// Get the documents collection
	  	var collection = db.collection('countries');
	  	// Find some documents
	  	collection.find({}).toArray(function(err, docs) {
		    assert.equal(err, null);
		    console.log("Found the following records");
		    console.log(docs);
		    callback(docs);
	  	});
}

/**
* initiate database
*/
var url = 'mongodb://localhost:27017/mydb';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  // insertDocuments(db, function() {
  //   db.close();
  // });

    	findDocuments(db, function() {
      		db.close();
    	});

});



