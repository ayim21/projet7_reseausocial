const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('rating', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    likes: {
        type: DataTypes.INTEGER,
    },
    dislikes: {
        type: DataTypes.INTEGER,
    }
});

module.exports = Rating;