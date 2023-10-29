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
import Dashboard from './components/Dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';

import PrivateRoute from './components/routing/PrivateRoute'; //use it instead of route from react-rout when you want to be connected to visit an page
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

import PageNotFound from './components/layout/PageNotFound';

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
            <Route exact path='/profiles' element={<Profiles />}></Route>
            <Route exact path='/profile/:id' element={<Profile />}></Route>
            <Route
              path='/dashboard'
              element={<PrivateRoute component={Dashboard} />}
            />
            <Route
              path='/create-profile'
              element={<PrivateRoute component={CreateProfile} />}
            />
            <Route
              path='/edit-profile'
              element={<PrivateRoute component={EditProfile} />}
            />
            <Route
              path='/add-experience'
              element={<PrivateRoute component={AddExperience} />}
            />
            <Route
              path='/add-education'
              element={<PrivateRoute component={AddEducation} />}
            />
            <Route path='/posts' element={<PrivateRoute component={Posts} />} />
            <Route
              path='/posts/:id'
              element={<PrivateRoute component={Post} />}
            />
            <Route path='*' element={<PageNotFound />}>
              {' '}
            </Route>
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
