const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./post');
const Comment = require('./comment');
const Rating = require('./rating');

//First parameter is the name of the table
//Second one is an object describing each of the fields
const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING, //VARCHAR(255) by default
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(25),
        defaultValue: 'member'
    },
    imgURL: {
        type: DataTypes.STRING(2083)
    },
    bio: {
        type: DataTypes.STRING,
    }
});

User.hasMany(Post);
User.hasMany(Comment);
User.hasMany(Rating);


module.exports = User;