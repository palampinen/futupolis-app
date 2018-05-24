import React, { Component } from 'react';
import { StyleSheet, View, Platform, Animated } from 'react-native';
import { ImagePickerManager } from 'NativeModules';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import ScrollTabs from 'react-native-scrollable-tab-view';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

import { getFeedViewType, openFeedItemInMap } from '../concepts/feed-view-type';
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
import ActionButtons from '../components/feed/ActionButtons';
import Tabs from '../constants/Tabs';
import ImageCaptureOptions from '../constants/ImageCaptureOptions';
import TabBarItem from '../components/tabs/Tabs';

const IOS = Platform.OS === 'ios';

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
    const { viewType, isRegistrationInfoValid } = this.props;
    const { stickyActionButtonsAnimation, actionButtonsAnimation, showScrollTopButton } = this.state;
    const page = viewType === Tabs.FEED ? 0 : 1;
    const isMapPageVisible = viewType === Tabs.MAP;

    return (
      <View style={styles.container}>

        <ScrollTabs
          initialPage={0}
          tabBarPosition={'top'}
          tabBarBackgroundColor={theme.dark}
          tabBarActiveTextColor={theme.dark}
          tabBarInactiveTextColor={theme.dark}
          locked={true}
          page={page}
          scrollWithoutAnimation={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <TabBarItem height={0} />}
        >

          <FeedList
            navigator={this.props.navigator}
            showScrollTopButton={showScrollTopButton}
            toggleScrollTopButton={this.toggleScrollTopButton}
            toggleActionButton={this.toggleActionButton}
            setRef={this.setFeedListRef}
            myRef={this.feedListRef}
            tabLabel="List"
            openFeedItemInMap={this.props.openFeedItemInMap}
          />
          <MapView navigator={this.props.navigator} tabLabel="Map" />
        </ScrollTabs>

        <ActionButtons
          visibilityAnimation={isMapPageVisible ? stickyActionButtonsAnimation : actionButtonsAnimation}
          isRegistrationInfoValid={isRegistrationInfoValid}
          style={styles.actionButtons}
          isLoading={this.props.isLoadingActionTypes || this.props.isLoadingUserData}
          onPressAction={this.onPressAction}
          onScrollTop={this.scrollTop}
          showScrollTopButton={isMapPageVisible ? false : showScrollTopButton}
        />

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
    backgroundColor: theme.darker,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

const select = store => ({
  editableImage: store.competition.get('editableImage'),
  viewType: getFeedViewType(store),
  notificationText: store.competition.get('notificationText'),

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
};

reactMixin(FeedTab.prototype, TimerMixin);
export default connect(select, mapDispatchToProps)(FeedTab);
