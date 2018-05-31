import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, View } from 'react-native';

const ringLightImage = require('../../../assets/futupolis/ring-light.png');
const styles = StyleSheet.create({
  img: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
  },
});

const RingLight = ({ source, style, width, height }) => (
  <View style={[style, { width: width + 6, height: height + 6, padding: 3 }]}>
    <Image source={source} style={style} />
    <Image source={ringLightImage} style={[{ width: width + 6, height: height + 6 }, styles.img]} />
  </View>
);

export default RingLight;
