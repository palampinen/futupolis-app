'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  PropTypes,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import autobind from 'autobind-decorator';

import { isEmpty, get } from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import abuse from '../../services/abuse';
import { IOS, isIphoneX, width } from '../../services/device-info';
import time from '../../utils/time';
import theme from '../../style/theme';

import VotePanel from './VotePanel';
import Text from '../Text';
import CommentsLink from './CommentsLink';
import FeedItemText from './FeedItemText';
import MapLink from './MapLink';
import RingLightImage from '../RingLight';


const FEED_ITEM_MARGIN_DISTANCE = 0;
const FEED_ITEM_MARGIN_DEFAULT = 0;
const FEED_ADMIN_ITEM_MARGIN_DEFAULT = 15;
const placeholderSpeakerImage = require('../../../assets/futupolis/avatar--robot.png');

const styles = StyleSheet.create({
  itemWrapper: {
    width,
    flex: 1,
    backgroundColor: theme.darker,
    paddingBottom: 20,
    paddingTop: 0,
  },
  itemTouchable: {
    elevation: 1,
    flexGrow: 1,
  },
  itemContent: {
    flexGrow: 1,
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DISTANCE,
    borderRadius: 0,
    // overflow: 'hidden',
    // borderBottomWidth: IOS ? 0 : 1,
    // borderBottomColor: 'rgba(0, 0, 0, .075)',
    // // # Drop shadows
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.075,
    // shadowRadius: 1,
    // shadowOffset: {
    //   height: 2,
    //   width: 0,
    // },
    backgroundColor: theme.dark,
  },
  itemContent_selected: {
    backgroundColor: theme.darker,
  },
  itemContent_byMyTeam: {
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    marginLeft: FEED_ITEM_MARGIN_DISTANCE,
    // backgroundColor: '#edfcfb',
  },

  itemContent_image: {
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    borderRadius: 0,
  },
  itemImageWrapper: {
    width: width - 2 * FEED_ITEM_MARGIN_DEFAULT,
    height: width - 2 * FEED_ITEM_MARGIN_DEFAULT,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  itemTextWrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 18,
    paddingBottom: 4,
    top: -10,
  },
  feedItemListText: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 25,
    color: theme.white,
  },
  feedItemListItemImg: {
    width: width - 2 * FEED_ITEM_MARGIN_DEFAULT,
    height: width - 2 * FEED_ITEM_MARGIN_DEFAULT,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  feedItemListItemImg__admin: {
    width: width - 2 * FEED_ADMIN_ITEM_MARGIN_DEFAULT,
    borderRadius: 5,
  },
  feedItemListItemInfo: {
    flex: 1,
    flexDirection: 'row',
    padding: 13,
    paddingTop: 13,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedItemListItemAuthor: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.black,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: theme.grey1,
    borderRadius: 18,
    color: theme.white,
    fontSize: 32,
    lineHeight: 36,
    backgroundColor: theme.transparent,
  },
  itemAuthorName: {
    fontSize: 14,
    top: IOS ? 2 : 0,
    color: theme.white,
    paddingRight: 10,
    fontWeight: 'normal',
  },
  itemAuthorTeam: {
    fontSize: 11,
    color: '#aaa',
  },
  itemAuthorTeam__my: {
    color: theme.primary,
    fontWeight: 'bold',
  },
  feedItemListItemAuthorIcon: {
    color: '#bbb',
    fontSize: 15,
    marginTop: 1,
    paddingRight: 10,
  },
  listItemRemoveButton: {
    backgroundColor: 'transparent',
    color: 'rgba(150,150,150,.65)',
    fontSize: IOS ? 22 : 20,
  },
  listItemRemoveContainer: {
    position: 'absolute',
    right: 8,
    bottom: 10,
    borderRadius: 15,
    width: 30,
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTimestamp: {
    color: '#aaa',
    fontSize: 14,
    top: IOS ? 3 : 0,
  },
  itemContent__admin: {
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 2,
    backgroundColor: '#faf5ee',
  },
  itemTextWrapper__admin: {
    paddingTop: 0,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },
  feedItemListItemInfo__admin: {
    paddingLeft: 0,
    paddingBottom: 14,
  },
  feedItemListItemAuthor__admin: {
    paddingLeft: 15,
  },
  itemTimestamp__admin: {
    color: '#b5afa6',
  },
  feedItemListText__admin: {
    textAlign: 'left',
    color: '#7d776e',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },

  // # Skeleton styles
  skeletonWrap: {
    flex: 1,
    minHeight: 200,
  },
  skeletonHeader: {
    minHeight: 50,
    paddingTop: 10,
    justifyContent: 'center',
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 15,
    backgroundColor: theme.greyish,
  },
  skeletonName: {
    backgroundColor: theme.greyish,
    width: 100,
    height: 16,
    marginTop: 0,
  },
  skeletonTime: {
    backgroundColor: theme.greyish,
    width: 25,
    height: 16,
    marginTop: 0,
  },
  skeletonItemText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonText: {
    backgroundColor: theme.greyish,
    width: width / 2,
    height: 16,
    margin: 10,
  },
  skeletonFooterItem: {
    backgroundColor: theme.greyish,
    height: 16,
    width: 100,
    marginBottom: isIphoneX ? 20 : 15,
    marginHorizontal: 15,
  },
});

class FeedListItem extends Component {
  propTypes: {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { selected: false };
  }

  handleUrlPress(url) {
    Linking.openURL(url);
  }

  itemIsCreatedByMe(item) {
    return item.author.type === 'ME';
  }

  itemIsCreatedByMyTeam(item) {
    const { userTeam } = this.props;
    if (userTeam) {
      return item.author.team === userTeam.get('name');
    }
    return false;
  }

  selectItem() {
    this.setState({ selected: true });
    this.showRemoveDialog(this.props.item);
  }

  deSelectItem() {
    this.setState({ selected: false });
  }

  showRemoveDialog(item) {
    if (this.itemIsCreatedByMe(item)) {
      Alert.alert('Remove Content', 'Do you want to remove this item?', [
        {
          text: 'Cancel',
          onPress: () => this.deSelectItem(),
          style: 'cancel',
        },
        {
          text: 'Yes, remove item',
          onPress: () => {
            this.deSelectItem();
            this.removeThisItem();
          },
          style: 'destructive',
        },
      ]);
    } else {
      Alert.alert('Flag Content', 'Do you want to report this item?', [
        {
          text: 'Cancel',
          onPress: () => this.deSelectItem(),
          style: 'cancel',
        },
        {
          text: 'Yes, report item',
          onPress: () => {
            this.deSelectItem();
            abuse.reportFeedItem(item);
          },
          style: 'destructive',
        },
      ]);
    }
  }

  removeThisItem() {
    this.props.removeFeedItem(this.props.item);
  }

  // Render "remove" button, which is remove OR flag button,
  // depending is the user the creator of this feed item or not
  renderRemoveButton(item) {
    if (item.author.type === 'SYSTEM') {
      return <View />; // currently it is not possible to return null in RN as a view
    }

    const iconName = this.itemIsCreatedByMe(item) ? 'delete' : 'flag';
    return (
      <TouchableOpacity
        style={[
          styles.listItemRemoveContainer,
          { backgroundColor: item.type !== 'IMAGE' ? 'transparent' : 'rgba(255,255,255,.1)' },
        ]}
        onPress={() => this.showRemoveDialog(item)}
      >
        <Icon
          name={iconName}
          style={[styles.listItemRemoveButton, { opacity: item.type !== 'IMAGE' ? 0.7 : 1 }]}
        />
      </TouchableOpacity>
    );
  }

  renderAdminItem(item, ago) {
    return (
      <View style={styles.itemWrapper}>
        <View style={[styles.itemContent, styles.itemContent__admin]}>
          <View style={[styles.feedItemListItemInfo, styles.feedItemListItemInfo__admin]}>
            <View style={[styles.feedItemListItemAuthor, styles.feedItemListItemAuthor__admin]}>
              <Text style={styles.itemAuthorName}>Futuspirit</Text>
            </View>
            <Text style={[styles.itemTimestamp, styles.itemTimestamp__admin]}>{ago}</Text>
          </View>

          {item.type === 'IMAGE' ? (
            <View style={styles.itemImageWrapper}>
              <TouchableOpacity activeOpacity={1} onPress={() => this.props.openLightBox(item.id)}>
                <Image
                  source={{ uri: item.url }}
                  style={[styles.feedItemListItemImg, styles.feedItemListItemImg__admin]}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.itemTextWrapper, styles.itemTextWrapper__admin]}>
              <Text style={[styles.feedItemListText, styles.feedItemListText__admin]}>
                {item.text}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  @autobind
  renderSkeletonItem() {
    return (
      <View style={[styles.itemWrapper, styles.skeletonWrap]}>
        <View style={[styles.itemTouchable, { opacity: this.props.opacity || 1}]}>
          <View style={styles.itemContent}>
            <View style={[styles.feedItemListItemInfo, styles.skeletonHeader]}>
              <View style={styles.skeletonAvatar} />
              <View style={styles.feedItemListItemAuthor}>
                <View style={styles.skeletonName} />
              </View>
              <View style={styles.skeletonTime} />
            </View>

            <View style={[styles.itemTextWrapper, styles.skeletonItemText]}>
              <View style={styles.skeletonText} />
              <View style={styles.skeletonText} />
            </View>

            <View style={styles.footer}>
              <View style={styles.skeletonFooterItem} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { item, openUserPhotos, openComments } = this.props;

    if (item.type === 'SKELETON') {
      return this.renderSkeletonItem();
    }

    const { selected } = this.state;
    const ago = time.getTimeAgo(item.createdAt);

    if (item.author.type === 'SYSTEM') {
      return this.renderAdminItem(item, ago);
    }

    const hasItemText = !isEmpty(item.text);
    const itemByMyTeam = this.itemIsCreatedByMyTeam(item);
    const isItemImage = item.type === 'IMAGE';
    const avatar = item.author.profilePicture;
    const hasLocation = get(item, 'location.latitude') && get(item, 'location.longitude')

    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemTouchable}
          onLongPress={() => this.selectItem()}
        >
          <View
            style={[
              styles.itemContent,
              itemByMyTeam ? styles.itemContent_byMyTeam : {},
              isItemImage ? styles.itemContent_image : {},
              selected ? styles.itemContent_selected : {},
            ]}
          >
            <TouchableOpacity
              activeOpacity={IOS ? 0.7 : 1}
              style={styles.feedItemListItemInfo}
              onPress={() => openUserPhotos(item.author)}
            >
              <View style={styles.itemAuthorAvatar}>
                <RingLightImage
                  source={avatar ? { uri: avatar } : placeholderSpeakerImage}
                  style={styles.profilePic}
                  width={34}
                  height={34}
                />
              </View>
              <View style={styles.feedItemListItemAuthor}>
                <Text style={styles.itemAuthorName}>{item.author.name}</Text>
              </View>
              <Text style={styles.itemTimestamp}>{ago}</Text>
            </TouchableOpacity>

            {hasItemText &&
              isItemImage && (
                <FeedItemText
                  text={item.text}
                  isItemImage={isItemImage}
                  handleUrlPress={this.handleUrlPress}
                />
              )}

            {isItemImage && (
              <View style={styles.itemImageWrapper}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.props.openLightBox(item.id)}
                >
                  <Image source={{ uri: item.url }} style={styles.feedItemListItemImg} />
                </TouchableOpacity>
              </View>
            )}
            {!isItemImage && (
              <FeedItemText
                text={item.text}
                isItemImage={isItemImage}
                handleUrlPress={this.handleUrlPress}
              />
            )}

            <View style={styles.footer}>
              <VotePanel
                item={item}
                voteFeedItem={this.props.voteFeedItem}
                openRegistrationView={this.props.openRegistrationView}
              />


              <CommentsLink
                parentId={item.id}
                commentCount={item.commentCount}
                openComments={() => openComments(item.id)}
                reverse
              />

              {hasLocation &&
                <MapLink
                  item={item}
                  onPress={this.props.openFeedItemInMap}
                />
              }
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default FeedListItem;
