const firebase = require('firebase');

module.exports = {
    isAuthenticated(req, res, next) {
        const user = firebase.auth().currentUser;
        if (user) {
            next();
        } else {
            res.status(401).send({
                error: 'Unauthorized'
            });
        }
    }
};
