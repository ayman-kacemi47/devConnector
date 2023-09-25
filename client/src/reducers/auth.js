import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'), // look in local storage for item called TOKEN
  isAuthenticated: null,
  loading: true, // verify that we are still moading , when loading finish= get the data ,will be false , so authenticated
  user: null,
};

export default function authReducer(state = initialState, action) {
  const { type, paylaod } = action;
  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', paylaod.token);
      return { ...state, ...paylaod, isAuthenticated: true, loading: false };
    case REGISTER_FAIL:
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
