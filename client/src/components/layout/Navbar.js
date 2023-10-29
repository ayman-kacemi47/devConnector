import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='register'>Register</Link>
      </li>
      <li>
        <Link to='login'>Login</Link>
      </li>
    </ul>
  );
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i class='fa fa-user' aria-hidden='true'></i>{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link to='#!' onClick={logout}>
          <i class='fa fa-sign-out' aria-hidden='true'></i>{' '}
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <div>
      <nav className='navbar bg-dark'>
        <h1>
          <Link to='/'>
            <i className='fas fa-code'></i> DevConnector
          </Link>
        </h1>
        <Fragment>
          {!loading && (isAuthenticated ? authLinks : guestLinks)}
        </Fragment>
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  mapStateToProps: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
