var Sequelize = require('sequelize');
var url = require("url");
if (process.env.ENVIRONMENT === 'heroku') {
  var dbinfo = url.parse(process.env.CLEARDB_DATABASE_URL);
  var user = dbinfo.auth.split(':')[0];
  var pass = dbinfo.auth.split(':')[1];
  var db = new Sequelize(dbinfo.pathname.substring(1), user, pass, {
    host: dbinfo.host,
    dialect: 'mysql'
  })
  
} else {
  var db = new Sequelize('bred', process.env.C9_USER, '', {
    host: 'localhost',
    dialect: 'mysql'
  }); 
}

var Path = db.define('path', {
  title: Sequelize.STRING
});

var Point = db.define('point', {
    timestamp: Sequelize.DATE,
    latitude: Sequelize.DECIMAL(33,30),
    longitude: Sequelize.DECIMAL(33,30),
    message: Sequelize.STRING
});



Path.hasMany(Point);


db.sync({force:true}); //do once


//db.sync({force:true}); // comment this line after the first run  reboot: {force:true}

// db.sync(); // comment this line after the first run


module.exports = {
    Path: Path,
    Point: Point
};
