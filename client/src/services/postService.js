import Api from './Api';

export default {
    getPosts() {
        return Api().get('/api/post');
    },

    findPosts(id) {
        return Api().get(`/api/post/${id}`);
    },

    addPost(submission) {
        return Api().post('/api/post/add', submission);
    },

    getPost(id) {
        return Api().get(`/api/post/find/${id}`);
    },

    deletePost(id) {
        return Api().delete('/api/post/delete/', { data: { _id: id } });
    },

    editPost(submission) {
        return Api().put('/api/post/update', submission);
    }
};
