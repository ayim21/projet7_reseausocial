const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        //Vérifier s'il y a un token ou non dans l'en-tête, et s'il est valide ou non
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET); 
            const userId = decodedToken.userId;
            const userRole = decodedToken.userRole;
            console.log(userRole);
            req.auth = { userId, userRole };
            //Vérifier le userId contenu dans la requête correspond avec celui du token
            //Et vérifier si c'est un admin ou non
            if (req.body.userId && req.body.userId != userId && userRole != 'admin') {
                throw 'Unauthorized request';
            } else {
                next();
            }
        } else {
            throw 'Authentication failed';
        }
    } catch (error) {
        res.status(401).json({ error });
    }
};