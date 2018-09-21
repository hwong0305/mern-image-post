const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    uid: String,
    img: String,
    title: String,
    author: String,
    description: String,
    aspectRatio: Number,
    cols: Number
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
