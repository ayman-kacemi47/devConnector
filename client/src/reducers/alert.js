import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [
  /*  the intial State is an empty array , this is exemple :
    {
        id: 1,
        msg:'Please Log in',
        alertType : 'success'   for colors 
    }
     */
];
export default function alertReducer(state = initialState, action) {
  const { type, payload } = action; // to avoid action.type & action.payload
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
