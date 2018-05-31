'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Animated,
  Easing,
  RefreshControl,
  View,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import LinearGradient from 'react-native-linear-gradient';

import {
  fetchFeed,
  refreshFeed,
  loadMoreItems,
  removeFeedItem,
  voteFeedItem,
} from '../../actions/feed';
import { openLightBox } from '../../concepts/lightbox';
import { openComments, closeComments } from '../../concepts/comments';
import { fetchUserImages } from '../../concepts/user';
import { openRegistrationView, getUserTeam } from '../../concepts/registration';
import { IOS, height } from '../../services/device-info';

import Text from '../Text';
import ImageEditor from './ImageEditor';
import FeedListItem from './FeedListItem';
import Notification from '../common/Notification';
import UserView from '../user/UserView';
import CommentsView from '../comment/CommentsView';
import Loading from './Loading';
import ActionButtons from './ActionButtons';
import LoadingStates from '../../constants/LoadingStates';

import theme from '../../style/theme';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.transparent,
  },
  feedContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  listView: {
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

class FeedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  componentDidMount() {
    this.props.fetchFeed();
  }

  componentWillReceiveProps({ feed }) {
    if (feed !== this.props.feed) {
      const updatedFeed = [{ mapLink: true }].concat(feed.toJS());
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(updatedFeed),
      });
    }
    // Scroll to top when user does an action
    if (this.props.isSending) {
      this.scrollTop();
    }
  }

  @autobind
  scrollTop() {
    if (this.props.myRef) {
      this.props.myRef.scrollTo({ x: 0, y: 0, animated: true });
    }
  }

  scrollPos: 0;
  showActionButtons: true;

  @autobind
  _onScroll(event) {
    const { showScrollTopButton } = this.props;
    const SHOW_SCROLLTOP_LIMIT = 600;
    const HIDE_BUTTON_LIMIT = 570;
    const scrollTop = event.nativeEvent.contentOffset.y;

    const isOverLimit = scrollTop > SHOW_SCROLLTOP_LIMIT;
    const isOverHideLimit = scrollTop > HIDE_BUTTON_LIMIT;

    if (showScrollTopButton !== isOverLimit) {
      // this.setState({ showScrollTopButton: isOverLimit });
      this.props.toggleScrollTopButton(isOverLimit);
    }

    const SENSITIVITY = 25;
    if (this.showActionButtons && isOverHideLimit && scrollTop - this.scrollPos > SENSITIVITY) {
      this.showActionButtons = false;
      // Animated.timing(this.state.actionButtonsAnimation, { toValue: 0, duration: 300 }).start();
      this.props.toggleActionButton(0);
    } else if (
      !this.showActionButtons &&
      ((isOverHideLimit && this.scrollPos - scrollTop > SENSITIVITY) || !isOverHideLimit)
    ) {
      this.showActionButtons = true;
      this.props.toggleActionButton(1);
      // Animated.timing(this.state.actionButtonsAnimation, { toValue: 1, duration: 300 }).start();
    }

    this.scrollPos = scrollTop;
  }

  @autobind
  onLoadMoreItems() {
    const { isRefreshing, feed } = this.props;
    if (isRefreshing || !feed.size || feed.size < 10) {
      return;
    }

    const oldestItem = feed
      // admin items are not calclulated
      .filter(item => item.getIn(['author', 'type']) !== 'SYSTEM')
      // get oldest by createdAt
      .minBy(item => item.get('createdAt'));

    const oldestItemID = oldestItem.get('id', '');

    if (oldestItemID) {
      this.props.loadMoreItems(oldestItemID);
    }
  }

  @autobind
  openUserPhotos(user) {
    if (user.id) {
      this.props.navigator.push({
        component: UserView,
        name: `${user.name}`,
        user,
      });
      this.props.fetchUserImages(user.id);
    }
  }

  @autobind
  openPostComments(postId) {
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comment', showName: true });
  }

  renderSkeletonState() {
    const item = { type: 'SKELETON' };
    return (
      <View style={styles.feedContainer}>
        <View style={styles.listView}>
          <FeedListItem item={item} />
          <FeedListItem item={item} opacity={0.7} />
          <FeedListItem item={item} opacity={0.4} />
        </View>
      </View>
    );
  }

  @autobind
  renderFeed() {
    const {
      feedListState,
      isLoadingActionTypes,
      isLoadingUserData,
      isRefreshing,
      isSending,
    } = this.props;

    const refreshControl = (
      <RefreshControl
        refreshing={isRefreshing || isSending}
        onRefresh={this.props.refreshFeed}
        colors={[theme.orange]}
        tintColor={theme.white}
        progressBackgroundColor={theme.dark}
      />
    );

    const isLoading = isLoadingActionTypes || isLoadingUserData;

    switch (feedListState) {
      case LoadingStates.LOADING:
        return this.renderSkeletonState();
      case LoadingStates.FAILED:
        return (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', height }}
            refreshControl={refreshControl}
          >
            <Text
              style={{ marginTop: 20, textAlign: 'center', padding: 30, color: theme.inactive }}
            >
              Could not get feed...
            </Text>
          </ScrollView>
        );
      default:
        return (
          <View style={styles.feedContainer}>
            <ListView
              ref={this.props.setRef}
              dataSource={this.state.dataSource}
              showsVerticalScrollIndicator={false}
              renderRow={(item, i) =>
                item.mapLink ? (
                  <TouchableWithoutFeedback onPress={this.props.onMapItemPress}>
                    <LinearGradient
                      locations={[0, 0.5, 0.9]}
                      colors={['rgba(51,50,56,.001)', 'rgba(51,50,56,.4)', theme.dark]}
                      style={{
                        height: 150,
                      }}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  <FeedListItem
                    item={item}
                    key={item.id}
                    userTeam={this.props.userTeam}
                    removeFeedItem={this.props.removeFeedItem}
                    voteFeedItem={this.props.voteFeedItem}
                    isRegistrationInfoValid={this.props.isRegistrationInfoValid}
                    openRegistrationView={this.props.openRegistrationView}
                    openUserPhotos={this.openUserPhotos}
                    openComments={this.openPostComments}
                    closeComments={this.props.closeComments}
                    openLightBox={this.props.openLightBox}
                    openFeedItemInMap={this.props.openFeedItemInMap}
                  />
                )
              }
              style={[styles.listView]}
              onScroll={this._onScroll}
              onEndReached={this.onLoadMoreItems}
              refreshControl={refreshControl}
            />
          </View>
        );
    }
  }

  render() {
    return <View style={styles.container}>{this.renderFeed()}</View>;
  }
}

const mapDispatchToProps = {
  fetchFeed,
  refreshFeed,
  loadMoreItems,
  removeFeedItem,
  voteFeedItem,
  openLightBox,
  openComments,
  closeComments,
  openRegistrationView,
  fetchUserImages,
};

const select = store => {
  const isRegistrationInfoValid =
    store.registration.get('name') !== '' && store.registration.get('selectedTeam') > 0;

  return {
    feed: store.feed.get('list'),
    feedListState: store.feed.get('listState'),
    isRefreshing: store.feed.get('isRefreshing'),
    isLoadingActionTypes: store.competition.get('isLoadingActionTypes'),
    isSending: store.competition.get('isSending'),
    userTeam: getUserTeam(store),
    editableImage: store.competition.get('editableImage'),

    isRegistrationInfoValid,
    isLoadingUserData: store.registration.get('isLoading'),
  };
};

export default connect(
  select,
  mapDispatchToProps
)(FeedList);
