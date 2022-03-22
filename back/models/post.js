const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Comment = require('./comment');
const Rating = require('./rating');

const Post = sequelize.define('post', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imgURL: {
        type: DataTypes.STRING(2083)
    },
    username: {
        type: DataTypes.STRING(50)
    },
    userIMG: {
        type: DataTypes.STRING(2083)
    }
});


Post.hasMany(Comment);
Post.hasMany(Rating);

module.exports = Post;