const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multerPosts = require('../middleware/multer-posts');

const postCtrl = require('../controllers/post');


//Routes CRUD des POSTS
router.post('/', auth, multerPosts, postCtrl.createPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);


//Routes CRUD des comments et likes et dislikes d'un POST
router.get('/:id/comment', auth, postCtrl.getPostAllComments);


module.exports = router;