import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'), // look in local storage for item called TOKEN
  isAuthenticated: null,
  loading: true, // verify that we are still Loading , when loading finish= get the data ,will be false , so authenticated
  user: null,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload, // payload here is name,email,gavatar   it's what we did in get from  /api/auth
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);

      return { ...state, ...payload, isAuthenticated: true, loading: false };

    case AUTH_ERROR: // if auth_error we will do the same as Registe_fail case
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('token'); // if registration failed , remove the token from the localstorage
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
}
