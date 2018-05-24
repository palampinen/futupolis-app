'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

// TODO re-enable
// const toolbarActions = [
//   {title: 'Share', id:'share'}
// ];

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.primary,
    position: 'relative',
    left: 0,
    top: 0,
    right: 0,
    elevation: 2,
    height: 56,
    justifyContent: 'flex-start',
  },
});

class Header extends Component {
  _goBack() {
    this.props.navigator.pop();
  }

  _onActionSelected(position) {
    //TODO switch toolbarActions[position]
  }

  render() {
    const toolbarStyles = [styles.toolbar];

    if (this.props.backgroundColor) {
      toolbarStyles.push({ backgroundColor: this.props.backgroundColor });
    }

    return (
      <Icon.ToolbarAndroid
        // actions={[{title: 'Share', id:'share'}, {title: 'Settings', id:'settings'}]}
        // actions={toolbarActions} TODO - SHARE
        // onActionSelected={this._onActionSelected}
        navIconName={'arrow-back'}
        // logo={require('../../../assets/logo-toolbar.png')}
        onIconClicked={this._goBack}
        iconColor={theme.blue2}
        titleColor={this.props.titleColor || theme.blue2}
        style={toolbarStyles}
        title={this.props.title}
      />
    );
  }
}

module.exports = Header;
