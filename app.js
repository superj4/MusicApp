
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var async = require("async");


var client_id = 'F8b435be37e444b9a563ddeae7a60316'; // client id
var client_secret = '4f3dadce8a4846eca2aa5a8dae4a838b'; // secret
var redirect_uri = 'http://localhost:8888/callback'; // redirect uri

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

var url = 'mongodb://localhost:27017/mydb';
var Db;
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to database");
  Db = db
});

app.get('/artists', function(req, res){
  var artists = Db.collection('artists');
  var countries = Db.collection('countries');
  artists.find({}).toArray(function(err, persons) {
    async.each(persons, 
      function(person, callback){
        countries.find({cca2: person.Country}, {'latlng': true}).toArray(function(err1, countries) {
          person.latlong = countries[0].latlng;
          callback();
        });
    },
      function(err){
        res.send(persons);
      });
  });
});

var locations=[];

app.get('/location', function(req,res){
  locations=[];
  var artists = Db.collection('artists');
  var countries = Db.collection('countries');
  countries.find({}).toArray(function(err, countr){
    async.each(countr, function(count,callback){
      artists.find({Country:count.cca2},{'id':true}).toArray(function(err1,data){
        if(data.length>0){
          locations.push({country:count.cca2, latlng: count.latlng, artists:data});
        }
        callback();
      });
    }, function(err){
      res.send(locations);
    });
  });
});



var fillGenres=function(docs, callback){
    for(var i=0; i<docs.length; i++){
      for(var j=0; j<docs[i].genres.length; j++){
        genreSet.add(docs[i].genres[j]);
      }
    }
  callback();
}

var genreSet = new Set();
app.get('/genres', function(req,res){
  var artists = Db.collection('artists');
  artists.find({}).toArray(function(err, docs) {
    fillGenres(docs,function(){
      res.send(Array.from(genreSet));
    });
  });
});


console.log('Listening on 8888');
app.listen(8888);


