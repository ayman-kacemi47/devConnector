import { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/alert';
// Redux ( to be able to use that store ...)
import { Provider } from 'react-redux';
import store from './store';

import { loadUser } from '../src/actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); //the , [] we added in useEffect as second argument is for run it once , instead of rerune it
  // if we filled those  brackets, [] , it will be update , if those properties update
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Alert />
          <Routes>
            <Route exact path='/' element={<Landing />} />
            <Route exact path='/register' element={<Register />}></Route>
            <Route exact path='/login' element={<Login />}></Route>
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
