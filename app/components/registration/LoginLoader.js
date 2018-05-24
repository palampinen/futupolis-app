import React from 'react';
import { View, StyleSheet } from 'react-native';

import Text from '../Text';
import AnimateMe from '../AnimateMe';
import theme from '../../style/theme';

const LoginLoader = () => (
  <View style={styles.container}>
    <View style={styles.texts}>
      <Text style={styles.text}> Loading</Text>
      <AnimateMe animationType="fade-in" duration={400} infinite style={{ flex: 0 }}>
        <Text style={styles.text}>_</Text>
      </AnimateMe>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.darker,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
    color: theme.stable,
    fontSize: 22,
    marginHorizontal: 3,
  },
});

export default LoginLoader;
