const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const ratingCtrl = require('../controllers/rating');


//Routes CRUD des posts LIKE
router.post('/like', auth, ratingCtrl.likePost);
router.get('/like/:postId', auth, ratingCtrl.getTotalLikes);
router.delete('/like/:postId', auth, ratingCtrl.cancelLike);


//Route CRUD des posts DISLIKE
router.post('/dislike', auth, ratingCtrl.dislikePost);
router.get('/dislike/:postId', auth, ratingCtrl.getTotalDislikes);
router.delete('/dislike/:postId', auth, ratingCtrl.cancelDislike);


//Route USER Like et Dislike
router.get('/:postId', auth, ratingCtrl.getUserPostRating);


module.exports = router;