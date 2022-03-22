const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

//Fonction pour créer un compte USER
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
        })
        .then(() => res.status(201).json({ message: 'User created'}))
        .catch(err => res.status(400).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour se connecter au compte USER
exports.login = (req, res, next) => {
    User.findOne({ where: { username: req.body.username } })
    .then(user => {
        if (!user) return res.status(404).json({ error: 'User not found' })
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) return res.status(401).json({ error: 'Incorrect password'})
            res.status(200).json({
                userId: user.id,
                username: user.username,
                userRole: user.role,
                token: jwt.sign(
                    { userId: user.id, userRole: user.role },
                    process.env.TOKEN_SECRET,
                    { expiresIn: '8h'}
                )
            });
        })
        .catch(err => res.status(500).json({ err }));
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour récupérer les informations d'un USER
exports.getOneUser = (req, res, next) => {
    User.findOne({ where: { username: req.params.username } })
    .then(user => {
        if (!user) return res.status(404).json({ error: 'User not found' })
        res.status(200).json({
            userId: user.id,
            username: user.username,
            bio: user.bio,
            imgURL: user.imgURL
        })
    })
    .catch(err => res.status(400).json({ err }));
};

//Fonction pour modifier les informations d'un USER
exports.modifyUser = (req, res, next) => {
    User.findOne({ where: { id: req.params.id } })
    .then(user => {
        if (!user) return res.status(404).json({ error: 'User not found' })
        if (user.id != req.auth.userId) return res.status(403).json({ error: 'Unauthorized request' })
        if (req.file) {
            user.update({
                imgURL: `${req.protocol}://${req.get('host')}/upload/profile/${req.file.filename}`,
                bio: req.body.bio
            })
            .then(() => res.status(200).json({ message: 'Profile updated with picture'}))
            .catch(() => res.status(400).json(err))
        } else {
            user.update({...req.body})
            .then(() => res.status(200).json({ message: 'Profile updated'}))
            .catch(err => res.status(400).json(err))
        }
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour supprimer son compte
exports.deleteOneUser = (req, res, next) => {
    Rating.destroy({ where: { userId: req.params.id } })
    Comment.destroy({ where: { userId: req.params.id } })
    User.findOne({ where: { id: req.params.id } })
    .then(user => {
        if (!user) return res.status(404).json({ error: 'User not found' })
        if (user.id !== req.auth.userId && req.auth.userRole != 'admin') return res.status(403).json({ error: 'Unauthorized request' })
        //Pour supprimer la photo profil quand elle existe
        if (user.imgURL != null) {
            const filename = user.imgURL.split('/profile/')[1];
            fs.unlink(`upload/profile/${filename}`, () => {
                user.destroy({ where: { id: user.id } })
                .then(() => res.status(200).json({ message: 'User deleted'}))
                .catch(err => res.status(400).json({ err, error: 'User not deleted' }))
            })
        } else {
            user.destroy({ where: { id: user.id } })
            .then(() => res.status(200).json({ message: 'User deleted'}))
            .catch(err => res.status(400).json({ err, error: 'User not deleted' }))
        }
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour récupérer tous les posts d'un USER
exports.getUserAllPosts = (req, res, next) => {
    Post.findAll({ where: { username: req.params.username } })
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(400).json(err));
};
