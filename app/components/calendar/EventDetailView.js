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
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ParallaxView from 'react-native-parallax-view';

import theme from '../../style/theme';
import ScrollHeader from '../header/ScrollHeader';
import Text from '../Text';
import Notification from '../common/Notification';
import AnimateMe from '../AnimateMe';

import analytics from '../../services/analytics';
import { checkIn } from '../../actions/competition';
import time from '../../utils/time';
import locationService from '../../services/location';
import Button from '../common/Button';
import RingLightImage from '../RingLight';

import { openLightBox } from '../../actions/feed';
import { openRegistrationView } from '../../concepts/registration';

import { INACTIVE, UNAVAILABLE, AVAILABLE, CHECKED } from '../../constants/CheckInStates';

import PlatformTouchable from '../common/PlatformTouchable';
const IOS = Platform.OS === 'ios';
const { width } = Dimensions.get('window');
const placeholderSpeakerImage = require('../../../assets/futupolis/avatar-robot.png');

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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 15,
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },

  speakerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  gridListItemIcon: {
    color: theme.blush,
    fontSize: 22,
    top: 0,
  },
  gridListItemMeta__block: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  gridListItemMetaInfo__title: {
    color: theme.white,
    fontSize: 15,
    marginTop: 5,
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
    height: 40,
    borderRadius: 20,
    marginRight: 26,
    backgroundColor: theme.darker,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridListItemLeftImage: {
    width: 40,
    paddingRight: 15,
  },
  header: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 25,
    lineHeight: 27,
    textAlign: 'left',
    color: theme.light,
    elevation: 2,
    paddingBottom: 10,
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

const orangeColor = 'rgba(253,95,0,.4)';

class EventDetail extends Component {
  propTypes: {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      springAnim: new Animated.Value(0),
      checked: false,
    };

    this.onPressBack = this.onPressBack.bind(this);
  }

  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  onPressBack() {
    this.props.navigator.pop();
  }

  render() {
    const { model, currentDistance, rowId } = this.props.route;
    const wrapperStyleAdd = {
      paddingTop: 0,
    };

    const { coverImage, speakers } = model;
    const hasSpeakers = speakers && speakers.length > 0;
    const speakersCount = speakers ? speakers.length : 0;
    const eventGeoUrl = locationService.getGeoUrl(model);
    const animationDuration = 175;
    return (
      <View style={[styles.wrapper, wrapperStyleAdd]}>
        {!IOS ? (
          <ScrollHeader
            title={moment(model.startTime).format('ddd D.M.')}
            icon="arrow-back"
            onIconClick={() => this.props.navigator.pop()}
            extraStyles={{
              elevation: 0,
              backgroundColor: theme.darkLayer,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              zIndex: 2,
            }}
          />
        ) : null}

        <ParallaxView
          backgroundSource={{ uri: coverImage }}
          windowHeight={450}
          style={{ backgroundColor: theme.black, shadowOpacity: 0 }}
          header={
            <View style={{ flex: 1, elevation: 3 }}>
              <LinearGradient
                locations={[0, 0.6, 0.9]}
                colors={['transparent', 'transparent', orangeColor]}
                style={styles.gridListItemImgColorLayer}
              >
                <Text style={styles.header} bold>
                  {(model.name || '').toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
          }
        >
          <View style={styles.eventContent}>
            <View style={styles.gridListItemMetaWrap}>
              {/* # Speakers */}
              {hasSpeakers &&
                speakers.map((speaker, i) => (
                  <AnimateMe
                    style={styles.gridListItemMeta}
                    delay={(i + 1) * animationDuration}
                    animationType="fade-from-bottom"
                  >
                    <View style={styles.gridListItemMeta__block}>
                      <RingLightImage
                        source={speaker.image ? { uri: speaker.image } : placeholderSpeakerImage}
                        style={styles.speakerAvatar}
                        width={40}
                        height={40}
                      />
                    </View>

                    <View
                      style={[
                        styles.gridListItemMeta__block,
                        {
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          maxWidth: width - 100,
                        },
                      ]}
                    >
                      <Text style={styles.gridListItemMetaInfo__title} bold>
                        {speaker.name}
                      </Text>
                      <Text style={styles.gridListItemMetaInfo}>{speaker.title}</Text>
                    </View>
                  </AnimateMe>
                ))}

              {/* # Time */}
              <AnimateMe
                style={styles.gridListItemMeta}
                delay={(speakersCount + 1) * animationDuration}
                animationType="fade-from-bottom"
              >
                <View style={styles.gridListItemMeta__block}>
                  <View style={styles.gridListItemLeftIcon}>
                    <MaterialIcon style={styles.gridListItemIcon} name="access-time" />
                  </View>
                </View>

                <View style={[styles.gridListItemMeta__block, { alignItems: 'flex-start' }]}>
                  <Text style={styles.gridListItemMetaInfo__title} bold>
                    Time
                  </Text>
                  <Text style={styles.gridListItemPlace}>
                    {moment(model.startTime).format('HH:mm')} -{' '}
                    {moment(model.endTime).format('HH:mm')}
                  </Text>
                </View>
              </AnimateMe>

              {/* # Location */}
              <TouchableHighlight
                underlayColor={'#eee'}
                onPress={() =>
                  eventGeoUrl ? Linking.openURL(eventGeoUrl) : console.log('Event has no Map URL')
                }
              >
                <AnimateMe
                  style={styles.gridListItemMeta}
                  delay={(speakersCount + 2) * animationDuration}
                  animationType="fade-from-bottom"
                >
                  <View style={styles.gridListItemMeta__block}>
                    <View style={styles.gridListItemLeftIcon}>
                      <MaterialIcon style={styles.gridListItemIcon} name="location-on" />
                    </View>
                  </View>

                  <View style={[styles.gridListItemMeta__block, { alignItems: 'flex-start' }]}>
                    <Text style={styles.gridListItemMetaInfo__title} bold>
                      Location
                    </Text>
                    <Text style={styles.gridListItemPlace}>{model.locationName}</Text>
                  </View>
                </AnimateMe>
              </TouchableHighlight>

              {/*currentDistance !== '' &&
                currentDistance && (
                  <View style={styles.gridListItemMeta}>
                    <View style={styles.gridListItemMeta__block}>
                      <Text style={styles.gridListItemLeftIcon}>
                        <MaterialIcon style={styles.gridListItemIcon} name="redo" />{' '}
                      </Text>
                    </View>

                    <View style={[styles.gridListItemMeta__block, { alignItems: 'flex-start' }]}>
                      <Text style={styles.gridListItemMetaInfo__title}>Distance from you</Text>
                      <Text style={styles.gridListItemMetaInfo}>{currentDistance}</Text>
                    </View>
                  </View>
                )
              */}
            </View>

            <AnimateMe
              animationType="fade-in"
              style={styles.content}
              delay={(speakersCount + 4) * animationDuration}
            >
              <Text style={styles.detailEventDescription}>{model.description}</Text>
            </AnimateMe>

            {this.props.images.size > 0 && (
              <View>
                <View style={styles.imageTitleWrap}>
                  <Text style={styles.imageTitle}>Event images</Text>
                </View>
                <View style={styles.imageContainer}>
                  {this.props.images.map(image => {
                    if (image.get('type') === 'IMAGE') {
                      return (
                        <View key={image.get('id')}>
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.props.openLightBox(image.get('id'))}
                          >
                            <Image
                              key={image.get('id')}
                              style={{ height: width / 3 - 8, width: width / 3 - 8, margin: 3 }}
                              source={{ uri: image.get('url') }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })}
                </View>
              </View>
            )}
          </View>
        </ParallaxView>
        <Notification visible={this.props.isNotificationVisible}>
          {this.props.notificationText}
        </Notification>
      </View>
    );
  }
}

const mapDispatchToProps = { checkIn, openLightBox, openRegistrationView };

const select = store => {
  const isRegistrationInfoValid =
    store.registration.get('name') !== '' && store.registration.get('selectedTeam') > 0;

  return {
    userLocation: store.location.get('currentLocation'),
    images: store.event.get('images'),
    isRegistrationInfoValid,
    isNotificationVisible: store.competition.get('isNotificationVisible'),
    notificationText: store.competition.get('notificationText'),
  };
};

export default connect(
  select,
  mapDispatchToProps
)(EventDetail);
