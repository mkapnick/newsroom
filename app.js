'use strict';

var express 		= require('express');
var path 				= require('path');
var app         = express();
var server 			= require('http').Server(app);
var _           = require('underscore');
var feedData    = require('./src/feedData.js');

server.listen(8080);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use('/static', express.static(path.join(__dirname, '/static')));
app.use('/statik', express.static(__dirname + '/node_modules'));
app.use('/statik/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/statik/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/statik/jquery-ui', express.static(__dirname + '/node_modules/jquery-ui'));
app.use('/statik/d3', express.static(__dirname + '/node_modules/d3'));
app.use('/statik/views', express.static(__dirname + '/views/common/'));

app.get('/', function(req, res) {
  res.render('index.hbs');
});

app.get('/data', function(req, res, next) {
  feedData.getData(req.query.s)
  .then((data) => {
    res.json(data);
  })
});



