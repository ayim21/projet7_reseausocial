const Sequelize = require('sequelize');

const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST
});


module.exports = sequelize;
