'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { changeTab } from '../actions/navigation';
import { toggleCityPanel, getCityPanelShowState } from '../concepts/city';
import { getUserPicture } from '../concepts/registration';
import { getFeedSortType, setFeedSortType } from '../concepts/sortType';
import CalendarView from './CalendarView';
// import MoodView from './MoodView';
// import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import EventMapView from './EventMapView';
import TripInfoView from './TripInfoView';

import Header from '../components/common/MainHeader';
import AndroidTabs from 'react-native-scrollable-tab-view';
import Tabs from '../constants/Tabs';
import PopupInfo from './PopupInfo';
import LightBox from '../components/lightbox/Lightbox';

const theme = require('../style/theme');
const IconTabBar = require('../components/common/MdIconTabBar');
const ANDROID_TAB_ORDER = [Tabs.FEED, Tabs.CALENDAR, Tabs.TRIP, Tabs.SETTINGS];
const initialTab = 0;

class AndroidTabNavigation extends Component {
  componentDidMount() {
    this.props.changeTab(ANDROID_TAB_ORDER[initialTab]);
  }

  @autobind
  onChangeTab({ i }) {
    this.props.changeTab(ANDROID_TAB_ORDER[i]);
  }

  render() {
    const { navigator, currentTab, selectedSortType, profilePicture } = this.props;

    return (
      <View style={{ flexGrow: 1, flex: 1 }}>
        <Header
          title={null}
          backgroundColor={theme.dark}
          currentTab={currentTab}
          selectedSortType={selectedSortType}
          setFeedSortType={this.props.setFeedSortType}
          navigator={navigator}
        />
        <AndroidTabs
          onChangeTab={this.onChangeTab}
          initialPage={initialTab}
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
            id={Tabs.FEED}
            navigator={navigator}
            tabLabel={{ title: 'Feed', icon: 'forum' }}
          />
          <CalendarView
            id={Tabs.CALENDAR}
            navigator={navigator}
            tabLabel={{ title: 'Event', icon: 'event' }}
          />
          <TripInfoView
            id={Tabs.TRIP}
            navigator={navigator}
            tabLabel={{ title: 'Trip', icon: 'flight-takeoff' }}
          />
          <ProfileView
            id={Tabs.SETTINGS}
            navigator={navigator}
            tabLabel={{ title: 'Info', icon: 'account-circle', image: profilePicture }}
          />
        </AndroidTabs>
        <LightBox navigator={navigator} />
        <PopupInfo navigator={navigator} />
      </View>
    );
  }
}

const mapDispatchToProps = {
  changeTab,
  setFeedSortType,
};

const select = state => {
  return {
    selectedSortType: getFeedSortType(state),
    currentTab: state.navigation.get('currentTab'),
    profilePicture: getUserPicture(state),
  };
};

export default connect(
  select,
  mapDispatchToProps
)(AndroidTabNavigation);
