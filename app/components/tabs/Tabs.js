import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ReactNative = require('react-native');
const { StyleSheet, View, Animated, Platform, ViewPropTypes } = ReactNative;
const Button = require('./TabButton');
const IOS = Platform.OS === 'ios';
import Text from '../Text';
import theme from '../../style/theme';

class DefaultTabBar extends Component {
  constructor(props) {
    super(props);

    this.renderTab = this.renderTab.bind(this);
  }

  renderTabOption(name, page) {}

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;

    return (
      <Button
        style={{ flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits="button"
        onPress={() => onPressHandler(page)}
      >
        <View style={[styles.tab, this.props.tabStyle]}>
          <Text style={[{ color: textColor, top: IOS ? 4 : 0 }, textStyle || {}]}>{name}</Text>
        </View>
      </Button>
    );
  }

  render() {
    const {
      containerWidth,
      tabs,
      scrollValue,
      style,
      backgroundColor,
      activeTab,
      goToPage,
      underlineStyle,
      height,
    } = this.props;

    const numberOfTabs = tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 1,
      backgroundColor: theme.blush,
      bottom: 0,
    };

    const left = {
      transform: [
        {
          translateX: scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, containerWidth / numberOfTabs],
          }),
        },
      ],
    };

    // Changing line bg color
    // const lineBackgroundColor = scrollValue.interpolate({
    //   inputRange: [0, 1], outputRange: [theme.primary, theme.primary],
    // });

    return (
      <View style={[styles.tabs, { backgroundColor, height }, style]}>
        {tabs.map((name, page) => {
          const isTabActive = activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, goToPage);
        })}
        <Animated.View style={[tabUnderlineStyle, underlineStyle, left]} />
      </View>
    );
  }
}

DefaultTabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array,
  backgroundColor: PropTypes.string,
  activeTextColor: PropTypes.string,
  inactiveTextColor: PropTypes.string,
  tabStyle: ViewPropTypes.style,
  renderTab: PropTypes.func,
  underlineStyle: ViewPropTypes.style,
};

DefaultTabBar.defaultProps = {
  activeTextColor: theme.blush,
  inactiveTextColor: 'black',
  backgroundColor: null,
  height: 56,
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  tabs: {
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

module.exports = DefaultTabBar;
