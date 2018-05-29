'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Platform,
  PropTypes,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';
import autobind from 'autobind-decorator';

import _ from 'lodash';
import moment from 'moment';

import analytics from '../../services/analytics';
import location from '../../services/location';
import theme from '../../style/theme';
import EventListItem from './EventListItem';
import EventDetail from './EventDetailView';
import Text from '../Text';
import Button from '../common/Button';
import TabBarItem from '../tabs/Tabs';

const ScrollTabs = require('react-native-scrollable-tab-view');
const IOS = Platform.OS === 'ios';
const VIEW_NAME = 'Program';
const PAST_EVENTS_SECTION = 'past_events';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.black,
  },
  loaderText: {
    color: '#aaa',
  },
  reloadButton: {
    marginTop: 20,
    width: 100,
  },
  reloadButtonText: {
    fontSize: 30,
    color: theme.secondary,
    fontWeight: 'bold',
  },
  listView: {
    flexGrow: 1,
    paddingTop: 0,
    backgroundColor: theme.dark,
  },
  sectionHeader: {
    backgroundColor: IOS ? theme.dark : 'transparent',
    opacity: IOS ? 1 : 1,
    padding: IOS ? 15 : 35,
    paddingLeft: 15,
    flexGrow: 1,
  },
  sectionHeaderAnnouncement: {
    backgroundColor: IOS ? theme.dark : 'transparent',
    marginTop: 0,
    padding: IOS ? 20 : 15,
    flexGrow: 1,
  },
  sectionHeaderAnnouncementText: {
    backgroundColor: 'transparent',
    color: theme.white,
  },
  sectionHeaderText: {
    textAlign: 'left',
    fontWeight: 'normal',
    fontSize: IOS ? 16 : 16,
    top: IOS ? 5 : 0,
    color: theme.white,
  },
});

const AnimatedListView = Animated.createAnimatedComponent(ListView);
class TimelineList extends Component {
  propTypes: {
    announcements: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
    eventsFetchState: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      yOffset: new Animated.Value(0),
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
    };
  }

  componentWillReceiveProps({ events }) {
    if (events === this.props.events) {
      return;
    }

    this.updateListItems(events);
  }

  componentDidMount() {
    this.updateListItems(this.props.events);
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  navigateToSingleEvent(model, rowId) {
    const startDay = moment(model.startTime).format('ddd D.M.');

    this.props.navigator.push({
      showName: true,
      component: EventDetail,
      name: '',
      rowId,
      model,
    });
  }

  updateListItems(eventsData) {
    const now = moment();
    let events = eventsData
      .map(item => {
        item.set('timelineType', 'event');
        return item;
      })
      .toJS();

    let listSections = _.groupBy(events, event =>
      moment(event.startTime)
        .startOf('day')
        .unix()
    );

    // Set flag for last of day if more than one event
    _.map(listSections || [], eventsPerDay => {
      if (eventsPerDay.length > 1) {
        eventsPerDay[eventsPerDay.length - 1].lastOfDay = true;
      }
    });

    const eventSectionsOrder = _.orderBy(_.keys(listSections));

    let listOrder = [...eventSectionsOrder];

    this.setState({
      dataSource: this.state.dataSource.cloneWithRowsAndSections(listSections, listOrder),
    });
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

  renderSectionHeader() {
    return null;
  }

  @autobind
  renderListItem(item, sectionId, rowId) {
    /*
    const currentDistance =
      item.location.latitude !== 0 && item.location.longitude !== 0
        ? location.getDistance(this.props.userLocation, item.location)
        : null;
    */
    return (
      <EventListItem
        item={item}
        rowId={+rowId}
        pastEvent={sectionId === PAST_EVENTS_SECTION}
        currentDistance={null}
        handlePress={() => this.navigateToSingleEvent(item, rowId)}
        scrollPos={this.state.yOffset}
      />
    );
  }

  render() {
    return (
      <AnimatedListView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.yOffset } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        enableEmptySections={true}
        dataSource={this.state.dataSource}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderListItem}
        style={styles.listView}
      />
    );
  }
}

export default TimelineList;
