const Post = require('../models/post');

module.exports = {
    async findAllPosts(req, res) {
        try {
            const posts = await Post.find();
            res.send(posts);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured getting all the posts.'
            });
        }
    },

    async getPosts(req, res) {
        try {
            const posts = await Post.find({
                uid: req.params.id
            });
            res.send(posts);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured getting all the posts.'
            });
        }
    },

    async createPost(req, res) {
        try {
            const post = await Post.create({
                uid: req.body.uid,
                img: req.body.img,
                title: req.body.title,
                author: req.body.author,
                cols: req.body.cols,
                aspectRatio: req.body.aspectRatio,
                description: req.body.description
            });
            res.send(post);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured creating a post'
            });
        }
    },

    async updatePost(req, res) {
        try {
            const post = await Post.findById(req.body._id);
            await post.updateOne({
                img: req.body.img,
                title: req.body.title,
                author: req.body.author,
                cols: req.body.cols,
                aspectRatio: req.body.aspectRatio,
                description: req.body.description
            });
            res.send(post);
        } catch (err) {
            res.status(500).send({
                message: 'An error while updating the post'
            });
        }
    },

    async findPost(req, res) {
        try {
            const post = await Post.findOne({
                _id: req.params.id
            });
            res.send(post);
        } catch (err) {
            res.status(500).send({
                message: 'An error occured getting all the posts'
            });
        }
    },

    async deletePost(req, res) {
        try {
            const post = await Post.findOne({
                _id: req.body._id
            });
            post.remove();
            res.send({
                success: true
            });
        } catch (err) {
            res.status(500).send({
                success: false
            });
        }
    }
};
