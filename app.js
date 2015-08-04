/*!
 * Mongodb-Express-Tileserver.
 *
 * Main application entry.
 * @author Guillaume de Boyer <gdeboyer@gmail.com>
 */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var compression = require('compression');
var morgan = require('morgan');

var app = express();

app.use(compression()); //optional if gzip setup in nginx
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan('dev'));

app.use('/suburbs', require('./api/suburb'));

var server = require('http').createServer(app);

mongoose.connect('mongodb://localhost/sub', function() {

  server.listen(8080, function () {
    console.log('Express server listening on %d, in %s mode', 8080, 'dev');
  });

});

// Expose app
exports = module.exports = app;
