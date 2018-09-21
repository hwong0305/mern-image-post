const express = require('express');
const router = express.Router();

const authController = require('./controllers/authController');
const postController = require('./controllers/postController');
const isAuthenticated = require('./policies/authPolicy');

router.post('/login', authController.login);

router.post('/register', authController.register);

router.get('/post', postController.findAllPosts);

router.get(
    '/post/:id',
    isAuthenticated.isAuthenticated,
    postController.getPosts
);

router.post(
    '/post/add',
    isAuthenticated.isAuthenticated,
    postController.createPost
);

router.put(
    '/post/update',
    isAuthenticated.isAuthenticated,
    postController.updatePost
);

router.get('/post/find/:id', postController.findPost);

router.delete(
    '/post/delete',
    isAuthenticated.isAuthenticated,
    postController.deletePost
);

router.get('/logout', authController.logout);

module.exports = router;
