'use strict';

import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { fromJS } from 'immutable';

import Text from '../Text';
import { get, random, isEmpty } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import analytics from '../../services/analytics';

import HotelInfoPage from '../../containers/HotelInfoPage';
import SummerVenuePage from '../../containers/SummerVenuePage';
import DayVenuePage from '../../containers/DayVenuePage';

import CommentsView from '../comment/CommentsView';
import PlatformTouchable from '../common/PlatformTouchable';
import time from '../../utils/time';
import theme from '../../style/theme';
import MARKER_IMAGES, { ICONS } from '../../constants/MarkerImages';
import MAP_STYLE from '../../constants/MapStyle';
import permissions from '../../services/android-permissions';
import location from '../../services/location';
import PostCallout from './Callout/Post';
import CityCallout from './Callout/City';
import LocateButton from './LocateButton';
import AnimateMe from '../AnimateMe';
import RingLight from '../RingLight';
// import MapMarker from './MapMarker';

import { CITY_CATEGORIES, BERLIN } from '../../constants/Cities';

import {
  mapViewData,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
  fetchMapPosts,
} from '../../concepts/user-map';

import { showFeedView } from '../../concepts/feed-view-type';
import { openComments } from '../../concepts/comments';
import { openLightBox } from '../../concepts/lightbox';

const { width, height } = Dimensions.get('window');

// BERLIN FTW
const defaultStartLocation = CITY_CATEGORIES[BERLIN];

const IOS = Platform.OS === 'ios';
const calloutHeight = IOS ? 140 : 140;
const VIEW_NAME = 'UserMap';

class UserMap extends Component {
  constructor(props) {
    super(props);

    this.state = { calloutAnimation: new Animated.Value(0) };
  }

