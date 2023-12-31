import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const alert = ({ alert }) =>
  alert !== null &&
  alert.length > 0 && (
    <div className='alert-wrapper'>
      {alert.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType} `}>
          {alert.msg}
        </div>
      ))}
    </div>
  );

alert.propTypes = {
  alert: PropTypes.array.isRequired, //props.alerts but we distructered the props
};

const mapStateToProps = (state) => ({
  alert: state.alert,
});

export default connect(mapStateToProps)(alert);
