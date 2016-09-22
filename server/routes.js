/**
 * Created by jmichelin on 9/22/16.
 */
/*
var routes = require('./routes.js');

app.use('/api', routes);
apiController.js



 var someRoute = routes.get('/some/route', (req, res) => {
  // some code...
})

module.exports = {
  someRoute: someRoute
};
*/

var express = require('express');
var apiRouter = express.Router();

var signinGet = apiRouter.get('/signin', function (req, res) {
  models.signin.get(function (data) {
    res.send(data);
  }, req.body);
});

var signinPost = apiRouter.post('/signin', function (req, res) {
  models.signin.post(function (data, msg) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send(msg);
    }
  }, req.body)
});

var singupGet = apiRouter.get('/signup', function (req, res) {
  models.signup.get(function (data) {
    res.send(data);
  })
});

var signupPost = apiRouter.post('/signup', function (req, res) {
  models.signup.post(function (data, msg) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send(msg);
    }
  }, req.body);
});

var logoutGet = apiRouter.get('/logout', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  models.logout.get(function (data, msg) {
    if (data) {
      res.send(msg)
    } else {
      res.status(404).send(msg);
    }
  }, query)
});

var authGet = apiRouter.get('/auth', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  models.auth.get(function (data, msg) {
    if (data) {
      res.send(msg);
    } else {
      res.status(404).send(msg);
    }
  }, query)
});

module.exports = {
  signinGet:signinGet,
  signinPost:signinPost,
  singupGet:singupGet,
  signupPost:signupPost,
  logoutGet:logoutGet,
  authGet:authGet
};

