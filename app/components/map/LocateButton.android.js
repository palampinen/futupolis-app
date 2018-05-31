// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import { StyleSheet, View } from 'react-native';
import { noop } from 'lodash';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';

const LocateButton = ({ onPress, isLocating }) => (
  <View style={styles.button}>
    <PlatformTouchable
      onPress={onPress}
      style={styles.buttonText}
      background={PlatformTouchable.SelectableBackgroundBorderless()}
      delayPressIn={0}
    >
      <View style={styles.buttonContent}>
        <MDIcon
          size={20}
          style={{ color: isLocating ? theme.blush : theme.inactive }}
          name="navigation"
        />
      </View>
    </PlatformTouchable>
  </View>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.darker,
    elevation: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LocateButton;
