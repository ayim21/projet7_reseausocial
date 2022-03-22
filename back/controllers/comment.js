const Comment = require('../models/comment');
const User = require('../models/user');

//Fonction pour créer un commentaire
exports.createComment = (req, res, next) => {
    User.findOne({ where: { id: req.body.userId } })
    .then(user => {
        if (!user) return res.status(404).json({ error: 'User not found' })
        user.createComment({
            content: req.body.content,
            userId: req.body.userId,
            postId: req.body.id,
            username: req.body.username,
            userIMG: user.imgURL
        })
        .then(() => res.status(201).json({ message: 'Comment created' }))
        .catch(err => res.status(400).json({ err }));
    }).catch(err => res.status(500).json({ err }))
};

//Fonction pour récupérer tous les commentaires
exports.getAllComments = (req, res, next) => {
    Comment.findAll()
    .then(comments => res.status(200).json(comments))
    .catch(err => res.status(400).json({ err }));
};

//Fonction pour récupérer un commentaire
exports.getOneComment = (req, res, next) => {
    Comment.findOne({ where: {id: req.params.id} })
    .then(comment => {
        if (!comment) return res.status(404).json({ error: 'Comment not found' })
        res.status(200).json(comment)
    })
    .catch(err => res.status(400).json({ err }))
}

//Fonction pour modifier un commentaire
exports.modifyComment = (req, res, next) => {
    Comment.findOne({ where: { id: req.params.id } })
    .then(comment => {
        if (!comment) return res.status(404).json({ error: 'Comment not found' })
        if (comment.userId != req.auth.userId) res.status(403).json({ error: 'Unauthorized request' })
        comment.update({ content: req.body.content })
        .then(() => res.status(200).json({ message: 'Comment updated' }))
        .catch(err => res.status(400).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
};

//Fonction pour supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    Comment.findOne({ where: { id: req.params.id } })
    .then(comment => {
        if (!comment) return res.status(404).json({ error: 'Comment not found' })
        if (comment.userId != req.auth.userId && req.auth.userRole != 'admin') return res.status(403).json({ error: 'Unauthorized request' })
        comment.destroy({ where: { id: req.params.id }})
        .then(() => res.status(200).json({ message: 'Comment deleted' }))
        .catch(err => res.status(400).json({ err }))
    })
    .catch(err => res.status(500).json({ err }));
};


