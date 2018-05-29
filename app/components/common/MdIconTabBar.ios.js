// Icon and Text Tab bar
// https://www.google.com/design/spec/components/bottom-navigation.html
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Animated, Easing, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { isIpad, isIphoneX } from '../../services/device-info';

import ModalBackgroundView from './ModalBackgroundView';
import TouchableNativeFeedback from './PlatformTouchable';
import Text from '../Text';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },
  tabs: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: -2,
      width: 0,
    },
    height: isIphoneX ? 62 : 54,
    paddingBottom: isIphoneX ? 15 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: isIpad ? 100 : 0,
    borderWidth: 0,
    borderTopWidth: 0,
    borderTopColor: '#f1f1f1',
  },
  textLabel: {
    fontSize: 11,
    fontWeight: 'normal',
    textAlign: 'center',
    fontFamily: 'Futurice',
    position: 'absolute',
    marginTop: 2,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    bottom: isIphoneX ? 0 : 5,
  },
  image: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginTop: isIphoneX ? 1 : 0,
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
  icon: {
    marginTop: isIphoneX ? 2 : 0,
  },
  badgeText: {
    top: 2,
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 10,
  },
});

const defaultIconSize = 22;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
const AnimatedImage = Animated.createAnimatedComponent(Image);
class MdIconTabBar extends Component {
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
    if (nextProps.activeTab !== this.props.activeTab) {
      buttonAnimations.map((b, index) => {
        b.setValue(0);
      });
      Animated.timing(buttonAnimations[nextProps.activeTab], {
        duration: 330,
        easing: Easing.elastic(1),
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
              opacity: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }),
            },
          ]}
        />
      );
    }

    return (
      <AnimatedIcon
        name={item.icon}
        size={item.iconSize || defaultIconSize}
        style={[styles.icon,
          {
            bottom: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 7] }),
            color: isTabActive ? activeTextColor : inactiveTextColor,
          }
        ]}
      />
    );
  }

  renderTabOption(item, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'black';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    const buttonAnimation = this.state.buttonAnimations[page];

    return (
      <TouchableNativeFeedback
        key={item.title}
        onPress={() => this.props.goToPage(page)}
        style={{ flex: 1 }}
        activeOpacity={0.9}
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
                    opacity: isTabActive ? buttonAnimation : 1,
                    transform: [
                      {
                        scale: isTabActive ? buttonAnimation : 0,
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
      <View style={[styles.tabs, { backgroundColor: backgroundColor || null }, style]}>
        {tabs.map((tab, i) => this.renderTabOption(tab, i))}
      </View>
    );
  }
}

module.exports = MdIconTabBar;
