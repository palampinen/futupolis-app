import React, { PropTypes, Component } from 'react';
import { Animated, Dimensions, View, StyleSheet, Text, Image } from 'react-native';
import autobind from 'autobind-decorator';
import { noop } from 'lodash';

import PlatformTouchable from '../common/PlatformTouchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.dark,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingRight: 0,
  },
  iconWrap: {
    borderRadius: 28,
    width: 56,
    height: 56,
    marginRight: 0,
  },
  rightIconWrap: {
    borderRadius: 28,
    width: 56,
    height: 56,
    marginRight: 0,
  },
  rightContent: {
    position: 'absolute',
    right: 0,
    width: width / 1,
    paddingHorizontal: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconText: {
    color: theme.white,
    fontSize: 25,
  },
  rightIcon: {
    color: theme.white,
  },
  logo: {
    width: 180,
    height: 50,
    marginLeft: 16,
    top: 2,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    color: theme.white,
    fontSize: 18,
    lineHeight: 24,
  },
  subtitle: {
    color: theme.white,
    fontSize: 14,
    lineHeight: 20,
  },
});

class ScrollHeader extends Component {
  render() {
    const toolbarStyles = [styles.toolbar];
    const {
      title,
      subtitle,
      icon,
      logo,
      onIconClick,
      actions,
      elevation,
      rightIcon,
      onRightIconClick,
      renderRightContent,
      extraStyles,
    } = this.props;

    return (
      <View style={[styles.toolbar, { elevation, paddingRight: rightIcon ? 0 : 20 }, extraStyles]}>
        {!!icon && (
          <View style={styles.iconWrap}>
            <PlatformTouchable
              delayPressIn={0}
              onPress={onIconClick}
              background={PlatformTouchable.SelectableBackgroundBorderless()}
            >
              <View style={styles.icon}>
                <Icon name={icon} style={styles.iconText} />
              </View>
            </PlatformTouchable>
          </View>
        )}

        {!!logo && <Image source={logo} style={styles.logo} resizeMode="contain" />}
        <View style={styles.titleWrap}>
          {!!title && <Text style={styles.title}>{title}</Text>}
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {!!renderRightContent && (
          <View style={[styles.rightContent, !!rightIcon && { right: 50 }]}>
            {renderRightContent()}
          </View>
        )}

        {rightIcon && (
          <View style={styles.rightIconWrap}>
            <PlatformTouchable
              delayPressIn={0}
              onPress={onRightIconClick}
              background={PlatformTouchable.SelectableBackgroundBorderless()}
            >
              <View style={styles.icon}>
                <Icon name={rightIcon} style={[styles.iconText, styles.rightIcon]} />
              </View>
            </PlatformTouchable>
          </View>
        )}
      </View>
    );
  }
}

ScrollHeader.defaultProps = {
  icon: null,
  rightIcon: null,
  logo: null,
  title: null,
  subtitle: null,
  elevation: 1,
  onIconClick: noop,
  onRightIconClick: noop,
  renderRightContent: null,
  extraStyles: {},
};

export default ScrollHeader;