  @autobind
  openPostComments(postId) {
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comments', showName: true });
  }

  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);

    // load for selected city and fit markers
    // this.props
    //   .fetchMapPosts()
    //   // Need to setTimeout for initial fitMarkerToMap for Android issue
    //   //
    //   // https://github.com/airbnb/react-native-maps/issues/1003
    //   .then(() => setTimeout(this.fitMarkersToMap, IOS ? 0 : 500));

    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMarker, selectedCategory, locateMe } = this.props;

    // Animate map when city is changed
    if (selectedCategory && selectedCategory !== nextProps.selectedCategory) {
      const cityCoords = this.getCityCoords(nextProps.selectedCategory);
      if (cityCoords && !isEmpty(cityCoords)) {
        this.map.animateToCoordinate(cityCoords, 1);
      }
    }

    // Custom callout animation
    if (!selectedMarker && nextProps.selectedMarker) {
      this.animateCallout(true);
      this.map.animateToCoordinate(nextProps.selectedMarker.toJS().location, 500);
    } else if (selectedMarker && !nextProps.selectedMarker) {
      this.animateCallout(false);
    }

    // User zoom when locateMe is turned on
    if (locateMe !== nextProps.locateMe && nextProps.locateMe && nextProps.userLocation) {
      // HOX userlocation not immutable
      this.map.animateToCoordinate(nextProps.userLocation, 400);
    }
  }

  @autobind
  handleBack() {
    if (!this.props) {
      return false;
    }

    // # on child route
    const routes = this.props.navigator ? this.props.navigator.getCurrentRoutes() : null;
    if (routes && routes.length > 1) {
      this.props.navigator.pop();
      return true;
    }

    // # selected marker
    if (this.props.selectedMarker) {
      this.onClosemarker();
      return true;
    }

    // # just go back to feed view
    if (this.props.isShowingMap) {
      this.props.showFeedView();
      return true;
    }

    return false;
  }

  getCityRegion(city) {
    let cityCoords = this.getCityCoords(city);
    let zoomLevel = 0.025;

    if (!cityCoords || isEmpty(cityCoords)) {
      cityCoords = defaultStartLocation;
      zoomLevel = 0.125;
    }

    const deltaSettings = {
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    };

    return Object.assign(deltaSettings, cityCoords);
  }

  @autobind
  getCityCoords(city) {
    const currentCityLocation = this.props.markerLocations.getIn([city, 'location']);
    return currentCityLocation ? currentCityLocation.toJS() : {};
  }

  @autobind
  onLocatePress() {
    if (IOS) {
      this.props.toggleLocateMe();
    } else {
      permissions.requestLocationPermission(this.props.toggleLocateMe);
    }
  }

  @autobind
  animateCallout(show) {
    Animated.timing(this.state.calloutAnimation, { toValue: show ? 1 : 0, duration: 300 }).start();
  }

  renderCloseLayer(location) {
    if (!location) {
      return null;
    }

    return (
      <View style={styles.customCalloutCloseLayer}>
        <TouchableWithoutFeedback delayPressIn={0} onPress={this.onClosemarker}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
      </View>
    );
  }

  @autobind
  navigateToDetailPage(type) {
    let destinationPage;
    let title;

    if (type === 'HOME') {
      destinationPage = HotelInfoPage;
      title = 'Hotel info';
    } else if (type === 'FUTUCAMP') {
      destinationPage = DayVenuePage;
      title = 'Venue info';
    } else if (type === 'SUMMER') {
      destinationPage = SummerVenuePage;
      title = 'Venue info';
    }

    if (destinationPage) {
      this.props.navigator.push({ component: destinationPage, name: title, showName: true });
    }
  }

  @autobind
  renderCustomCallout(location) {
    let calloutProps = {};
    // if (location && location.get('url')) {
    //   calloutProps = {
    //     onPress: () => Linking.openURL(location.get('url'))
    //   }
    // }

    const calloutAnimationStyles = {
      opacity: this.state.calloutAnimation,
      top: this.state.calloutAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [calloutHeight, 0],
      }),
      height: this.state.calloutAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, calloutHeight],
      }),
    };

    return (
      <Animated.View style={[styles.customCallout, calloutAnimationStyles]}>
        {location && (
          <TouchableHighlight
            underlayColor="transparent"
            style={styles.calloutTouchable}
            {...calloutProps}
          >
            <View style={styles.callout}>
              {location && this.props.categories.indexOf(location.get('type')) >= 0 ? (
                <CityCallout
                  item={location}
                  onImagePress={() => this.navigateToDetailPage(location.get('type'))}
                />
              ) : (
                <PostCallout
                  onImagePress={() => this.props.openLightBox(location.get('id'))}
                  openComments={this.openPostComments}
                  item={location}
                />
              )}
            </View>
          </TouchableHighlight>
        )}
      </Animated.View>
    );
  }

  @autobind
  onSelectMarker(marker) {
    this.props.selectMarker(marker.id, marker.type);
    // this.map.animateToCoordinate(marker.location);
  }

  @autobind
  onClosemarker() {
    this.props.selectMarker(null);
  }

  @autobind
  onCategorySelect(category) {
    const { categories } = this.props;
    const index = categories.findIndex(c => c === category);

    const total = categories.size;

    // TODO Find correct scrollTo position
    //  If clicked item is not completely visible, scroll view to make it visible
    //  Last item gives an error regarding to getItemLayout,
    //  using scrollToEnd for last index works correctly
    if (total > index + 1) {
      this.categoryScroll.scrollToIndex({ viewPosition: 0.5, index });
    } else {
      this.categoryScroll.scrollToEnd();
    }

    // Action for category selec
    this.props.selectCategory(category).then(this.fitMarkersToMap);
  }

  @autobind
  fitMarkersToMap() {
    // const { visiblemarkerCoords } = this.props;
    // if (this.map && visiblemarkerCoords && visiblemarkerCoords.length > 1) {
    //   const padding = visiblemarkerCoords.length <= 2 ? 100 : 80;
    //   const edgePadding = { top: padding, bottom: padding, left: padding, right: padding };
    //   this.map.fitToCoordinates(visiblemarkerCoords, { edgePadding }, false);
    // }
  }

  @autobind
  renderMarkerFilterButton({ item }) {
    const { selectedCategory } = this.props;
    return (
      <PlatformTouchable key={item} onPress={() => this.onCategorySelect(item)}>
        <View
          style={[styles.markerFilterButton, item === selectedCategory ? styles.activeButton : {}]}
        >
          <Text
            style={[
              styles.markerFilterButtonText,
              item === selectedCategory ? styles.activeButtonText : {},
            ]}
          >
            {item}
          </Text>
        </View>
      </PlatformTouchable>
    );
  }

  renderMarkerFilter() {
    const { categories } = this.props;
    const keyExtractor = (item, index) => item;
    return (
      <View style={styles.markerNavigation}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.markerNavigationScroll}
          ref={ref => (this.categoryScroll = ref)}
          renderItem={this.renderMarkerFilterButton}
          keyExtractor={keyExtractor}
          data={categories.toJS()}
        />
      </View>
    );
  }

  getMarker(marker) {
    if (this.isMarkerIcon(marker)) {
      return MARKER_IMAGES[marker.type];
    }

    return { uri: get(marker, ['author', 'profilePicture']) };
  }

  @autobind
  isMarkerIcon(marker) {
    return marker && this.props.categories.indexOf(marker.type) >= 0;
  }

  render() {
    const { mapMarkers, markerLocations, selectedMarker, selectedCategory, isMapOpen } = this.props;
    const markersJS = mapMarkers.toJS();

    const markers = markersJS.map((location, index) => {
      const isSelectedMarker = selectedMarker && location.id === selectedMarker.get('id');
      const isMarkerIcon = this.isMarkerIcon(location);

      /*
      return (
        <MapMarker
          isSelectedMarker={isSelectedMarker}
          isMarkerIcon={isMarkerIcon}
          selectedMarker={selectedMarker}
          location={location}
          index={index}
          markersCount={markersJS.length}
          markerSource={this.getMarker(location)}
          onPress={() => this.onSelectMarker(location)}
        />
      );
      */

      const ImageComponent = isSelectedMarker && !isMarkerIcon ? RingLight : Image;

      return (
        <MapView.Marker
          centerOffset={{ x: 0, y: 0 }}
          anchor={{ x: 0.5, y: 0.5 }}
          key={location.id}
          coordinate={location.location}
          onPress={() => this.onSelectMarker(location)}
          style={
            isSelectedMarker
              ? { zIndex: 999, opacity: 1 }
              : { zIndex: parseInt(markersJS.length - index), opacity: !!selectedMarker ? 0.7 : 1 }
          }
        >
          <View style={isMarkerIcon ? styles.iconMarker : styles.avatarMarker}>
            <ImageComponent
              style={[
                isMarkerIcon ? styles.iconMarkerImage : styles.avatarMarkerImage,
                !isMarkerIcon && isSelectedMarker && styles.selectedAvatarMarkerImage,
              ]}
              source={this.getMarker(location)}
              width={isMarkerIcon ? 20 : 28}
              height={isMarkerIcon ? 20 : 28}
              resizeMode="cover"
            />
          </View>
        </MapView.Marker>
      );
    });

    const initialRegion = this.getCityRegion(selectedCategory);
    const areCategoriesReady = true;

    return (
      <View style={{ flex: 1 }}>
        {/* this.renderMarkerFilter() */}
        <View style={styles.mapWrap} delay={400} animationType="fade-in">
          <View style={{ flex: 1 }}>
            {markersJS.map((location, index) => (
              <Image
                source={this.getMarker(location)}
                style={{ width: 0, height: 0, opacity: 0 }}
                onLoad={() => this.forceUpdate()}
              />
            ))}

            {!!selectedCategory && (
              <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={this.props.locateMe}
                showsPointsOfInterest={true}
                showsBuildings={true}
                showsIndoors={false}
                rotateEnabled={false}
                toolbarEnabled={false}
                ref={map => {
                  this.map = map;
                }}
                customMapStyle={MAP_STYLE}
                provider={PROVIDER_GOOGLE}
              >
                {markers}
              </MapView>
            )}
          </View>
          {isMapOpen && (
            <LocateButton onPress={this.onLocatePress} isLocating={this.props.locateMe} />
          )}
          {this.renderCustomCallout(selectedMarker)}
          {/* !selectedMarker && <MapTimeSelector /> */}
          {IOS && this.renderCloseLayer(selectedMarker)}
        </View>
      </View>
    );
  }
}

