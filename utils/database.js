const Sequelize = require('sequelize');

const sequelize = new Sequelize('online-shop', 'root', 'database', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
