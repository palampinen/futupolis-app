// Icon and Text Tab bar
// https://www.google.com/design/spec/components/bottom-navigation.html
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  TouchableNativeFeedback,
  View,
  Animated,
  Easing,
  Image,
  Text,
} from 'react-native';

import theme from '../../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
  },
  tabs: {
    elevation: 6,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 0,
    borderTopColor: 'transparent',
  },
  textLabel: {
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Futurice-Regular',
    position: 'absolute',
    marginTop: 2,
    left: 0,
    right: 0,
    bottom: 7,
  },
  image: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 30,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.blush,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    top: 0,
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Futurice-Bold',
  },
});

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const defaultIconSize = 23;

class AndroidTabBar extends Component {
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
  };

  constructor(props) {
    super(props);

    const { activeTab } = props;
    this.state = {
      buttonAnimations: this.props.tabs.map(
        (t, index) => new Animated.Value(index === activeTab ? 1 : 0)
      ),
    };

    this.renderTabOption = this.renderTabOption.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { buttonAnimations } = this.state;
    const { activeTab } = this.props;
    if (nextProps.activeTab !== activeTab) {
      buttonAnimations.map(b => {
        b.setValue(0);
      });
      Animated.timing(buttonAnimations[nextProps.activeTab], {
        duration: 250,
        easing: Easing.ease,
        toValue: 1,
      }).start();
    }
  }

  renderIconOrImage(item, buttonAnimation, isTabActive, activeTextColor, inactiveTextColor) {
    if (item.image) {
      return (
        <AnimatedImage
          source={{ uri: item.image }}
          style={[
            styles.image,
            {
              bottom: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 7] }),
              opacity: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
            },
          ]}
        />
      );
    }

    return (
      <AnimatedIcon
        name={item.icon}
        size={item.iconSize || defaultIconSize}
        style={{
          bottom: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 7] }),
          color: isTabActive ? activeTextColor : inactiveTextColor,
        }}
      />
    );
  }

  renderTabOption(item, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'black';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';

    // const AnimatedIcon = Animated.createAnimatedComponent(Icon);

    // const numberOfTabs = this.props.tabs.length;
    // const outPutArray = times(numberOfTabs, () => 0);
    // outPutArray[page] = 1; // -> eg. [0,1,0,0,0]

    // const textScale = this.props.scrollValue.interpolate({  inputRange: range(numberOfTabs), outputRange: outPutArray});
    // const iconTop = textScale.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

    const buttonAnimation = this.state.buttonAnimations[page];

    return (
      <TouchableNativeFeedback
        key={item.title}
        onPress={() => this.props.goToPage(page)}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        delayPressIn={0}
      >
        <View style={styles.tab}>
          {this.renderIconOrImage(
            item,
            buttonAnimation,
            isTabActive,
            activeTextColor,
            inactiveTextColor
          )}

          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}

          {item.title &&
            isTabActive && (
              <Animated.Text
                style={[
                  styles.textLabel,
                  {
                    color: activeTextColor,
                    opacity: buttonAnimation,
                    transform: [
                      {
                        scale: buttonAnimation,
                      },
                    ],
                  },
                ]}
              >
                {item.title}
              </Animated.Text>
            )}
        </View>
      </TouchableNativeFeedback>
    );
  }

  render() {
    const { tabs, backgroundColor, style } = this.props;

    return (
      <View>
        <View style={[styles.tabs, { backgroundColor: backgroundColor || null }, style]}>
          {tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      </View>
    );
  }
}

module.exports = AndroidTabBar;
