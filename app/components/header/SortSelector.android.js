import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { toArray } from 'lodash';
import { connect } from 'react-redux';

import { getFeedSortType, setFeedSortType } from '../../concepts/sortType';

import Text from '../Text';
import theme from '../../style/theme';
import SortTypes from '../../constants/SortTypes';

const sortTypeTitles = {
  [SortTypes.SORT_NEW]: 'NEW',
  [SortTypes.SORT_HOT]: 'HOT',
};

class SortSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { indicatorAnimation: new Animated.Value(0) };
  }

  componentWillReceiveProps({ selectedSortType }) {
    if (selectedSortType !== this.props.selectedSortType) {
      const sortTypeOptions = toArray(SortTypes);
      const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
      this.animateIndicator(selectedSortTypeIndex);
    }
  }

  // 'toValue' can be 0 | 1
  animateIndicator(toValue) {
    const { indicatorAnimation } = this.state;

    Animated.timing(indicatorAnimation, {
      toValue,
      duration: 512,
      easing: Easing.elastic(1),
    }).start();
  }

  render() {
    const { selectedSortType } = this.props;
    const { indicatorAnimation, indicatorAnimationPartTwo } = this.state;

    const sortTypeOptions = toArray(SortTypes);
    const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
    const nextSortTypeItem =
      selectedSortTypeIndex >= sortTypeOptions.length - 1
        ? sortTypeOptions[0]
        : sortTypeOptions[selectedSortTypeIndex + 1];

    const animatedIndicatorStyles = {
      top: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 8] }),
      height: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [6, 14, 6] }),
    };

    const onSortSelectorPress = () => this.props.setFeedSortType(nextSortTypeItem);

    return (
      <View style={styles.sortSelectorWrap}>
        <TouchableNativeFeedback
          onPress={onSortSelectorPress}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={styles.sortSelector}>
            <View onPress={onSortSelectorPress}>
              <Text style={styles.filterText}>{sortTypeTitles[selectedSortType]}</Text>
            </View>
            <View style={styles.indicators}>
              {sortTypeOptions.map((type, index) => <View key={type} style={styles.indicator} />)}

              <Animated.View
                style={[styles.indicator, styles.activeIndicator, animatedIndicatorStyles]}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  sortSelectorWrap: {
    backgroundColor: 'transparent',
    flex: 0,
  },
  sortSelector: {
    paddingTop: 23,
    paddingBottom: 13,
    paddingRight: 25,
    paddingLeft: 10,
    flex: 1,
  },
  filterText: {
    color: theme.blush,
    fontSize: 15,
    minWidth: 30,
    textAlign: 'right',
    top: -4,
  },
  indicators: {
    position: 'absolute',
    right: 10,
    top: 19,
    width: 8,
    alignItems: 'flex-start',
    height: 20,
    backgroundColor: 'transparent',
  },
  indicator: {
    marginTop: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.4,
    backgroundColor: theme.white,
  },
  activeIndicator: {
    opacity: 1,
    backgroundColor: theme.blush,
    position: 'absolute',
    zIndex: 1,
  },
});

const mapDispatchToProps = { setFeedSortType };

const select = state => {
  return {
    selectedSortType: getFeedSortType(state),
  };
};

export default connect(select, mapDispatchToProps)(SortSelector);
