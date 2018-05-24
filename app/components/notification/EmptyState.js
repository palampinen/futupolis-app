import React from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { Map } from 'immutable';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../Text';
import AnimateMe from '../AnimateMe';

import theme from '../../style/theme';
import typography from '../../style/typography';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <AnimateMe style={{ flex: 0 }} delay={300} animationType={'fade-from-bottom'}>
        <View style={styles.circle}>
          <AnimateMe style={{ flex: 0 }} delay={600} animationType={'drop-in'}>
            <Icon style={styles.commentIcon} name={'notifications'} />
          </AnimateMe>
        </View>
      </AnimateMe>
      <Text style={styles.title}>No Notifications</Text>
      <Text style={styles.explanation}>
        When you get the first event notification, it'll show up here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: width / 3.5,
    backgroundColor: theme.darker,
  },
  circle: {
    backgroundColor: theme.dark,
    width: width / 2,
    height: width / 2,
    borderRadius: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentIcon: {
    color: theme.white,
    fontSize: width / 4,
    backgroundColor: 'transparent',
    top: 0,
  },
  title: {
    marginTop: 25,
    color: theme.white,
    fontSize: 20,
    textAlign: 'center',
  },
  explanation: {
    textAlign: 'center',
    color: theme.grey2,
    marginTop: 15,
    lineHeight: 23,
    paddingHorizontal: 20,
  },
});

export default EmptyState;
