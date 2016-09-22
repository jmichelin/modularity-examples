var Sequelize = require("sequelize");
var dbconfig = require('../../config');

var sequelize = new Sequelize(dbconfig.db.database, dbconfig.db.username, dbconfig.db.password, {
  host: dbconfig.db.host
});

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

exports.User = User;
exports.Device = Device;
exports.sequelize = sequelize;
