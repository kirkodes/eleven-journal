const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:kirkodes@localhost:5432/eleven-journal"); // Use the constructor to create a new sequelize object. The constructor takes in a string which holds all of the pertinent data required to connect to a database, also known as a URI connection.

module.exports = sequelize;