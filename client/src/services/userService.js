import Api from './Api';

export default {
    login(email, password) {
        return Api().post('api/login', {
            email,
            password
        });
    },
    register(email, password) {
        return Api().post('api/register', {
            email,
            password
        });
    },
    logout() {
        return Api().get('api/logout');
    }
};
