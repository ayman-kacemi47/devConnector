import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const alert = ({ alert }) =>
  alert !== null &&
  alert.length > 0 &&
  alert.map((alert) => (
    <div
      key={alert.id}
      className={`alert alert-${alert.alertType} alert-wrapper`}
    >
      {alert.msg}
    </div>
  ));

alert.propTypes = {
  alert: PropTypes.array.isRequired, //props.alerts but we distructered the props
};

const mapStateToProps = (state) => ({
  alert: state.alert,
});

export default connect(mapStateToProps)(alert);
