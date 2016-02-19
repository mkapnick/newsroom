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

app.use('/static', express.static(path.join(__dirname, 'src/dependencies')));
app.use('/statik', express.static(__dirname + '/node_modules'));
app.use('/statik/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/statik/d3', express.static(__dirname + '/node_modules/d3'));
app.use('/statik/views', express.static(__dirname + '/views/common/'));


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



