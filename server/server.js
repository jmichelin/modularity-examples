var http = require('http');
var express = require('express');
var parser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();
var routes = require('./routes.js');
var db = require('./db.js')
var helper = require('./helper.js');

module.exports.app = app;
app.use(parser.json());

app.use(routes.authGet);
app.use(routes.logoutGet);
app.use(routes.signinGet);
app.use(routes.signinPost);
app.use(routes.singupGet);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.set('port', process.env.PORT || 1337);
app.use(express.static('./public'));

if (module.parent) {
  module.exports = app;
} else {
  app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
}