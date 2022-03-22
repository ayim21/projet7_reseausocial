/***************    Connection to MySql DB    ***************/
const sequelize = require('./config/database');

sequelize.sync().then(() => console.log('Connected to MySql DB'))
.catch(err => console.log(err));

/***************    Express Middlewares    ***************/
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const ratingRoutes = require('./routes/rating');


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //permet d'accèder à l'API depuis n'importe quelle orgine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//ROUTES
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

//ROUTES pour gérer les fichiers images
app.use('/upload/profile', express.static(path.join(__dirname, './upload/profile')));
app.use('/upload/posts', express.static(path.join(__dirname, './upload/posts')));

module.exports = app;