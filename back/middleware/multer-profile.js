const multer = require('multer');

//Pour configurer le chemin et le nom des fichiers entrants
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './upload/profile');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, name + '.jpg');
    }
});

module.exports = multer({ storage: storage, limits: { fileSize: 500000 }}).single('image');

