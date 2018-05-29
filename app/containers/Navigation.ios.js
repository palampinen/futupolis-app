'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import ScrollableTabs from 'react-native-scrollable-tab-view';

import CalendarView from './CalendarView';

import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
// import NotificationView from './NotificationView';
import TripInfoView from './TripInfoView';

import Tabs from '../constants/Tabs';
import PopupInfo from './PopupInfo';
import { getUserPicture } from '../concepts/registration';
import { hasNewNotifications } from '../concepts/notifications';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import IconTabBar from '../components/common/MdIconTabBar';
import LightBox from '../components/lightbox/Lightbox';

import ICONS from '../constants/Icons';

const theme = require('../style/theme');

const initialTabIndex = 0;
const TAB_ORDER = [Tabs.FEED, Tabs.CALENDAR, Tabs.TRIP, Tabs.SETTINGS];

// # Tab navigation
class Navigation extends Component {
  componentDidMount() {
    this.props.changeTab(TAB_ORDER[initialTabIndex]);
  }

  @autobind
  onChangeTab({ ref }) {
    this.props.changeTab(ref.props.id);
  }

  render() {
    const { navigator, currentTab, profilePicture, showNotificationBadge } = this.props;
    let page = TAB_ORDER.indexOf(currentTab);
    if (page < 0) {
      page = initialTabIndex;
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollableTabs
          page={page}
          onChangeTab={this.onChangeTab}
          initialPage={initialTabIndex}
          tabBarPosition={'bottom'}
          tabBarBackgroundColor={theme.dark}
          tabBarActiveTextColor={theme.white}
          tabBarInactiveTextColor={theme.inactive}
          locked={true}
          scrollWithoutAnimation={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView
            navigator={navigator}
            id={Tabs.FEED}
            tabLabel={{ title: 'Feed', icon: 'forum' }}
          />
          <CalendarView
            id={Tabs.CALENDAR}
            navigator={navigator}
            tabLabel={{ title: 'Program', icon: 'event' }}
          />
          <TripInfoView
            navigator={navigator}
            id={Tabs.TRIP}
            tabLabel={{ title: 'Trip', icon: 'flight-takeoff', badge: showNotificationBadge ? '•' : null }}
          />
          <SettingsView
            navigator={navigator}
            id={Tabs.SETTINGS}
            tabLabel={{ title: 'Profile', icon: 'account-circle', image: profilePicture }}
          />
        </ScrollableTabs>
        <LightBox navigator={navigator} />
        <PopupInfo navigator={navigator} />
      </View>
    );
  }
}

const mapDispatchToProps = { changeTab };

const select = state => {
  return {
    currentTab: state.navigation.get('currentTab'),
    profilePicture: getUserPicture(state),
    showNotificationBadge: hasNewNotifications(state),
  };
};

export default connect(select, mapDispatchToProps)(Navigation);
