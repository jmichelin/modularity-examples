var http = require('http');
var express = require('express');
var parser = require('body-parser');
var nodemailer = require('nodemailer');
var app = express();
var url = require('url');
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var mysql = require('mysql');
var Sequelize = require("sequelize");
var dbconfig = require('../config.js');


console.log('dbconfig ', dbconfig.db.username);
//
//DATABASE
//

var sequelize = new Sequelize(dbconfig.db.database, dbconfig.db.username, dbconfig.db.password, {
  host: dbconfig.db.host
});

//console.log('sequelize', sequelize);

var User = sequelize.define("User", {
  username: Sequelize.STRING,
  firstname: Sequelize.STRING,
  lastname: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  token: Sequelize.STRING,
  profilePicture: Sequelize.BLOB('long'),
},{
  createdAt: false,
  updatedAt: false
});

var Device = sequelize.define("Device", {
  name: Sequelize.STRING,
  apiKey: Sequelize.STRING,
  zipCode: Sequelize.STRING,
  dangerTriggerid: {type: Sequelize.STRING, defaultValue: 0},
  dangerTrigger: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
  dryTriggerid: {type: Sequelize.STRING, defaultValue: 0},
  dryTrigger: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
  drenchedTriggerid: {type: Sequelize.STRING, defaultValue: 0},
  drenchedTrigger: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false}
});


User.hasMany(Device);
Device.belongsTo(User);

User.sync().then(function(){
  Device.sync();
});
//


//
//HELPER FUNCTIONS
//


var comparePass = function (userPass, dataPass, callback) {
  bcrypt.compare(userPass, dataPass, function (err, loggedin) {
    callback(loggedin);
  })
};

var cryptPass = function (password, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      callback(hash);
    });
  })
};

var cryptToken = function (username, callback) {
  bcrypt.genSalt(10, function (err, salt) {
    var token = jwt.encode(username + salt, 'secret');
    callback(JSON.stringify(token));
  })
};

signIn = function (callback, params) {
  db.User.find({where: {username: params.username}})
    .then(function (data) {
      if (data) {
        comparePass(params.password, data.password, function (response) {
          if (response) {
            db.User.find({
              where: {username: params.username},
              attributes: ['id', 'username', 'firstname', 'lastname', 'email']
            })
              .then(function (data) {
                cryptToken(params.username, function (storedToken) {
                  data.update({token: storedToken})
                    .then(function () {
                      data.dataValues.token = storedToken;
                      delete data.dataValues.id;
                      callback(data);
                    })
                })
              })
          } else {
            callback(response, 'Invalid password');
          }
        })
      } else {
        callback(false, 'Invalid username');
      }
    })
};

signUp = function (callback, params) {
  db.User.find({where: {username: params.username}})
    .then(function (data) {
      if (!data) {
        db.User.find({where: {email: params.email}})
          .then(function (data) {
            if (!data) {
              cryptPass(params.password, function (hash) {
                cryptToken(params.username, function (storedToken) {
                  db.User.bulkCreate([{
                    username: params.username,
                    email: params.email,
                    password: hash,
                    firstname: params.firstname,
                    lastname: params.lastname,
                    token: storedToken
                  }])
                    .then(function () {
                      db.User.find({
                        where: {username: params.username},
                        attributes: ['username', 'firstname', 'lastname', 'token', 'email']
                      })
                        .then(function (userData) {
                          callback(userData);
                        })
                    })
                })
              })
            } else {
              callback(false, 'Email exists');
            }
          })
      } else {
        callback(false, 'Username exists');
      }
    })
};

logout = function (callback, params) {
  db.User.find({where: {token: params.token}, attributes: ['id', 'token']})
    .then(function (data) {
      if (data) {
        data.update({token: 'NULL'})
          .then(function () {
            callback(true, 'Token deleted');
          })
      } else {
        callback(false, 'Invalid token')
      }

    })
};
//


//
//ROUTES
//
app.get('/signin', function (req, res) {
  models.signin.get(function (data) {
    res.send(data);
  }, req.body);
});

app.post('/signin', function (req, res) {
  models.signin.post(function (data, msg) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send(msg);
    }
  }, req.body)
});

app.get('/signup', function (req, res) {
  models.signup.get(function (data) {
    res.send(data);
  })
});

app.post('/signup', function (req, res) {
  models.signup.post(function (data, msg) {
    if (data) {
      res.send(data);
    } else {
      res.status(404).send(msg);
    }
  }, req.body);
});

app.get('/logout', function (req, res) {
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

app.get('/auth', function (req, res) {
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

//
//


app.use(parser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

var port = 7337;
app.use(express.static('./public'));

app.listen(port);

console.log('Server listening on localhost:',port );
