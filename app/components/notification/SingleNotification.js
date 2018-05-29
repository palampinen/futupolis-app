'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  View,
  Platform,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  TouchableHighlight,
  Image,
} from 'react-native';
import moment from 'moment';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ParallaxView from 'react-native-parallax-view';
import ParsedText from 'react-native-parsed-text';

import theme from '../../style/theme';
import Toolbar from '../calendar/EventDetailToolbar';
import Text from '../Text';

import PlatformTouchable from '../common/PlatformTouchable';
const IOS = Platform.OS === 'ios';
const { width } = Dimensions.get('window');
const placholderImage = require('../../../assets/futupolis/face-fade.gif');

const VIEW_NAME = 'EventDetail';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.dark,
  },
  content: {
    padding: 20,
    backgroundColor: theme.dark,
    flex: 1,
    minHeight: 200,
  },

  detailEventDescription: {
    color: theme.white,
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 26,
    marginTop: 0,
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
  },
  header: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    elevation: 2,
    paddingBottom: 10,
  },
  title: {
    fontSize: 25,
    lineHeight: 29,
    fontWeight: 'bold',
    textAlign: 'left',
    color: theme.light,
  },
  subTitle: {
    fontSize: 15,
    lineHeight: 18,
    textAlign: 'left',
    color: theme.blush,
  },
  buttonText: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.accent,
    backgroundColor: 'transparent',
    fontWeight: 'bold',
  },
  icon: {
    textAlign: 'center',
    color: theme.accent,
  },
  gridListItemImgColorLayer: {
    flex: 1,
  },
  url: {
    color: theme.blush,
  }
});

const formatNotificationTime = (ISODate) => {
  const today = moment();
  const date = moment(ISODate);

  let format = 'ddd DD.MM. HH:mm';
  if (today.isSame(date, 'day')) {
    format = 'HH:mm';
  }

  return date.format(format);
}

class NotificationDetail extends Component {
  propTypes: {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  render() {
    const model = this.props.notification;
    const coverImage = model.get('picture');
    return (
      <View style={styles.wrapper}>
        {!IOS ? <Toolbar title={''} navigator={this.props.navigator} /> : null}

        <ParallaxView
          backgroundSource={coverImage ? { uri: coverImage } : placholderImage}
          windowHeight={300}
          style={{ backgroundColor: theme.dark }}
          header={
            <View style={{ flex: 1, elevation: 3 }}>
              <LinearGradient
                locations={[0, 0.6, 0.9]}
                colors={['transparent', 'rgba(0,0,0,.15)', 'rgba(0,0,0,.5)']}
                style={styles.gridListItemImgColorLayer}
              >
                <View style={styles.header}>
                  <Text style={styles.title}>{model.get('title')}</Text>
                  <Text style={styles.subTitle}>
                    {formatNotificationTime(model.get('timestamp'))}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          }
        >
          <View style={styles.content}>
            <ParsedText
              style={styles.detailEventDescription}
              parse={[{ type: 'url', style: styles.url, onPress: url => Linking.openURL(url) }]}
            >
              {model.get('message')}
            </ParsedText>
          </View>
        </ParallaxView>
      </View>
    );
  }
}

export default NotificationDetail;
