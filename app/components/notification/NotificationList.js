import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { List } from 'immutable';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { fetchNotifications, getNotificationsData } from '../../concepts/notifications';
import NotificationRow from './NotificationRow';
import NotificationDetail from './NotificationDetail';
import EmptyState from './EmptyState';
import Tabs from '../../constants/Tabs';
// import { openComments } from '../concepts/comments';
// import CommentsView from '../components/comment/CommentsView';

import Text from '../Text';

import theme from '../../style/theme';
import typography from '../../style/typography';

const IOS = Platform.OS === 'ios';

class NotificationsList extends Component {
  // componentDidMount() {
  //   this.props.fetchNotifications();
  // }

  // componentWillReceiveProps({ currentTab }) {
  //   // Fetch on Settings tab
  //   if (currentTab !== this.props.currentTab && currentTab === Tabs.NOTIFICATIONS) {
  //     this.props.fetchMyImages();
  //   }
  // }

  @autobind
  openNotification(notification) {
    console.log('open notification');
    this.props.navigator.push({
      component: NotificationDetail,
      name: 'Notification',
      showName: true,
      model: notification,
    });
  }

  renderLoader() {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.orange} />
      </View>
    );
  }

  renderContent() {
    const { notifications, isLoading, navigator } = this.props;
    if (isLoading) {
      return this.renderLoader();
    }

    if (!notifications.size) {
      return <EmptyState />;
    }

    return (
      <ScrollView>
        {notifications.map((row, index) => (
          <NotificationRow
            item={row}
            showDelay={(index + 1) * 100}
            last={index === notifications.size - 1}
            onPress={this.openNotification}
          />
        ))}
      </ScrollView>
    );
  }

  render() {
    const { navigator } = this.props;
    return <View style={styles.container}>{this.renderContent()}</View>;
  }
}

NotificationsList.defaultProps = {
  notifications: List(),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.darker,
    paddingTop: IOS ? 0 : 0,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapDispatchToProps = { fetchNotifications };

export default connect(
  getNotificationsData,
  mapDispatchToProps
)(NotificationsList);
