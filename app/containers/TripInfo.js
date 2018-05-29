import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import ScrollTabs from 'react-native-scrollable-tab-view';

import theme from '../style/theme';
import { fetchLinks } from '../actions/profile';
import { changeTripTab } from '../actions/navigation';
import { getCurrentTab, getCurrentTripViewTab } from '../reducers/navigation';

import NotificationList from '../components/notification/NotificationList';
import TabBarItem from '../components/tabs/Tabs';
import ListItem from '../components/profile/ListItem';
import Tabs from '../constants/Tabs';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';
const TAB_ORDER = [Tabs.INFO, Tabs.NOTIFICATIONS];
const initialTabIndex = 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.darker,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.darker,
  },
  cardWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 30,
    backgroundColor: theme.darker,
  }
});

class Profile extends Component {
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    links: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchLinks();
  }

  @autobind
  onChangeTab({ ref }) {
    this.props.changeTripTab(ref.props.id);
  }

  @autobind
  renderItem(item, index) {
    return <ListItem
      index={index}
      item={item}
      key={item.id}
      navigator={this.props.navigator}
      currentTab={this.props.currentTab}
    />;
  }

  @autobind
  renderContent() {
    const { links, profilePicture, currentTripTab } = this.props;
    const listData = [].concat(links.toJS());

    let page = TAB_ORDER.indexOf(currentTripTab);
    if (page < 0) {
      page = initialTabIndex;
    }


    return (
      <ScrollTabs
        initialPage={initialTabIndex}
        page={page}
        onChangeTab={this.onChangeTab}
        tabBarActiveTextColor={theme.blush}
        tabBarBackgroundColor={theme.dark}
        tabBarInactiveTextColor={theme.inactive}
        locked={false}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => <TabBarItem height={40} />}
      >
        <ScrollView tabLabel="Info" style={styles.scrollView} id={Tabs.INFO}>
          <View style={styles.cardWrap}>
            {listData.map(this.renderItem)}
          </View>
        </ScrollView>
        <NotificationList
          tabLabel="News"
          navigator={this.props.navigator}
          id={Tabs.NOTIFICATIONS} />
      </ScrollTabs>
    );
  }

  render() {

    return (
      <View style={styles.container}>
        {this.renderContent()}
      </View>
    )
  }
}

const mapDispatchToProps = { fetchLinks, changeTripTab };

const select = store => ({
  links: store.profile.get('links'),
  currentTab: getCurrentTab(store),
  currentTripTab: getCurrentTripViewTab(store),
});

export default connect(select, mapDispatchToProps)(Profile);
