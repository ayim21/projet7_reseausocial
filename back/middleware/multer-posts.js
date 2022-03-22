const multer = require('multer');

//Pour configurer le chemin et le nom des fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './upload/posts');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, Date.now() + name);
    }
});


module.exports = multer({ storage: storage, limits: { fileSize: 2500000 }}).single('image'); 