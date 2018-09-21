const firebase = require('firebase');
const validator = require('validator');

module.exports = {
    async register(req, res) {
        try {
            if (!validator.isEmail(req.body.email)) {
                res.status(400).send({
                    error: 'Invalid Email'
                });
            } else if (req.body.password.length === 0) {
                res.status(400).send({
                    error: 'Invalid Password'
                });
            } else {
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        req.body.email,
                        req.body.password
                    );
                res.send({
                    success: true
                });
            }
        } catch (error) {
            res.status(500).send({
                code: error.code,
                message: error.message
            });
        }
    },

    async login(req, res) {
        try {
            if (!validator.isEmail(req.body.email)) {
                res.status(400).send({
                    error: 'Invalid Email'
                });
            } else if (req.body.password.length === 0) {
                res.status(400).send({
                    error: 'Invalid Password'
                });
            } else {
                const user = await firebase
                    .auth()
                    .signInWithEmailAndPassword(
                        req.body.email,
                        req.body.password
                    );
                const response = await firebase.auth().currentUser.getIdToken();
                const userResponse = {
                    token: response,
                    id: user.user.uid
                };
                res.send(userResponse);
            }
        } catch (error) {
            res.status(500).send({
                code: error.code,
                message: error.message
            });
        }
    },

    async logout(req, res) {
        try {
            await firebase.auth().signOut();
            res.send({
                success: true
            });
        } catch (err) {
            res.status(500).send({
                message: 'An error occured while signing out'
            });
        }
    }
};
