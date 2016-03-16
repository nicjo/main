var Sequelize = require('sequelize');

var db = new Sequelize('bred', process.env.C9_USER, '', {
  host: 'localhost',
  dialect: 'mysql'
});

var Path = db.define('path', {
  title: Sequelize.STRING
});

var Point = db.define('point', {
    timestamp: Sequelize.DATE,
    latitude: Sequelize.FLOAT,
    longitude: Sequelize.FLOAT
});

Path.hasMany(Point);

// db.sync(); // comment this line after the first run

module.exports = {
    Path: Path,
    Point: Point
};