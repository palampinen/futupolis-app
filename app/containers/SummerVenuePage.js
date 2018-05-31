import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Linking, Image, Dimensions, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { getMarkersByType } from '../reducers/marker';
import TripContent from '../components/TripContent';
import theme from '../style/theme';
import ScrollHeader from '../components/header/ScrollHeader';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark,
    paddingTop: IOS ? 30 : 10,
    paddingBottom: 50,
  },
});

const contentKeys = ['SUMMER'];

const VenueInfoPage = ({ markers, navigator, route }) => {
  const venueInfos = contentKeys.map(key => markers.get(key));

  return (
    <View style={{ flex: 1 }}>
      {!IOS && (
        <ScrollHeader icon="arrow-back" title={route.name} onIconClick={() => navigator.pop()} />
      )}
      <ScrollView style={styles.container}>
        {venueInfos.map(venue => <TripContent venue={venue} />)}
      </ScrollView>
    </View>
  );
};

const mapDispatchToProps = {};

const select = store => ({
  markers: getMarkersByType(contentKeys)(store),
});

export default connect(
  select,
  mapDispatchToProps
)(VenueInfoPage);