UserMap.propTypes = {
  navigator: PropTypes.object.isRequired,
  markers: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    backgroundColor: theme.dark,
  },
  mapWrap: {
    flexGrow: 1,
  },
  map: {
    backgroundColor: theme.dark,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconMarker: {
    width: 20,
    height: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMarkerImage: {
    width: 20,
    height: 20,
  },
  avatarMarker: {
    width: 30,
    height: 30,
    borderRadius: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.transparent,

    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  avatarMarkerImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: theme.white,
  },
  selectedAvatarMarkerImage: {
    width: 26,
    height: 26,
    borderWidth: 0,
    borderColor: theme.white,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  customCalloutCloseLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  customCallout: {
    zIndex: 10,
    overflow: 'visible',
    width: width,
    position: 'relative',
    left: 0,
    bottom: 0,
    height: calloutHeight,
    backgroundColor: theme.transparent,
  },
  callout: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
  },
  calloutTouchable: {
    padding: 0,
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD',
  },
  emptyIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    color: '#bbb',
    fontSize: 100,
  },
  emptyContent: {
    paddingTop: 10,
    paddingBottom: 15,
    padding: 50,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 30,
    textAlign: 'center',
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
  },

  markerNavigation: {
    height: 52,
    zIndex: 10,
    justifyContent: 'flex-start',
    backgroundColor: theme.white,
    elevation: 2,
  },
  markerNavigationScroll: {
    flex: 1,
  },
  markerFilter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'stretch',
    height: 52,
  },
  markerFilterButton: {
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 4,
    borderBottomWidth: 2,
    borderBottomColor: theme.white,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: theme.blue2,
  },
  activeButtonText: {
    color: theme.blue2,
  },
  markerFilterButtonText: {
    paddingTop: 2,
    fontSize: 13,
    fontWeight: IOS ? 'bold' : 'normal',
    fontFamily: IOS ? 'Futurice' : 'Futurice_bold',
    color: theme.midgrey,
  },
  markerFilterIcon: {
    color: theme.grey2,
    fontSize: 28,
  },
});

const mapDispatchToProps = {
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
  openComments,
  openLightBox,
  fetchMapPosts,
  showFeedView,
};

export default connect(
  mapViewData,
  mapDispatchToProps
)(UserMap);
