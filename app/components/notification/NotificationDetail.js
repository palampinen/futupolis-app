import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SingleNotification from './SingleNotification';


class NotificationDetail extends Component {
  propTypes: {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  render() {
    const { model } = this.props.route;
    return <SingleNotification notification={model} />
  }
}

export default NotificationDetail;
