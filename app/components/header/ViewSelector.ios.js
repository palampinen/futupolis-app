import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { getFeedViewType, setFeedViewType } from '../../concepts/feed-view-type';

import Text from '../Text';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';

const viewTypes = [Tabs.FEED, Tabs.MAP];
const viewTypeTitles = {
  [Tabs.FEED]: 'List',
  [Tabs.MAP]: 'Map',
};

class ViewSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { indicatorAnimation: new Animated.Value(0) };
  }

  componentWillReceiveProps({ selectedViewType }) {
    if (selectedViewType !== this.props.selectedViewType) {
      const viewTypeOptions = viewTypes;
      const selectedViewTypeIndex = viewTypeOptions.indexOf(selectedViewType);
      this.animateIndicator(selectedViewTypeIndex);
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
    const { selectedViewType } = this.props;
    const { indicatorAnimation, indicatorAnimationPartTwo } = this.state;

    const viewTypeOptions = viewTypes;
    const selectedViewTypeIndex = viewTypeOptions.indexOf(selectedViewType);
    const nextViewTypeItem =
      selectedViewTypeIndex >= viewTypeOptions.length - 1
        ? viewTypeOptions[0]
        : viewTypeOptions[selectedViewTypeIndex + 1];

    const animatedIndicatorStyles = {
      top: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 8] }),
      height: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [6, 14, 6] }),
    };

    const onViewSelectorPress = () => this.props.setFeedViewType(nextViewTypeItem);

    return (
      <TouchableHighlight underlayColor="transparent" onPress={onViewSelectorPress}>
        <View style={styles.sortSelector}>
          <TouchableOpacity onPress={onViewSelectorPress} activeOpacity={0.7}>
            <Text style={styles.filterText}>{viewTypeTitles[selectedViewType]}</Text>
          </TouchableOpacity>
          <View style={styles.indicators}>
            {viewTypeOptions.map((type, index) => <View key={type} style={styles.indicator} />)}

            <Animated.View
              style={[styles.indicator, styles.activeIndicator, animatedIndicatorStyles]}
            />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  sortSelector: {
    top: 0,
    paddingTop: 15,
    paddingBottom: 8,
    paddingRight: 25,
    paddingLeft: 15,
  },
  filterText: {
    color: theme.white,
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'right',
    top: 1,
  },
  indicators: {
    position: 'absolute',
    right: 10,
    top: 13,
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
    backgroundColor: theme.orange,
    position: 'absolute',
    zIndex: 1,
  },
});

const mapDispatchToProps = { setFeedViewType };

const select = state => {
  return {
    selectedViewType: getFeedViewType(state),
  };
};

export default connect(select, mapDispatchToProps)(ViewSelector);
