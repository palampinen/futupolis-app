import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableHighlight
} from 'react-native'
import { connect } from 'react-redux';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';

const CitySelector = ({}) => (
  <TouchableHighlight
    underlayColor={'transparent'}
    onPress={() => onCityIconClicked() }>
    <View>
      <MdIcon name='map' style={styles.filterIcon} />
    </View>
  </TouchableHighlight>
);

var styles = StyleSheet.create({
  filterText: {
    color: theme.white,
    fontSize: 10,
    paddingTop: 15,
    paddingLeft: 18,
  },
  filterIcon: {
    fontSize: 24,
    color: theme.white,
  },
});


const mapDispatchToProps = {};

const select = state => {
  return {
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(CitySelector);
