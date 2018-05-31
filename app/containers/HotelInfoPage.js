import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Linking, Image, Dimensions, Platform, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { getMarkersByType } from '../reducers/marker';
import TripContent from '../components/TripContent';
import Button from '../components/common/Button';
import ScrollHeader from '../components/header/ScrollHeader';
import theme from '../style/theme';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark,
    paddingTop: IOS ? 30 : 10,
    paddingBottom: 50,
  },
  buttons: {
    padding: 20,
  },
});

const contentKey = 'HOME';

const HotelInfoPage = ({ markers, navigator, route }) => {
  const hotelInfo = markers.get(contentKey);
  if (!hotelInfo) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      {!IOS && (
        <ScrollHeader icon="arrow-back" title={route.name} onIconClick={() => navigator.pop()} />
      )}
      <ScrollView style={styles.container}>
        <TripContent venue={hotelInfo} navigator={navigator}>
          <View style={styles.buttons}>
            <Button
              style={{ backgroundColor: theme.white }}
              textStyle={{ color: theme.dark }}
              onPress={() =>
                Linking.openURL(
                  'https://docs.google.com/spreadsheets/d/1QkvQoJIm4nGM_XPSXsd3exFB131NNOE9MPfjAgMLTbQ/edit'
                )
              }
            >
              Roommates
            </Button>
          </View>
        </TripContent>
      </ScrollView>
    </View>
  );
};

const select = store => ({
  markers: getMarkersByType([contentKey])(store),
});

export default connect(select)(HotelInfoPage);
