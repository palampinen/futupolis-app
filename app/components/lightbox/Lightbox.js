'use strict';
import React, { Component } from 'react';
import { Alert, View, StyleSheet, BackHandler, Modal } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

import { openRegistrationView } from '../../concepts/registration';
import { voteFeedItem, removeFeedItem } from '../../actions/feed';
import { closeLightBox, getLightboxItem, isLightBoxOpen } from '../../concepts/lightbox';
import { openComments } from '../../concepts/comments';
import abuse from '../../services/abuse';

import PlatformTouchable from '../common/PlatformTouchable';
import ModalBackgroundView from '../common/ModalBackgroundView';
import VotePanel from '../feed/VotePanel';
import CommentsLink from '../feed/CommentsLink';
import CommentsView from '../comment/CommentsView';
import Loader from '../common/Loader';
import Text from '../Text';
import Share from 'react-native-share';
import PhotoView from 'react-native-photo-view';
import ImageZoom from 'react-native-image-zoom';
import theme from '../../style/theme';
import { isIphoneX, width, height, IOS } from '../../services/device-info';

class LightBox extends Component {
  state = { loading: false };
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isLightBoxOpen) {
        this.onClose();
        return true;
      }
      return false;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLightBoxOpen) {
      this.setState({ loading: true });
    }
  }

  onClose() {
    this.props.closeLightBox();
  }

  parseUrl(url) {
    return url;
    // const urlParts = url.split('/');
    // const imageId = urlParts[urlParts.length - 1];

    // return 'https://wappu.futurice.com/i/' + imageId;
  }

  onShare(imgUrl) {
    const url = this.parseUrl(imgUrl);

    const shareOptions = {
      title: 'Futupolis',
      url: url,
      message: 'Futupolis',
    };

    Share.open(shareOptions);
  }

  itemIsCreatedByMe(item) {
    return item.getIn(['author', 'type'], '') === 'ME';
  }

  showRemoveDialog(item) {
    if (this.itemIsCreatedByMe(item)) {
      Alert.alert('Remove Content', 'Do you want to remove this item?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes, remove item',
          onPress: () => {
            this.removeThisItem(item);
          },
          style: 'destructive',
        },
      ]);
    } else {
      Alert.alert('Flag Content', 'Do you want to report this item?', [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancel Pressed');
          },
          style: 'cancel',
        },
        {
          text: 'Yes, report item',
          onPress: () => {
            abuse.reportFeedItem(item.toJS());
          },
          style: 'destructive',
        },
      ]);
    }
  }

  removeThisItem(item) {
    this.props.removeFeedItem(item.toJS());
    this.onClose();
  }

  @autobind
  openPostComments() {
    const { lightBoxItem } = this.props;
    const postId = lightBoxItem.get('id');

    this.onClose();
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comments', showName: true });
  }

  render() {
    const { isLightBoxOpen, lightBoxItem } = this.props;

    if (!isLightBoxOpen || !lightBoxItem) {
      return null;
    }

    const itemImage = lightBoxItem.get('url');
    const itemAuthor = lightBoxItem.getIn(['author', 'name']);
    const isSystemUser = lightBoxItem.getIn(['author', 'type'], '') === 'SYSTEM';
    const created = moment(lightBoxItem.get('createdAt', ''));

    return (
      <Modal
        onRequestClose={this.onClose}
        visible={isLightBoxOpen}
        backButtonClose={true}
        style={styles.modal}
        transparent={true}
        animationType={IOS ? 'none' : 'slide'}
      >
        <ModalBackgroundView style={styles.container} blurType="dark">
          {IOS ? (
            <View style={{ width, height }}>
              <PhotoView
                source={{ uri: itemImage }}
                minimumZoomScale={1}
                maximumZoomScale={4}
                resizeMode={'contain'}
                style={{ width, height }}
              />
            </View>
          ) : (
            <View style={{ justifyContent: 'center', width, height }}>
              <ImageZoom
                onLoad={() => {
                  this.setState({ loading: false });
                }}
                source={{ uri: itemImage }}
                resizeMode={'contain'}
                style={{ width, height: width, flex: 1 }}
              />
              {this.state.loading && (
                <View
                  style={{
                    position: 'absolute',
                    left: width / 2 - 25,
                    top: height / 2 - 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                  }}
                >
                  <Loader color={theme.prange} size="large" />
                </View>
              )}
            </View>
          )}
          <View style={styles.header}>
            <View style={styles.header__icon}>
              <PlatformTouchable
                delayPressIn={0}
                onPress={this.onClose}
                background={IOS ? null : PlatformTouchable.SelectableBackgroundBorderless()}
              >
                <View>
                  <Icon style={{ color: theme.white, fontSize: 26 }} name="close" />
                </View>
              </PlatformTouchable>

              <View style={styles.headerTitle}>
                {itemAuthor && (
                  <Text style={styles.headerTitleText}>
                    {!isSystemUser ? itemAuthor : 'Futupolis'}
                  </Text>
                )}
                <View style={styles.date}>
                  <Text style={styles.dateText}>
                    {created.format('ddd DD.MM.YYYY')} at {created.format('HH:mm')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.toolbar}>
            <View>
              <VotePanel
                item={lightBoxItem.toJS()}
                voteFeedItem={this.props.voteFeedItem}
                openRegistrationView={this.props.openRegistrationView}
              />
            </View>

            <View>
              <CommentsLink
                parentId={lightBoxItem.get('id')}
                commentCount={lightBoxItem.get('commentCount')}
                openComments={this.openPostComments}
                reverse
              />
            </View>

            {!isSystemUser && (
              <PlatformTouchable
                onPress={() => this.showRemoveDialog(lightBoxItem)}
                activeOpacity={0.8}
              >
                <View style={styles.toolbar__button}>
                  <Icon
                    style={styles.toolbar__icon}
                    name={this.itemIsCreatedByMe(lightBoxItem) ? 'delete' : 'flag'}
                  />
                </View>
              </PlatformTouchable>
            )}
            <PlatformTouchable onPress={this.onShare.bind(this, itemImage)} activeOpacity={0.8}>
              <View style={styles.toolbar__button}>
                <Icon style={styles.toolbar__icon} name="share" />
              </View>
            </PlatformTouchable>
          </View>
        </ModalBackgroundView>
      </Modal>
    );
  }
}

