import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; //import connect to make interaction with componenets
import { setAlert } from '../../actions/alert'; //import the action
import PropTypes from 'prop-types';

const Register = ({ setAlert }) => {
  //it's (props.setAlert) but we distructer it  to ({setAlert})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = formData; //destructor formData , to avoid using formData.name

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value }); // ...formData 'spread operator' , is used to copy what is in there then , we can change what we want

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('password not match !', 'danger', 3000); //danger it's alert type 'BOOTSTRap'
    } else {
      console.log('SUCCESS');
    }
  };
  return (
    <section className='container'>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Create Your Account
      </p>
      <form
        className='form'
        action='create-profile.html'
        onSubmit={(e) => onSubmit(e)}
      >
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            value={password2}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </section>
  );
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert })(Register); //connect( any state  u want , { object of actions so in our case props.alert } )
