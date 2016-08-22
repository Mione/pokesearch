var fs = require('fs');
var request = require('request');
var rp = require('request-promise');

var options = {
  uri: 'https://api.github.com/user/repos',
  qs: {
    access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx' 
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true // Automatically parses the JSON string in the response 
};

rp(options)
  .then(function (repos) {
    console.log('User has %d repos', repos.length);
  })
  .catch(function (err) {
    // API call failed... 
  });