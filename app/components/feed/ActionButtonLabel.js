'use strict';

import React, { Component } from 'react';
import { Animated, View, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../Text';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  label: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    padding: 6,
    top: 16,
    height: Platform.OS === 'ios' ? 26 : 27,
    backgroundColor: '#FFF',
    elevation: 2,
    borderRadius: 3,
    right: 60,
  },
  labelText: {
    fontSize: 12,
    fontWeight: 'normal',
    top: 2,
    color: theme.dark,
  },
  additionalLabelText: {
    color: '#bbb',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 11,
    flex: 1,
  },
});

class ActionButtonLabel extends Component {
  render() {
    const combinedStyle = [styles.label];
    const { extraStyle, children, additionalLabel, onPress } = this.props;

    if (extraStyle) {
      combinedStyle.push(extraStyle);
    }

    return (
      <Animated.View style={combinedStyle}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
          <Text style={styles.labelText}>{children}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default ActionButtonLabel;
