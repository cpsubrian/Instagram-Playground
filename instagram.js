// Constants
var API_HOST = 'api.instagram.com';
var API_BASE_URL = '/v1';
var CLIENT_ID = '99b52fe6e18b4205a4e71bfba2b5a078';
var CLIENT_SECRET = '7f73a192a5c04e458d0b8fc85bab9e7c';

var OAuth= require('oauth').OAuth;
var https = require('https');
var util = require('util');

var photos = [];

// Display the latest popular photos.
var popular = exports.popular = function(req, res) {
  fetchPopular(function(photos) {
    res.render('index', {
      title: 'Instagram Popular Photos',
      photos: photos
    });
  });
}

var refresh = exports.refresh = function() {
  photos = [];
}

var getPhoto = exports.getPhoto = function(index) {
  return photos[index];
}

// Fetch popular photos.
global.popularPhotos = [];
var fetchPopular = function(finish) {
  if (!photos.length) {
    console.log('Fetching New Photos...');
    var options = {
      host: API_HOST,
      path: API_BASE_URL + '/media/popular?client_id=' + CLIENT_ID,
    };
    https.get(options, function(res) {
      var data = '';
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        var parsed = JSON.parse(data);
        for (var i in parsed.data) {
          photos.push(new photo(parsed.data[i], i));
        }
        finish(photos);
      });
    }).on('error', function(e) {
      console.error(e);
    });
  }
  else {
    console.log('Fetching Cached Photos...');
    finish(photos);
  }
}

// Parse the properties we want from photo data.
var photo = function(data, index) {
  this.index = index;
  if (data.caption) {
    this.caption = data.caption.text;
  }
  if (typeof data.images.standard_resolution != 'undefined') {
    this.image = data.images.standard_resolution;
  }
  if (typeof data.images.thumbnail != 'undefined') {
    this.thumb = data.images.thumbnail;
  }
  if (typeof data.link != 'undefined') {
    this.link = data.link;
  }
  if (typeof data.user != 'undefined') {
    this.user = data.user;
  }
};
photo.prototype = {
  render: function() {
    return '<img src="' + this.image.url  + '" width="' + this.image.width  + '" height="' + this.image.height  + '" rel="' + this.index + '">';
  },
  renderThumb: function() {
    return '<img src="' + this.thumb.url  + '" width="' + this.thumb.width  + '" height="' + this.thumb.height  + '" rel="' + this.index + '">';
  }
};

/*
var oa = new OAuth(global.INSTAGRAM_REQUEST_TOKEN_URL,
                   global.INSTAGRAM_ACESS_TOKEN_URL,
                   global.INSTAGRAM_KEY,
                   global.INSTAGRAM_SECRET,
                   global.INSTAGRAM_VERSION,
                   null,
                   "HMAC-SHA1");

oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret,  results){
  if (error) return console.log('error :' + error)
  console.log('oauth_token :' + oauth_token)
  console.log('oauth_token_secret :' + oauth_token_secret)
  console.log('requestoken results :', results)
  console.log("Requesting access token")
  oa.getOAuthAccessToken(oauth_token, oauth_token_secret,
                         function(error, oauth_access_token,
                                  oauth_access_token_secret, results2) {
    console.log('oauth_access_token :' + oauth_access_token)
    console.log('oauth_token_secret :' + oauth_access_token_secret)
    console.log('accesstoken results :', results2)
    console.log("Requesting access token")
    var data= "";
    oa.getProtectedResource(
        "http://term.ie/oauth/example/echo_api.php?foo=bar&too=roo", "GET",
        oauth_access_token, oauth_access_token_secret,
        function (error, data, response) {
      console.log(data);
    });
  });
})
*/
