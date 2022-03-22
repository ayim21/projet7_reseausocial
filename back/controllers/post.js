const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Rating = require('../models/rating');
const fs = require('fs');


//Fonction pour créer un post
exports.createPost = (req, res, next) => {
    User.findOne({ where: { id: req.auth.userId } })
    .then(user => {
        if (!user) return res.status(404).json({ error: 'User not found' })
        if (req.file) {
            user.createPost({
                content: req.body.content,
                username: user.username,
                userIMG: user.imgURL,
                imgURL: `${req.protocol}://${req.get('host')}/upload/posts/${req.file.filename}`
            })
            .then(() => res.status(201).json({ message: 'Post created with picture'}))
            .catch(err => res.status(400).json({ err }));
        } else {
            user.createPost({
                content: req.body.content,
                username: user.username,
                userIMG: user.imgURL,
            })
            .then(() => res.status(201).json({ message: 'Post created'}))
            .catch(err => res.status(400).json({ err }));
        }
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour récupérer tous les posts
exports.getAllPosts = (req, res, next) => {
    Post.findAll()
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(400).json({ err }));
};

//Fonction pour récupérer un post
exports.getOnePost = (req, res, next) => {
    Post.findOne({ where: { id: req.params.id } })
    .then(post => res.status(200).json(post))
    .catch(err => res.status(400).json({ err }))
};

//Fonction pour modifier un post
exports.modifyPost = (req, res, next) => {
    Post.findOne({ where: { id: req.params.id } })
    .then(post => {
        if (!post) return res.status(404).json({ error: 'Post not found' })
        if (post.userId != req.auth.userId) return res.status(403).json({ error: 'Unauthorized request' })
        post.update({ ...req.body })
        .then(() => res.status(200).json({ message: 'Post updated'}))
        .catch(err => res.status(400).json({ err }))
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour supprimer un post
exports.deletePost = (req, res, next) => {
    Comment.destroy({ where: { postId: req.params.id } })
    Rating.destroy({ where: { postId: req.params.id }})
    Post.findOne({ where: { id: req.params.id } })
    .then(post => {
        if (!post) return res.status(404).json({ error: 'Post not found' })
        if (post.userId !== req.auth.userId && req.auth.userRole != 'admin') return res.status(403).json({ error: 'Unauthorized request' })
        //Pour supprimer la photo du post quand elle est présente
        if (post.imgURL != null) {
            const filename = post.imgURL.split('/posts/')[1];
            fs.unlink(`upload/posts/${filename}`, () => {
                post.destroy({ where: { id: req.params.id } })
                .then(() => res.status(200).json({ message: 'Post deleted' }))
                .catch(err => res.status(400).json({ err, error: 'Post not deleted' }))
            })
        } else {
            post.destroy({ where: { id: req.params.id } })
            .then(() => res.status(200).json({ message: 'Post deleted' }))
            .catch(err => res.status(400).json({ err, error: 'Post not deleted' }))
        }
    })
    .catch(err => res.status(500).json({ err }));
};

//Fonction pour récupérer tous les commentaires d'un même post
exports.getPostAllComments = (req, res, next) => {
    Comment.findAll({ where: { postId: req.params.id } })
    .then(comments => res.status(200).json(comments))
    .catch(err => res.status(400).json(err));
}


