var cool = require('cool-ascii-faces');
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

var url = 'mongodb://heroku_2dqvd84x:h8ceeo3854bj850dr83jb0aet6@ds139327.mlab.com:39327/heroku_2dqvd84x/mydb';
var Db;
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to database");
  Db = db
});

app.get('/cool', function(request, response) {
  response.send(cool());
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

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


var stateKey = 'spotify_auth_state';


app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-top-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        //use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          if (!error && response.statusCode === 200){
            var user_id = body.id;
            //find this user's playlist
            var pl ={
              url: 'https://api.spotify.com/v1/users/'+user_id+'/playlists',
              headers: { 'Authorization': 'Bearer ' + access_token },
              json: true
            }
            request.get(pl, function(error, response, body) {
              if (!error && response.statusCode === 200){
                //each playlist consists of many tracks, for each track, get track id
                console.log(body);
              }
            });
          }else{
            console.log('unable to get user id:'+ error);
          }
        });
        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});









console.log('Listening on 8888');
app.listen(8888);


