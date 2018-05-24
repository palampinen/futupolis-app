import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import ParsedText from 'react-native-parsed-text';

import theme from '../../../style/theme';

const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  itemTextWrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 5,
  },
  feedItemListText: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: IOS ? 25 : 30,
    color: theme.white,
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
  },
  shortText: {
    fontSize: 28,
    lineHeight: 40,
  },
  imageItemTextWrapper: {
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 5,
    paddingBottom: 10,
  },
  imageItemText: {
    textAlign: 'left',
    fontSize: 13,
    lineHeight: IOS ? 20 : 22,
  },
  url: {
    color: theme.blush,
  },
});

const FeedItemText = ({ text, isItemImage, handleUrlPress }) => {
  return (
    <View style={[styles.itemTextWrapper, isItemImage ? styles.imageItemTextWrapper : {}]}>
      <ParsedText
        style={[
          styles.feedItemListText,
          !isItemImage && text && text.length < 20 ? styles.shortText : {},
          isItemImage ? styles.imageItemText : {},
        ]}
        parse={[{ type: 'url', style: styles.url, onPress: handleUrlPress }]}
      >
        {text}
      </ParsedText>
    </View>
  );
};

export default FeedItemText;
