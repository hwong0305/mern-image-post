import { LOGIN, LOGOUT } from '../actions';

const initialState = {
    loggedIn: false,
    id: null,
    token: null
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                loggedIn: true,
                token: action.payload.token,
                id: action.payload.id
            };
        }
        case LOGOUT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default auth;
