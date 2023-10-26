import { combineReducers } from 'redux'; //we will got multipe reducers so we need  to combine
import alert from './alert';
import auth from './auth';
import profile from './profile';
//object to add any reducer we create
export default combineReducers({
  alert,
  auth,
  profile,
});
