'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

// const toolbarActions = [
//   {title: 'Share', id:'share'}
// ];

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: 'rgba(30, 30, 30, .4)',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    elevation: 2,
    height: 56,
  },
});

class EventDetailToolbar extends Component {
  @autobind
  goBack() {
    this.props.navigator.pop();
  }

  onActionSelected(position) {
    //TODO switch toolbarActions[position]
  }

  render() {
    const { backgroundColor, color } = this.props;

    return (
      <Icon.ToolbarAndroid
        // actions={toolbarActions} TODO: SHARE
        // onActionSelected={this._onActionSelected}
        onIconClicked={this.goBack}
        navIconName={'arrow-back'}
        titleColor={color || theme.white}
        iconColor={color || theme.white}
        style={[styles.toolbar, backgroundColor ? { backgroundColor } : {}]}
        title={this.props.title}
      />
    );
  }
}

module.exports = EventDetailToolbar;
