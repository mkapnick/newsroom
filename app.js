'use strict';

var express 		= require('express');
var path 				= require('path');
var app         = express();
var server 			= require('http').Server(app);
var _           = require('underscore');
var feedData    = require('./src/feedData.js');

server.listen(3008);

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/data', function(req, res, next) {
  console.log('fetching data...');
  feedData.getData(req.query.s)
  .then((data) => {
    console.log('num articles fetched: ' + data.length);
    console.log('rendering....');
    res.json(data);
  });
});



