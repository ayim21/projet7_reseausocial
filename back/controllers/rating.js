const Rating = require('../models/rating');

//Fonction pour liker un POST
exports.likePost = (req, res, next) => {
    Rating.findOne({ where: { 
        postId: req.body.postId, 
        userId: req.body.userId, 
        likes: 0, 
        dislikes: 1 } })
    .then(rating => {
        if (rating) return res.status(200).json({ message: 'Already disliked' })
        if (!rating) {
            Rating.create({
                likes: 1,
                dislikes: 0,
                userId: req.body.userId,
                postId: req.body.postId
            })
            .then(() => res.status(201).json({ message: 'Post liked' }))
            .catch(err => res.status(400).json({ err }))
        }
    })
    .catch(err => res.status(500).json({ err }))
};

//Fonction pour annuler son like
exports.cancelLike = (req, res, next) => {
    Rating.findOne({ where: { 
        postId: req.params.postId, 
        userId: req.auth.userId, 
        likes: 1 } })
    .then(rating => {
        if (!rating) return res.status(404).json({ message: 'No like to cancel' })
        if (rating.userId !== req.auth.userId) return res.status(403).json({ error: 'Unauthorized request' })
        rating.destroy()
        .then(() => res.status(200).json({ message: 'Like cancelled' }))
        .catch(err => res.status(400).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}

//Fonction pour disliker un POST
exports.dislikePost = (req, res, next) => {
    Rating.findOne({ where: { 
        postId: req.body.postId, 
        userId: req.body.userId, 
        likes: 1, 
        dislikes: 0 } })
    .then(rating => {
        if (rating) return res.status(200).json({ message: 'Already liked' })
        if (!rating) {
            Rating.create({
                likes: 0,
                dislikes: 1,
                userId: req.body.userId,
                postId: req.body.postId
            })
            .then(() => res.status(201).json({ message: 'Post disliked' }))
            .catch(err => res.status(400).json({ err }))
        }
    })
    .catch(err => res.status(500).json({ err }))
};

//Fonction pour annuler son dislike
exports.cancelDislike = (req, res, next) => {
    Rating.findOne({ where: { 
        postId: req.params.postId, 
        userId: req.auth.userId, 
        dislikes: 1 } })
    .then(rating => {
        if (!rating) return res.status(404).json({ message: 'No dislike to cancel' })
        if (rating.userId !== req.auth.userId) return res.status(403).json({ error: 'Unauthorized request' })
        rating.destroy()
        .then(() => res.status(200).json({ message: 'Dislike cancelled' }))
        .catch(err => res.status(400).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
};

//Fonction pour récupérer le TOTAL des Likes d'un POST
exports.getTotalLikes = (req, res, next) => {
    Rating.findAll({ where: { postId: req.params.postId, likes: 1 } })
    .then(total => res.status(200).json(total))
    .catch(err => res.status(400).json({ err }));
};

//Fonction pour récupérer le TOTAL des Dislikes d'un POST
exports.getTotalDislikes = (req, res, next) => {
    Rating.findAll({ where: { postId: req.params.postId, dislikes: 1 }})
    .then(total => { res.status(200).json(total)})
    .catch(err => res.status(400).json({ err }));
};

//Fonction pour récupérer USER Like ou Dislike d'un POST
exports.getUserPostRating = (req, res, next) => {
    Rating.findOne({ where: {
        postId: req.params.postId, 
        userId: req.auth.userId } })
    .then(rating => {
        if(!rating) res.status(200).json({
            like: 0,
            dislike: 0
        })
        if(rating) res.status(200).json({ 
            like: rating.likes,
            dislike: rating.dislikes
        })
    }).catch(err => res.status(400).json(err))
}

