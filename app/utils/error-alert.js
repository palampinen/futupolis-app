import React from 'react';
import { StyleSheet, Linking, View, Platform } from 'react-native';
import { RESET_ERROR_MESSAGE } from '../actions/errors';
import ParsedText from 'react-native-parsed-text';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../components/Text';
import Button from '../components/common/Button';
import theme from '../style/theme';

const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.dark,
  },
  header: { color: theme.blush, padding: 20, textAlign: 'center', fontSize: 20 },
  message: {
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
    color: theme.blush,
    textAlign: 'center',
    marginBottom: 20,
  },
  url: {
    textDecorationLine: 'underline',
    textDecorationColor: theme.blush,
    textDecorationStyle: 'solid',
  },
  closeButton: {
    width: 45,
    height: 45,
    position: 'absolute',
    right: 20,
    top: 25,
    padding: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
});

const handleUrlPress = link => Linking.openURL(link);

export default function renderError(dispatch, header, message) {
  return (
    <View style={styles.container}>
      <Text style={styles.header} bold>
        {header}
      </Text>
      <ParsedText
        style={styles.message}
        parse={[{ type: 'url', style: styles.url, onPress: handleUrlPress }]}
      >
        {message}
      </ParsedText>

      <Button style={styles.closeButton} onPress={() => dispatch({ type: RESET_ERROR_MESSAGE })}>
        <Icon name="close" size={24} />
      </Button>
    </View>
  );
}
