import React, { Component } from 'react';
import { isFunction } from 'lodash';
import { View, StyleSheet, Platform, TouchableNativeFeedback, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/Entypo';

import theme from '../../style/theme';

class MapLink extends Component {
  render() {
    const { onPress, item } = this.props;

    let calloutProps = {};
    if (onPress && isFunction(onPress)) {
      calloutProps = {
        onPress: () => onPress(item),
      };
    }

    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        delayPressIn={0}
        {...calloutProps}
      >
        <View style={styles.mapLink}>
          <View style={styles.mapLinkWrap}>
            <Text style={[styles.mapLinkText, styles.mapLinkIconWrap]}>
              <MDIcon style={styles.mapIcon} name={'map'} />
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  mapLink: {
    padding: 8,
    paddingHorizontal: 15,
    paddingLeft: 9,
    marginLeft: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapLinkText: {
    color: theme.inactive,
    fontSize: 15,
    top: 0,
  },
  compactText: {
    marginRight: 3,
    marginLeft: -5,
    color: theme.blush,
  },
  mapIcon: {
    fontSize: 18,
    color: theme.inactive,
  },
});

export default MapLink;
