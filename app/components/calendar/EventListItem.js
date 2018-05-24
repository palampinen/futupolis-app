import React, { Component } from 'react';
import {
  Animated,
  Image,
  PropTypes,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';

import Text from '../Text';
import Icon from 'react-native-vector-icons/MaterialIcons';
import time from '../../utils/time';
import theme from '../../style/theme';
import PlatformTouchable from '../common/PlatformTouchable';

const ITEM_HEIGHT = 120;
const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  gridListItem: {
    width,
    flexGrow: 1,
    height: ITEM_HEIGHT,
  },

  gridListItemImgWrap: {
    height: ITEM_HEIGHT,
    width,
    position: 'absolute',
    overflow: 'hidden',
  },
  gridListItemImg: {
    width,
    height: ITEM_HEIGHT + 40,
  },
  gridListItemImgColorLayer: {
    opacity: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },

  gridListItemContent: {
    flexGrow: 1,
    flex: 1,
    justifyContent: 'flex-end',
    padding: 17,
    paddingBottom: 17,
    position: 'absolute',
    bottom: 0,
  },
  gridListItemTitle: {
    fontSize: 17,
    lineHeight: 20,
    textAlign: 'left',
    color: theme.white,
    paddingTop: 0,
    marginBottom: IOS ? 0 : 3,
  },

  gridListItemMeta: {
    flexGrow: 1,
  },
  gridListItemPlace: {
    fontSize: 13,
    color: theme.white,
  },
  gridListItemDistance: {
    color: theme.white,
    fontSize: 14,
  },
  gridListItemTime: {
    fontSize: 14,
    color: theme.white,
  },
  gridListItemIconsWrapper__left: {
    position: 'absolute',
    left: 20,
    bottom: 15,
  },
  gridListItemIconsWrapper: {
    position: 'absolute',
    right: 20,
    bottom: 15,
  },
  gridListItemIcon: {
    color: theme.light,
    opacity: 0.9,
    height: 20,
    fontSize: 14,
  },
});

const noImageCover = require('../../../assets/prague/futubohemia/chilicorn.png');
const blackColor = 'rgba(30,30,30,.5)';
const orangeColor = 'rgba(253,95,0,.5)';

export default class EventListItem extends Component {
  propTypes: {
    item: PropTypes.object.isRequired,
    handlePress: PropTypes.func.isRequired,
    rowId: PropTypes.number,
  };

  render() {
    const { item, hideStatus, pastEvent, scrollPos, rowId } = this.props;
    const timepoint = time.formatEventTime(item.startTime, item.endTime);
    const { coverImage } = item;
    // const coverImage = item.coverImage ? item.coverImage.replace('https://', 'http://') : '';
    const itemAnimationStyles = {
      transform: [
        {
          translateY: scrollPos.interpolate({
            inputRange: [(rowId - 1) * ITEM_HEIGHT, rowId * ITEM_HEIGHT, (rowId + 1) * ITEM_HEIGHT],
            outputRange: [0, 4, 8],
          }),
        },
      ],
    };

    return (
      <PlatformTouchable
        onPress={this.props.handlePress}
        underlayColor={'transparent'}
        activeOpacity={1}
        delayPressIn={0}
        background={!IOS ? PlatformTouchable.SelectableBackgroundBorderless() : null}
      >
        <View style={styles.gridListItem}>
          <View style={styles.gridListItemImgWrap}>
            <Animated.Image
              source={coverImage ? { uri: coverImage } : noImageCover}
              style={[styles.gridListItemImg, itemAnimationStyles]}
            />

            <View
              style={[
                styles.gridListItemImgColorLayer,
                { backgroundColor: rowId % 2 === 0 ? blackColor : orangeColor },
              ]}
            />
          </View>

          <View style={styles.gridListItemContent}>
            <Text style={styles.gridListItemTitle} bold>
              {(item.name || '').toUpperCase()}
            </Text>
            <View style={styles.gridListItemMeta}>
              <Text style={styles.gridListItemTime}>
                {/*pastEvent && `${timepoint.date} `*/}
                {timepoint.time} - {timepoint.endTime}
              </Text>
              <Text style={styles.gridListItemPlace}>{item.locationName}</Text>
            </View>

            {/*this.props.currentDistance !== null && (
              <View style={styles.gridListItemIconsWrapper__left}>
                <Text style={styles.gridListItemDistance}>{this.props.currentDistance}</Text>
              </View>
            )*/}

            {/*!hideStatus && (
              <View style={styles.gridListItemIconsWrapper}>
                {!pastEvent &&
                  timepoint.onGoing && <Text style={styles.gridListItemIcon}>Ongoing!</Text>}
                {!pastEvent &&
                  timepoint.startsSoon && <Text style={styles.gridListItemIcon}>Starts soon!</Text>}
              </View>
            )*/}
          </View>
        </View>
      </PlatformTouchable>
    );
  }
}
