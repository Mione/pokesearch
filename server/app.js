var request = require('request');
var express = require('express');
var app = express();
var port = 3000;
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var pokemonList = require('../pokemons/list');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use(express.static('client'));

app.post('/rest/pokemon/:id', function (req, res) {
  console.log('body', req.body);
});

app.get('/rest/pokemon/', function (req, res) {
  res.status(200).end(JSON.stringify(pokemonList.pokemons));
});

app.get('/rest/pokemon-details/:id', function (req, res) {
  console.log('=======================New pokemon request=====================');
  console.log('req param id is:', req.params.id);

  res.status(200).end(JSON.stringify(getMatch(req.params.id)));
});

function getMatch(lookFor, limit) {
  var limit = limit || 20;
  var matches = [];

  pokemonList.pokemons.forEach(function (element, index) {
    // if(index >= limit) {
    //   return;
    // }

    if (element.name.indexOf(lookFor) !== -1) {
      matches.push(element);
    }
  }, this);
  return matches;
}

app.listen(3000, function () {
  console.log('Oferring Pokemon Details On Port ' + port);
  console.log('Pokemon list', pokemonList.pokemons[0])
});