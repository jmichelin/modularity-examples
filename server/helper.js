/**
 * Created by jmichelin on 9/22/16.
 */
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

var signIn = function (callback, params) {
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

var signUp = function (callback, params) {
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

var logout = function (callback, params) {
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
module.exports = {
  logout:logout,
  signIn:signIn,
  signUp:signUp
}