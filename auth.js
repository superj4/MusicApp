/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


var client_id = 'F8b435be37e444b9a563ddeae7a60316'; // Your client id
var client_secret = '4f3dadce8a4846eca2aa5a8dae4a838b'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var track_seed_arr = [];



var findDocuments = function(db, callback) {
      // Get the documents collection
      var collection = db.collection('tracks');
      // Find some documents
      collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        app.get('/data', function(req, res){
          res.send(docs);
        });
        callback();
      });
    }


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

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



//https://accounts.spotify.com/en/login?continue=https:%2F%2Faccounts.spotify.com%2Fen%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3DF8b435be37e444b9a563ddeae7a60316%26scope%3Duser-read-private%2520user-read-email%2520playlist-read-private%2520playlist-read-collaborative%2520user-top-read%26redirect_uri%3Dhttp:%252F%252Flocalhost:8888%252Fcallback%26state%3Dfq3kaLODcIXEV19D
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

        // var top_artists = {
        //   url: 'https://api.spotify.com/v1/me/top/artists',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };

        // request.get(top_artists, function(error, response, body){
        //   if(!error && response.statusCode === 200 ){
        //     console.log(body);
        //   }else{
        //     console.log(response.statusCode);
        //   }

        // });

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
                for(var item in body.items){
                  var tracks = {
                    url: body.items[item].tracks.href,
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                  };
                  request.get(tracks, function(error, response, body) {
                    track_seed_arr.push(body.items[0].track.id);
                  });
                }

                // var recom ={
                //   url: 'https://api.spotify.com/v1/recommendations',
                //   headers: { 'Authorization': 'Bearer ' + access_token },
                //   //seed_tracks: track_seed_arr[0],
                //   min_energy: '0.4',
                //   min_popularity: '50',
                //   seed_artists:'4NHQUGzhtTLFvgF5SZesLK',
                //   json: true
                // }


                // request.get(recom, function(error, response, body) {
                //     console.log(body);
                //   });

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

var url = 'mongodb://localhost:27017/mydb';
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server.");
        findDocuments(db, function() {
              db.close();
        });

    });

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      console.log(access_token);
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
