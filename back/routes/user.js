const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multerProfile = require('../middleware/multer-profile');

const userCtrl = require('../controllers/user');


//ROUTES pour créer un compte USER et se connecter avec
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);


//ROUTES CRUD USER
router.get('/:username', auth, userCtrl.getOneUser);
router.post('/:id', auth, multerProfile, userCtrl.modifyUser);
router.delete('/:id', auth, userCtrl.deleteOneUser);


router.get('/:username/posts', auth, userCtrl.getUserAllPosts);


module.exports = router;