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
  detailEventImg: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  content: {
    padding: 20,
    backgroundColor: theme.dark,
    flex: 1,
    minHeight: 200,
  },
  detailEventInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 15,
    paddingBottom: 0,
    backgroundColor: theme.dark,
  },
  detailEventInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  detailEventInfoIcon: {
    fontSize: 25,
    color: theme.blush,
    marginTop: 1,
    paddingRight: 23,
    marginLeft: 7,
    alignSelf: 'center',
  },
  detailEventInfoAttending: {
    top: -2,
    fontSize: 15,
    color: theme.darkgrey,
    alignSelf: 'center',
  },
  detailEventInfoTime: {
    color: '#000',
    fontSize: 15,
    alignSelf: 'center',
  },
  detailEventName: {
    backgroundColor: theme.dark,
    textAlign: 'left',
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 25,
  },
  detailEventDescription: {
    color: theme.white,
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 0,
  },

  navigationButtonWrapper: {
    margin: 0,
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: theme.dark,
  },
  navigationButton: {
    height: 50,
    backgroundColor: '#E9E9E9',
    borderColor: '#C7C7C7',
    borderWidth: 10,
    borderRadius: 2,
  },
  navigationButtonText: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 35,
    fontWeight: 'bold',
    color: '#8A8A8A',
    margin: 0,
    padding: 0,
  },
  navigationButtonIcon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 15,
    top: 10,
  },
  eventContent: {
    paddingTop: 10,
    backgroundColor: theme.dark,
  },
  gridListItemMetaWrap: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.dark,
  },
  gridListItemMeta: {
    backgroundColor: theme.dark,
    borderBottomWidth: 0,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  gridListItemIcon: {
    color: theme.blush,
    fontSize: 24,
    top: 2,
  },
  gridListItemIconImage: {
    tintColor: theme.blush,
    width: 26,
    height: 26,
    top: 2,
  },
  gridListItemMeta__block: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  gridListItemMetaInfo__title: {
    color: theme.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  gridListItemMetaInfo: {
    color: theme.white,
    opacity: 0.9,
  },
  gridListItemPlace: {
    color: theme.white,
    opacity: 0.9,
  },
  gridListItemDistance: {
    color: '#000',
    textAlign: 'right',
    fontSize: 15,
  },
  gridListItemLeftIcon: {
    width: 40,
    paddingRight: 15,
    color: theme.secondary,
    fontSize: 15,
  },
  gridListItemLeftImage: {
    width: 40,
    paddingRight: 15,
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
    //position: 'absolute',
    //left: 0, top: 0, bottom: 0, right: 0,
    flex: 1,
  },
  imageContainer: {
    margin: 2,
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  imageTitle: {
    textAlign: 'left',
    color: theme.midgrey,
    margin: 20,
    marginTop: 15,
    marginBottom: 7,
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '600',
  },
  imageTitleWrap: {
    borderTopWidth: 0,
    borderTopColor: '#eee',
    flex: 1,
    marginTop: 5,
  },
  checkInButton: {
    position: 'absolute',
    right: 20,
    justifyContent: 'center',
    top: IOS ? -51 : 70,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    zIndex: 99,
    borderRadius: 40,
    padding: 10,
    width: 80,
    height: 80,
    backgroundColor: theme.secondary,
  },
});

class NotificationDetail extends Component {
  propTypes: {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPressBack = this.onPressBack.bind(this);
  }

  onPressBack() {
    this.props.navigator.pop();
  }

  render() {
    const { model } = this.props.route;
    const wrapperStyleAdd = {
      paddingTop: 0,
    };

    const coverImage = model.get('picture');

    return (
      <View style={[styles.wrapper, wrapperStyleAdd]}>
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
                    {moment(model.get('timestamp')).format('ddd DD.MM. HH:mm')}
                  </Text>
                </View>
              </LinearGradient>
            </View>
          }
        >
          <View style={styles.content}>
            <Text style={styles.detailEventDescription}>{model.get('message')}</Text>
          </View>
        </ParallaxView>
      </View>
    );
  }
}

export default NotificationDetail;
