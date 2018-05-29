'use strict';

import React, { Component } from 'react';
import { StyleSheet, ListView, Platform, PropTypes, ActivityIndicator, View } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import analytics from '../services/analytics';
import { fetchEvents } from '../actions/event';
import { getEventsForDay, getEventListState } from '../reducers/event';
import Text from '../components/Text';
import Button from '../components/common/Button';
import TabBarItem from '../components/tabs/Tabs';
import TimelineList from '../components/calendar/TimelineList';
import theme from '../style/theme';

const ScrollTabs = require('react-native-scrollable-tab-view');
const IOS = Platform.OS === 'ios';
const VIEW_NAME = 'Program';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.dark,
  },
  loaderText: {
    color: '#aaa',
  },
  reloadButton: {
    marginTop: 20,
    width: 100,
    backgroundColor: theme.orange,
  },
  reloadButtonText: {
    fontSize: 30,
    color: theme.white,
    fontWeight: 'bold',
  },
});

class ProgramDayTabs extends Component {
  propTypes: {
    eventsFri: PropTypes.object.isRequired,
    eventsSat: PropTypes.object.isRequired,
    eventsFetchState: PropTypes.any,
  };

  componentDidMount() {
    this.fetchViewContent();
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  fetchViewContent() {
    // TODO: ...should these be throttled?
    this.props.fetchEvents();
  }

  renderLoadingView() {
    // TODO: platform-specific if-else
    return (
      <View style={styles.container}>
        <ActivityIndicator
          color={theme.blush}
          animating={true}
          style={{ alignItems: 'center', justifyContent: 'center', height: 80 }}
          size="large"
        />
        <Text style={styles.loaderText}>Loading events...</Text>
      </View>
    );
  }

  render() {
    switch (this.props.eventsFetchState) {
      case 'loading':
        return this.renderLoadingView();
      case 'failed':
        return (
          <View style={styles.container}>
            <Text style={styles.loaderText}>Could not get events :(</Text>
            <Button onPress={this.fetchViewContent} style={styles.reloadButton}>
              Reload
            </Button>
          </View>
        );
      default:
        return (
          <ScrollTabs
            initialPage={0}
            tabBarActiveTextColor={theme.blush}
            tabBarUnderlineColor={theme.blush}
            tabBarBackgroundColor={theme.dark}
            tabBarInactiveTextColor={theme.inactive}
            locked={false}
            prerenderingSiblingsNumber={1}
            renderTabBar={() => <TabBarItem height={40} />}
          >
            <TimelineList
              events={this.props.eventsFri}
              tabLabel="Fri"
              navigator={this.props.navigator}
            />
            <TimelineList
              events={this.props.eventsSat}
              tabLabel="Sat"
              navigator={this.props.navigator}
            />
          </ScrollTabs>
        );
    }
  }
}

const mapDispatchToProps = { fetchEvents };

const select = store => ({
  eventsFri: getEventsForDay('2018-06-08')(store),
  eventsSat: getEventsForDay('2018-06-09')(store),
  eventsFetchState: getEventListState(store),
});

export default connect(select, mapDispatchToProps)(ProgramDayTabs);
