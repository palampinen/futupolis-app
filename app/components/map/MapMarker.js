import React, { Component } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

import RingLight from '../RingLight';
import theme from '../../style/theme';

class Marker extends Component {
  constructor(props) {
    super(props);
    this.state = { initialRender: true };
  }

  render() {
    const {
      isSelectedMarker,
      selectedMarker,
      markersCount,
      location,
      isMarkerIcon,
      index,
      markerSource,
      onPress,
    } = this.props;

    const ImageComponent = isSelectedMarker && !isMarkerIcon ? RingLight : Image;

    return (
      <MapView.Marker.Animated
        centerOffset={{ x: 0, y: 0 }}
        anchor={{ x: 0.5, y: 0.5 }}
        key={location.id}
        coordinate={location.location}
        onPress={onPress}
        style={
          isSelectedMarker
            ? { zIndex: 999, opacity: 1 }
            : { zIndex: parseInt(markersCount - index), opacity: !!selectedMarker ? 0.6 : 1 }
        }
      >
        <View style={isMarkerIcon ? styles.iconMarker : styles.avatarMarker}>
          <ImageComponent
            style={isMarkerIcon ? styles.iconMarkerImage : styles.avatarMarkerImage}
            source={markerSource}
            width={isMarkerIcon ? 20 : 24}
            height={isMarkerIcon ? 20 : 24}
            onLoad={() => this.forceUpdate()}
            onLayout={() => this.setState({ initialRender: false })}
          />
        </View>
      </MapView.Marker.Animated>
    );
  }
}

const styles = StyleSheet.create({
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
});

export default Marker;
