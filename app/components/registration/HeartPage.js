'use strict';

import React, { Component } from 'react';
import { View, Image, StyleSheet, Dimensions, Platform } from 'react-native';

import theme from '../../style/theme';
import Text from '../Text';
import AnimateMe from '../AnimateMe';

const heartImg = require('../../../assets/futupolis/heart.png');
const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

const HeartPage = ({ delay }) => (
  <AnimateMe style={styles.container} animationType="fade-out" duration={300} delay={delay - 300}>
    <AnimateMe animationType="fade-out" style={styles.imgWrap} duration={3000} delay={delay - 3000}>
      <Image source={heartImg} style={styles.img} resizeMode="contain" />
    </AnimateMe>
    <AnimateMe
      animationType="scale-fade-in"
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={styles.text}>“THE MEDIATOR BETWEEN HEAD AND HANDS MUST BE THE HEART”</Text>
    </AnimateMe>

    <View style={styles.footer}>
      <Text style={styles.footerText}>FUTUPOLIS</Text>
    </View>
  </AnimateMe>
);

HeartPage.defaultProps = {
  delay: 3000,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 11,
    padding: 30,
    backgroundColor: theme.black,
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWrap: {
    flex: 1,
    position: 'absolute',
    width: width - 60,
  },
  img: {
    width: width - 60,
  },
  text: {
    color: theme.white,
    fontSize: 33,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
  },
  footerText: {
    color: theme.stable,
    opacity: 0.8,
    letterSpacing: 4,
    fontSize: 22,
    textAlign: 'center',
  },
});

export default HeartPage;
