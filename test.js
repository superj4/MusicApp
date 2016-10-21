var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');


var client_id = 'F8b435be37e444b9a563ddeae7a60316'; // Your client id
var client_secret = '4f3dadce8a4846eca2aa5a8dae4a838b'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        redirect_uri: redirect_uri,
        grant_type: 'client_credentials'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(err,res,body){
    	console.log(body);
    });