const IOS_header = {
  marginTop: isIphoneX ? 20 : 10,
  height: isIphoneX ? 86 : 76,
  top: isIphoneX ? -20 : -10,
  backgroundColor: 'rgba(30,30,30,.6)',
};

const ANDROID_Header = {
  marginTop: 0,
  height: 56,
  backgroundColor: 'rgba(30,30,30,.8)',
  top: 0,
  left: 0,
  right: 0,
  borderRadius: 0,
};

const headerStyles = IOS ? IOS_header : ANDROID_Header;

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: IOS ? 'transparent' : theme.darker,
  },
  header: {
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    ...headerStyles,
  },
  header__icon: {
    position: 'absolute',
    top: IOS ? (isIphoneX ? 40 : 30) : 10,
    left: 15,
    right: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 15,
    top: IOS ? 2 : 0,
  },
  headerTitleText: {
    color: theme.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  date: {
    paddingTop: IOS ? 2 : 0,
  },
  dateText: {
    color: theme.white,
    opacity: 0.9,
    fontSize: 12,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    paddingRight: 10,
    paddingLeft: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: isIphoneX ? 64 : 54,
    paddingBottom: isIphoneX ? 10 : 0,
    zIndex: 3,
    backgroundColor: 'rgba(30,30,30,.6)',
  },
  toolbar__buttons: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingTop: 0,
  },
  toolbar__button: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginTop: IOS ? 0 : 1,
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  toolbar__icon: {
    backgroundColor: 'transparent',
    fontSize: 20,
    color: theme.inactive,
  },
  toolbar__button__text: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 10,
    marginTop: 2,
    color: theme.inactive,
  },
});

const select = store => ({
  lightBoxItem: getLightboxItem(store),
  isLightBoxOpen: isLightBoxOpen(store),
});

const mapDispatch = {
  removeFeedItem,
  closeLightBox,
  voteFeedItem,
  openRegistrationView,
  openComments,
};

export default connect(select, mapDispatch)(LightBox);
