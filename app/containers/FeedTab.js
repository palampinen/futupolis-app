import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Animated, TouchableOpacity } from 'react-native';
import { ImagePickerManager } from 'NativeModules';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import ScrollTabs from 'react-native-scrollable-tab-view';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import LinearGradient from 'react-native-linear-gradient';

import { getFeedViewType, openFeedItemInMap, showMapView, showFeedView } from '../concepts/feed-view-type';
import { getSelectedMarkerId } from '../concepts/user-map';
import {
  postImage,
  postAction,
  openTextActionView,
  openCheckInView,
  setEditableImage,
  clearEditableImage,
  updateCooldowns,
} from '../actions/competition';

import theme from '../style/theme';
import FeedList from '../components/feed/FeedList';
import MapView from '../components/map/UserMap';
import ImageEditor from '../components/feed/ImageEditor';
import Notification from '../components/common/Notification';
import PlatformTouchable from '../components/common/PlatformTouchable';
import ActionButtons from '../components/feed/ActionButtons';
import Tabs from '../constants/Tabs';
import ImageCaptureOptions from '../constants/ImageCaptureOptions';
import TabBarItem from '../components/tabs/Tabs';
import AnimateMe from '../components/AnimateMe';
import Text from '../components/Text';
import { IOS, width, height } from '../services/device-info';

class FeedTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionButtonsAnimation: new Animated.Value(1),
      stickyActionButtonsAnimation: new Animated.Value(1),
      showScrollTopButton: false,
    };
  }

  componentDidMount() {
    this.props.updateCooldowns();
  }

  setFeedListRef = (feedList) => {
    this.feedListRef = feedList;
  }

  @autobind
  scrollTop() {
    const { feedListRef } = this;

    if (feedListRef) {
      feedListRef.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  @autobind
  toggleActionButton(toValue) {
    Animated.timing(this.state.actionButtonsAnimation, { toValue, duration: 300 }).start();
  }

  @autobind
  toggleScrollTopButton(showScrollTopButton) {
    this.setState({ showScrollTopButton });
  }

  @autobind
  onPressAction(type) {
    switch (type) {
      case 'IMAGE':
        return this.chooseImage();
      case 'TEXT':
        return this.props.openTextActionView();
      default:
        return this.props.postAction(type);
    }
  }

  @autobind
  chooseImage() {
    if (IOS) {
      this.openImagePicker();
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker();
        });
      });
    }
  }


  @autobind
  openImagePicker() {
    ImagePickerManager.showImagePicker(ImageCaptureOptions, response => {
      if (!response.didCancel && !response.error) {
        const data = 'data:image/jpeg;base64,' + response.data;
        const editableImage = {
          data,
          width: response.width,
          height: response.height,
          vertical: response.isVertical,
        };

        this.openImageEditor(editableImage);
      }
    });
  }

  @autobind
  openImageEditor(editableImage) {
    this.props.setEditableImage(editableImage);
  }

  @autobind
  onImagePost(postPayload) {
    this.props.postImage(postPayload);
    this.resetPostImage();
  }

  @autobind
  resetPostImage() {
    this.props.clearEditableImage();
  }

  render() {
    const { viewType, isRegistrationInfoValid, selectedMapMarker } = this.props;
    const { stickyActionButtonsAnimation, actionButtonsAnimation, showScrollTopButton } = this.state;
    const page = viewType === Tabs.FEED ? 0 : 1;
    const isMapPageVisible = viewType === Tabs.MAP;

    const mapStyles = isMapPageVisible ? { flexGrow: 1 } : { height: 175, position: 'absolute' }
    const feedStyles = isMapPageVisible ? { height: !selectedMapMarker ? 56 : 0 } : { flexGrow: 1 }

    return (
      <View style={styles.container}>

        <View style={[styles.mapWrap, mapStyles]}>
          <MapView navigator={this.props.navigator} tabLabel="Map" isMapOpen={isMapPageVisible} />
        </View>

        <View style={feedStyles}>
          {isMapPageVisible && !selectedMapMarker &&
            <AnimateMe animationType="slide-fully-from-bottom" style={styles.toggleFeed} duration={300}>
              <PlatformTouchable onPress={this.props.showFeedView} activeOpacity={0.8}>
                <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={styles.toggleFeedText} bold>Back to List</Text>
                </View>
              </PlatformTouchable>
            </AnimateMe>
          }

          <FeedList
            navigator={this.props.navigator}
            showScrollTopButton={showScrollTopButton}
            toggleScrollTopButton={this.toggleScrollTopButton}
            toggleActionButton={this.toggleActionButton}
            setRef={this.setFeedListRef}
            myRef={this.feedListRef}
            tabLabel="List"
            openFeedItemInMap={this.props.openFeedItemInMap}
            onMapItemPress={this.props.showMapView}
          />
        </View>

        {(!selectedMapMarker || !isMapPageVisible) &&
          <ActionButtons
            visibilityAnimation={isMapPageVisible ? stickyActionButtonsAnimation : actionButtonsAnimation}
            isRegistrationInfoValid={isRegistrationInfoValid}
            style={styles.actionButtons}
            isLoading={this.props.isLoadingActionTypes || this.props.isLoadingUserData}
            onPressAction={this.onPressAction}
            onScrollTop={this.scrollTop}
            showScrollTopButton={isMapPageVisible ? false : showScrollTopButton}
          />
        }

        <Notification visible={this.props.isNotificationVisible}>
          {this.props.notificationText}
        </Notification>

        <ImageEditor
          onCancel={this.resetPostImage}
          onImagePost={this.onImagePost}
          animationType={'fade'}
          image={this.props.editableImage}
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.dark,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  mapWrap: {
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: theme.dark,
  },
  toggleFeed: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.dark,
    borderTopWidth: 2,
    borderTopColor: theme.blush,
  },
  toggleFeedText: {
    textAlign: 'center',
    color: theme.blush,
    top: IOS ? 3 : 0
  },
});

const select = store => ({
  editableImage: store.competition.get('editableImage'),
  viewType: getFeedViewType(store),
  notificationText: store.competition.get('notificationText'),
  selectedMapMarker: getSelectedMarkerId(store),

  isRegistrationInfoValid: !!store.registration.get('name'),
  isLoadingActionTypes: store.competition.get('isLoadingActionTypes'),
  isLoadingUserData: store.registration.get('isLoading'),
  isNotificationVisible: store.competition.get('isNotificationVisible'),
});

const mapDispatchToProps = {
  postImage,
  postAction,
  openTextActionView,
  setEditableImage,
  clearEditableImage,
  updateCooldowns,
  openFeedItemInMap,
  showMapView,
  showFeedView,
};

reactMixin(FeedTab.prototype, TimerMixin);
export default connect(select, mapDispatchToProps)(FeedTab);
