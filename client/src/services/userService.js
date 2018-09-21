import Api from './Api';

export default {
    login(email, password) {
        return Api().post('http://localhost:8081/api/login', {
            email,
            password
        });
    },
    register(email, password) {
        return Api().post('http://localhost:8081/api/register', {
            email,
            password
        });
    },
    logout() {
        return Api().get('http;//localhost:8081/api/logout');
    }
};
