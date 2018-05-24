'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Linking,
  Image,
  Text,
  FlatList,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import analytics from '../../services/analytics';
import EventDetail from '../calendar/EventDetailView';
import Loader from '../common/Loader';
import PlatformTouchable from '../common/PlatformTouchable';
import time from '../../utils/time';
import theme from '../../style/theme';
import MARKER_IMAGES, { ICONS } from '../../constants/MarkerImages';
// import MAP_STYLE from '../../constants/MapStyle';
import permissions from '../../services/android-permissions';

import {
  mapViewData,
  fetchMarkers,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
} from '../../concepts/map';

const disableMap = false;
const CITY_COORDS = {
  tampere: {
    latitude: 61.4931758,
    longitude: 23.7602363,
  },
  otaniemi: {
    latitude: 60.1841396,
    longitude: 24.827895,
  },
  prague: {
    latitude: 50.093277,
    longitude: 14.4376183,
  },
};
const { width, height } = Dimensions.get('window');

const IOS = Platform.OS === 'ios';
const VIEW_NAME = 'EventMap';

class EventMap extends Component {
  componentDidMount() {
    this.props.fetchMarkers();
    analytics.viewOpened(VIEW_NAME);
  }

  componentWillReceiveProps(nextProps) {
    const { currentCity } = this.props;
    if (currentCity && currentCity !== nextProps.currentCity) {
      const cityCoords = this.getCityCoords(nextProps.currentCity);
      this.map.animateToCoordinate(cityCoords, 1);
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
    const deltaSettings = {
      latitudeDelta: 0.075,
      longitudeDelta: 0.075,
    };
    const cityCoords = this.getCityCoords(city);
    return Object.assign(deltaSettings, cityCoords);
  }

  @autobind
  getCityCoords(city) {
    return CITY_COORDS.prague;
  }

  @autobind
  onLocatePress() {
    if (IOS) {
      this.props.toggleLocateMe();
    } else {
      permissions.requestLocationPermission(this.props.toggleLocateMe);
    }
  }

  renderDisabledMapAnnouncement(event) {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIconWrap}>
          <MDIcon name="nature-people" style={styles.emptyIcon} />
        </View>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyTitle}>Oh noes!</Text>
          <Text style={styles.emptyText}>
            Event Map is not currently supported on your device. Be safe out there.
          </Text>
        </View>
      </View>
    );
  }

  renderEventMarker(event) {
    return (
      <MapView.Callout
        onPress={() => this.onEventMarkerPress(event)}
        style={{ flex: 1, position: 'relative' }}
      >
        <TouchableHighlight underlayColor="transparent" style={styles.calloutTouchable}>
          <View style={styles.callout}>
            <View>
              <View style={styles.calloutTitleWrap}>
                <Text style={styles.calloutTitle}>{event.name}</Text>
                <Icon style={styles.calloutIcon} name="ios-arrow-forward" />
              </View>
              <Text style={[styles.calloutInfo, { color: '#aaa', marginBottom: 10 }]}>
                {time.getEventDay(event.startTime)}
              </Text>
              <Text style={styles.calloutInfo}>{event.locationName}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </MapView.Callout>
    );
  }

  renderStaticMarker(location) {
    let calloutProps = {};
    if (location.url) {
      calloutProps = {
        onPress: () => Linking.openURL(location.url),
      };
    }

    return (
      <MapView.Callout {...calloutProps} style={{ flex: 1, position: 'relative' }}>
        <TouchableHighlight underlayColor="transparent" style={styles.calloutTouchable}>
          <View style={styles.callout}>
            {location.url
              ? this.renderStaticUrlMarkerView(location)
              : this.renderStaticMarkerView(location)}
          </View>
        </TouchableHighlight>
      </MapView.Callout>
    );
  }

  renderCustomCallout(location) {
    if (!location) {
      return null;
    }

    let calloutProps = {};
    if (location && location.get('url')) {
      calloutProps = {
        onPress: () => Linking.openURL(location.get('url')),
      };
    }

    return (
      <View style={styles.customCallout}>
        <TouchableHighlight
          underlayColor="transparent"
          style={styles.calloutTouchable}
          {...calloutProps}
        >
          <View style={styles.callout}>
            <View style={styles.calloutImageWrap}>
              {location.get('imageUrl', location.get('image_url')) ? (
                <Image
                  style={styles.calloutImage}
                  source={{ uri: location.get('imageUrl', location.get('image_url')) }}
                />
              ) : (
                <MDIcon
                  style={styles.calloutImageIcon}
                  name={_.get(ICONS, location.get('type'), ICONS.DEFAULT)}
                />
              )}
            </View>
            {location && location.get('url')
              ? this.renderStaticUrlMarkerView(location)
              : this.renderStaticMarkerView(location)}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  renderStaticUrlMarkerView(location) {
    return (
      <View style={styles.calloutContent}>
        <Text style={styles.calloutTitle}>{location.get('title')}</Text>

        <ScrollView>
          <Text style={styles.calloutInfo}>{location.get('subtitle')}</Text>
        </ScrollView>
      </View>
    );
  }

  renderStaticMarkerView(location) {
    return (
      <View style={styles.calloutContent}>
        <View style={styles.calloutTitleWrap}>
          <Text style={styles.calloutTitle}>{!!location && location.get('title')}</Text>
        </View>

        <ScrollView>
          <Text style={styles.calloutInfo}>{!!location && location.get('subtitle')}</Text>
        </ScrollView>
      </View>
    );
  }

  renderFilterSelection() {
    const availableFilters = [{ id: '24H', title: 'SOON' }, { id: 'ALL', title: 'ALL' }];
    return (
      <View style={styles.filterSelection}>
        {availableFilters.map(filter => {
          return this.renderFilterSelectionButton(filter);
        })}
      </View>
    );
  }

  renderFilterSelectionButton(item) {
    return (
      <View key={item.id}>
        <TouchableOpacity
          onPress={this.changeShowFilter.bind(this, item.id)}
          style={styles.filterSelectionButton}
        >
          <Text
            style={[
              styles.filterSelectionButtonText,
              { color: this.props.showFilter === item.id ? theme.blue2 : '#999' },
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderLocateMe() {
    return (
      <View style={styles.locateButton}>
        <TouchableOpacity onPress={this.onLocatePress} style={styles.locateButtonText}>
          <MDIcon
            size={20}
            style={{ color: this.props.locateMe ? theme.blue2 : '#999' }}
            name="navigation"
          />
        </TouchableOpacity>
      </View>
    );
  }

  changeShowFilter(filterName) {
    this.props.updateShowFilter(filterName);
  }

  maybeRenderLoading() {
    if (this.props.loading) {
      return (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      );
    }

    return false;
  }

  @autobind
  onSelectMarker(marker) {
    const { selectMarker } = this.props;

    selectMarker(marker);
    this.map.animateToCoordinate(marker.location);
  }

  @autobind
  onCategorySelect(category) {
    const { categories, visiblemarkerCoords } = this.props;
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

    this.props.selectCategory(category).then(this.fitMarkersToMap);
  }

  @autobind
  fitMarkersToMap() {
    const { visiblemarkerCoords } = this.props;
    if (this.map && visiblemarkerCoords && visiblemarkerCoords.length) {
      const padding = visiblemarkerCoords.length <= 2 ? 60 : 30;
      const edgePadding = { top: padding, bottom: padding, left: padding, right: padding };
      this.map.fitToCoordinates(visiblemarkerCoords, { edgePadding }, false);
    }
  }

  @autobind
  renderMarkerFilterButton({ item }) {
    const { selectedCategory, selectCategory } = this.props;
    return (
      <PlatformTouchable key={item} onPress={() => this.onCategorySelect(item)}>
        <View
          style={[styles.markerFilterButton, item === selectedCategory ? styles.activeButton : {}]}
        >
          <Text style={styles.markerFilterButtonText}>{item}</Text>
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

  getMarker(marker, selectedMarker) {
    if (marker && marker.type === 'HOTEL') {
      return MARKER_IMAGES['HOME'];
    }
    if (marker && marker.type === 'SUMMER PARTY') {
      return MARKER_IMAGES['FUTUCAMP'];
    }
    if (marker && marker.type === 'FUTUCAMP') {
      return MARKER_IMAGES['FUTUCAMP'];
    }
    return MARKER_IMAGES[
      selectedMarker && marker.title === selectedMarker.get('title') ? 'SELECTED' : 'DEFAULT'
    ];
  }

  render() {
    const { mapMarkers, firstFutureEvent, selectedMarker } = this.props;
    const markersJS = mapMarkers.toJS();

    const markers = markersJS.map((location, i) => {
      return (
        <MapView.Marker
          centerOffset={{ x: 0, y: 0 }}
          anchor={{ x: 0.5, y: 0.5 }}
          image={this.getMarker(location, selectedMarker)}
          key={i}
          coordinate={location.location}
          onPress={() => this.onSelectMarker(location)}
          style={
            selectedMarker && location.title === selectedMarker.get('title') ? { zIndex: 1 } : null
          }
        >
          {/*
          location.type === 'EVENT'
            ? this.renderEventMarker(location)
            : this.renderStaticMarker(location)
        */}
        </MapView.Marker>
      );
    });

    if (disableMap) {
      return this.renderDisabledMapAnnouncement(firstFutureEvent);
    }

    const initialRegion = this.getCityRegion();

    return (
      <View style={{ flex: 1 }}>
        {this.renderMarkerFilter()}
        <View style={styles.mapWrap}>
          <MapView
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
            // customMapStyle={MAP_STYLE} // TODO IOS Support
            // https://github.com/airbnb/react-native-maps#customizing-the-map-style
            // provider={PROVIDER_GOOGLE}
          >
            {markers}
          </MapView>

          {this.maybeRenderLoading()}

          {/* this.renderFilterSelection() */}
          {this.renderCustomCallout(selectedMarker)}
          {this.renderLocateMe()}
        </View>
      </View>
    );
  }
}

EventMap.propTypes = {
  navigator: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  markers: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapWrap: {
    flexGrow: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  customCallout: {
    width: width - 20,
    position: 'absolute',
    left: 10,
    bottom: IOS ? 58 : 10,
    height: height / 4.3,
    backgroundColor: theme.white,
    borderRadius: 3,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  callout: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  calloutTouchable: {
    padding: 0,
    // flex: 1,
    flexGrow: 1,
  },
  calloutImageWrap: {
    width: 120,
    height: height / 4,
    backgroundColor: theme.yellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutImageIcon: {
    fontSize: 50,
    color: theme.blue1,
  },
  calloutImage: {
    width: 120,
    height: height / 4,
    backgroundColor: theme.yellow,
  },
  calloutContent: {
    flex: 1,
    padding: 15,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  calloutTitleWrap: {
    // flex: 1,
    flexDirection: 'row',
  },
  calloutTitle: {
    fontWeight: '500',
    color: theme.dark,
    fontSize: 14,
    paddingBottom: 8,
  },
  calloutInfo: {
    fontSize: 12,
    color: '#888',
    backgroundColor: theme.transparent,
  },
  calloutIcon: {
    top: IOS ? 0 : 2,
    fontSize: 14,
    color: theme.primary,
  },
  filterSelection: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,.9)',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },

    top: 12,
    left: 12,
    borderRadius: 3,
    height: 40,
    width: 110,
  },
  filterSelectionButton: {
    padding: 10,
    paddingLeft: 12,
    paddingRight: 12,
  },
  filterSelectionButtonText: {
    fontWeight: 'bold',
    fontSize: 11,
    color: '#aaa',
  },
  locateButton: {
    backgroundColor: 'rgba(255,255,255,.99)',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    elevation: 2,
    borderRadius: IOS ? 2 : 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40,
  },
  locateButtonText: {
    backgroundColor: 'transparent',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: IOS ? 5 : 0,
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
  markerFilterButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.dark,
  },
  markerFilterIcon: {
    color: theme.grey2,
    fontSize: 28,
  },
});

const mapDispatchToProps = {
  fetchMarkers,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
};

export default connect(mapViewData, mapDispatchToProps)(EventMap);
