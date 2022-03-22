const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING(8000),
        allowNull: false
    },
    username: {
        type: DataTypes.STRING(50)
    },
    userIMG: {
        type: DataTypes.STRING(2083)
    }
});

module.exports = Comment;