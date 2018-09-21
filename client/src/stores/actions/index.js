export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function Login(payload) {
    return {
        type: LOGIN,
        payload
    };
}

export function Logout() {
    return {
        type: LOGOUT
    };
}
