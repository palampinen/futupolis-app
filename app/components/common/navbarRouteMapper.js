/*eslint-disable react/display-name*/
/*react-eslint misfires for jsx-returning functions*/

/**
 * Navigation Bar for IOS
 * Used with Navigator
 * https://github.com/facebook/react-native/blob/master/Examples/UIExplorer/Navigator/NavigationBarSample.js
 */

'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  ActionSheetIOS,
  Platform,
  Image,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import Text from '../Text';
import theme from '../../style/theme';
import ViewSelector from '../header/ViewSelector';
import Icon from 'react-native-vector-icons/Ionicons';
import Tabs from '../../constants/Tabs';

let showShareActionSheet = function(url) {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showShareActionSheetWithOptions(
      {
        url: url,
      },
      error => {
        /* */
      },
      (success, method) => {
        /* */
      }
    );
  }
};

let NavigationBarRouteMapper = props => ({
  LeftButton: function(route, navigator, index, navState) {
    if (index > 0) {
      return (
        <TouchableHighlight
          underlayColor={'transparent'}
          onPress={() => {
            navigator.pop();
          }}
        >
          <Icon name="ios-arrow-back" style={styles.navBarIcon} />
        </TouchableHighlight>
      );
    }

    return null;
  },

  RightButton: function(route, navigator, index, navState) {
    if (props.currentTab === Tabs.FEED && index === 0) {
      return <ViewSelector />;
    }

    return null;
  },

  Title: function(route, navigator, index, navState) {
    if (route.showName) {
      return <Text style={styles.navBarTitle}>{route.name}</Text>;
    }
    return (
      <View style={styles.navBarLogoWrap}>
        <Image
          resizeMode={'contain'}
          source={require('../../../assets/futupolis/futupolis-neon.png')}
          style={styles.navBarLogo}
        />
      </View>
    );
  },
});

var styles = StyleSheet.create({
  navBarLogoWrap: {
    flex: 1,
    alignItems: 'center',
  },
  navBarButton: {
    color: theme.orange,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  navBarIcon: {
    color: theme.orange,
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 28,
    textAlign: 'center',
  },
  navBarLogo: {
    top: 8,
    width: 162,
    height: 30,
  },
  navBarTitle: {
    fontWeight: 'normal',
    padding: 10,
    top: 2,
    fontSize: 17,
    color: theme.orange,
    textAlign: 'center',
  },
});

export default NavigationBarRouteMapper;
