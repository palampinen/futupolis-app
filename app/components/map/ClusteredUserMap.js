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
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster'
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { fromJS } from 'immutable';

import Text from '../Text';
import { get, has, random, isEmpty } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import analytics from '../../services/analytics';

import HotelInfoPage from '../../containers/HotelInfoPage';
import SummerVenuePage from '../../containers/SummerVenuePage';
import DayVenuePage from '../../containers/DayVenuePage';

import EventDetail from '../calendar/EventDetailView';
import Loader from '../common/Loader';
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

import { CITY_CATEGORIES, BERLIN } from '../../constants/Cities';

import {
  mapViewData,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
  fetchMapPosts,
} from '../../concepts/user-map';

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
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMarker, selectedCategory, locateMe } = this.props;

    // Animate map when city is changed
    if (selectedCategory && selectedCategory !== nextProps.selectedCategory) {
      const cityCoords = this.getCityCoords(nextProps.selectedCategory);
      if (cityCoords && !isEmpty(cityCoords)) {
        this.map.getMapRef().animateToCoordinate(cityCoords, 1);
      }
    }

    // Custom callout animation
    if (!selectedMarker && nextProps.selectedMarker) {
      this.animateCallout(true);
      this.map.getMapRef().animateToCoordinate(nextProps.selectedMarker.toJS().location, 500);
    } else if (selectedMarker && !nextProps.selectedMarker) {
      this.animateCallout(false);
    }

    // User zoom when locateMe is turned on
    if (locateMe !== nextProps.locateMe && nextProps.locateMe && nextProps.userLocation) {
      // HOX userlocation not immutable
      this.map.getMapRef().animateToCoordinate(nextProps.userLocation, 400);
    }
  }

  @autobind
  onEventMarkerPress(event) {
    this.props.navigator.push({
      component: EventDetail,
      name: event.name,
      model: event,
      disableTopPadding: true,
    });
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

    if (destinationPage){
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

  maybeRenderLoading() {
    if (this.props.loading) {
      return (
        <View style={styles.loaderContainer}>
          <Loader color={theme.white} />
        </View>
      );
    }

    return false;
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

  renderMarker = (location, index) => {
    const { mapMarkers, selectedMarker } = this.props;
    const isSelectedMarker = selectedMarker && location.id === selectedMarker.get('id');
    const isMarkerIcon = this.isMarkerIcon(location);
    const ImageComponent = isSelectedMarker && !isMarkerIcon ? RingLight : Image;

    if (isMarkerIcon) {
      return null;
    }

    return <MapView.Marker
          centerOffset={{ x: 0, y: 0 }}
          anchor={{ x: 0.5, y: 0.5 }}
          key={location.id}
          coordinate={location.location}
          onPress={() => this.onSelectMarker(location)}
          style={
            isSelectedMarker
              ? { zIndex: 999, opacity: 1 }
              : { zIndex: parseInt(mapMarkers.size - index), opacity: !!selectedMarker ? 0.6 : 1 }
          }
        >
          <View style={isMarkerIcon ? styles.iconMarker : styles.avatarMarker}>
            <ImageComponent
              style={isMarkerIcon ? styles.iconMarkerImage : styles.avatarMarkerImage}
              source={this.getMarker(location)}
              width={isMarkerIcon ? 18 : 24}
              height={isMarkerIcon ? 18 : 24}
            />
          </View>
        </MapView.Marker>
  }

  renderAvatarMarker = (data, index, total) => {

    if (index > 2) {
      return null;
    }

    if (index === 1) {
      return (
        <View style={{ zIndex: 998, width: 24, height: 24, borderRadius: 12, backgroundColor: theme.white, position: 'absolute', alignItems: 'center', justifyContent: 'center', left: index * 10}}>
          <Text style={{ color: theme.orange, fontSize: 11, top: 2, }} bold>+{total - 1}</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.avatarMarker,
        { zIndex: 997 - index, width: 24, height: 24, borderRadius: 12, position: 'absolute', left: index * 10 }
      ]}>
        <Image
          style={[
            styles.avatarMarkerImage,
            { width: 20, height: 20, borderRadius: 10 }
          ]}
          source={this.getMarker(data.properties.item)}
        />
      </View>
    )
  }

  renderCluster = (cluster, onPress) => {
    const { pointCount, coordinate, clusterId } = cluster;

    // use pointCount to calculate cluster size scaling
    // and apply it to "style" prop below

    // eventually get clustered points by using
    // underlying SuperCluster instance
    // Methods ref: https://github.com/mapbox/supercluster
    const clusteringEngine = this.map.getClusteringEngine();
    const clusteredPoints = clusteringEngine.getLeaves(clusterId, 100);

    const avatarPoints = clusteredPoints.filter(point => has(point, 'properties.item.author'));

    console.log(avatarPoints);

    return (
      <MapView.Marker coordinate={coordinate} onPress={onPress}>
        <View style={styles.clusterContainer}>

          {avatarPoints.map((p, i) => this.renderAvatarMarker(p, i, avatarPoints.length))}

        </View>
        {
          /*
            Eventually use <Callout /> to
            show clustered point thumbs, i.e.:
            <Callout>
              <ScrollView>
                {
                  clusteredPoints.map(p => (
                    <Image source={p.image}>
                  ))
                }
              </ScrollView>
            </Callout>

            IMPORTANT: be aware that Marker's onPress event isn't really consistent when using Callout.
           */
        }
      </MapView.Marker>
    )
  }


  render() {
    const { mapMarkers, markerLocations, selectedMarker, selectedCategory, isMapOpen } = this.props;
    const markersJS = mapMarkers.toJS();

    const markers = markersJS.map((location, index) => {
      const isSelectedMarker = selectedMarker && location.id === selectedMarker.get('id');
      const isMarkerIcon = this.isMarkerIcon(location);
      const ImageComponent = isSelectedMarker && !isMarkerIcon ? RingLight : Image;

      if (!isMarkerIcon) {
        return null;
      }

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
              : { zIndex: parseInt(markersJS.length - index), opacity: !!selectedMarker ? 0.6 : 1 }
          }
        >
          <View style={isMarkerIcon ? styles.iconMarker : styles.avatarMarker}>
            <ImageComponent
              style={isMarkerIcon ? styles.iconMarkerImage : styles.avatarMarkerImage}
              source={this.getMarker(location)}
              width={isMarkerIcon ? 18 : 24}
              height={isMarkerIcon ? 18 : 24}
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
          {!!selectedCategory &&
            <ClusteredMapView
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={this.props.locateMe}
              showsPointsOfInterest={true}
              showsBuildings={true}
              showsIndoors={false}
              rotateEnabled={false}
              ref={map => {
                this.map = map;
              }}
              customMapStyle={MAP_STYLE}
              provider={PROVIDER_GOOGLE}

              data={markersJS}
              renderMarker={this.renderMarker}
              renderCluster={this.renderCluster}
            >
              {markers}
            </ClusteredMapView>
          }
          </View>

          {this.maybeRenderLoading()}

          {isMapOpen && <LocateButton onPress={this.onLocatePress} isLocating={this.props.locateMe} />}

          {this.renderCustomCallout(selectedMarker)}
          {/* !selectedMarker && <MapTimeSelector /> */}
          {this.renderCloseLayer(selectedMarker)}
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
    flex: 1,
    backgroundColor: theme.dark,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconMarker: {
    width: 18,
    height: 18,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMarkerImage: {
    width: 18,
    height: 18,
  },
  avatarMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white,

    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  avatarMarkerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
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

  clusterContainer: {
    flex: 1,
    width: 50,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.transparent,
  },
  clusterText: {
    top: 2,
    fontSize: 13,
    color: theme.orange,
    textAlign: 'center',
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
};

export default connect(mapViewData, mapDispatchToProps)(UserMap);
