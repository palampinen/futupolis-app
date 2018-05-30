import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Linking, Image, Dimensions, Platform } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import theme from '../../style/theme';

import Text from '../Text';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.transparent,
    paddingBottom: 50,
  },
  title: {
    fontSize: 25,
    lineHeight: 27,
    color: theme.white,
    padding: 20,
    paddingVertical: 15,
  },
  text: {
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
    color: theme.white,
    fontSize: 15,
    lineHeight: 24,
    padding: 20,
  },
  url: {
    textDecorationLine: 'underline',
  },
  image: {
    width,
    height: 240,
    maxHeight: 240,
    backgroundColor: theme.darker,
  },
});

const TripContent = ({ venue, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title} bold>
        {venue.get('title')}
      </Text>
      <Image source={{ uri: venue.get('imageUrl') }} style={styles.image} resizeMode="cover" />

      <ParsedText
        style={styles.text}
        parse={[{ type: 'url', style: styles.url, onPress: url => Linking.openURL(url) }]}
      >
        {venue.get('subtitle')}
      </ParsedText>

      {children}
    </View>
  );
};

export default TripContent;
