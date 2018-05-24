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

import NotificationList from '../components/notification/NotificationList';
import TabBarItem from '../components/tabs/Tabs';
import ListItem from '../components/profile/ListItem';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

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
    name: PropTypes.string.isRequired,
    links: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchLinks();
  }

  @autobind
  renderItem(item, index) {
    return <ListItem index={index} item={item} navigator={this.props.navigator} currentTab={this.props.currentTab}  />;
  }

  @autobind
  renderContent() {
    const { name, links, user, profilePicture, logoutUser } = this.props;

    const listData = [].concat(links.toJS());

    return (
      <ScrollTabs
        initialPage={0}
        tabBarActiveTextColor={theme.blush}
        tabBarBackgroundColor={theme.dark}
        tabBarInactiveTextColor={theme.inactive}
        locked={IOS}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => <TabBarItem height={40} />}
      >
        <ScrollView tabLabel="Info" style={styles.scrollView}>
          <View style={styles.cardWrap}>
            {listData.map(this.renderItem)}
          </View>
        </ScrollView>
        <NotificationList tabLabel="Notifications" navigator={this.props.navigator} />
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

const mapDispatchToProps = { fetchLinks };

const select = store => ({
  links: store.profile.get('links'),
  currentTab: store.navigation.get('currentTab'),
});

export default connect(select, mapDispatchToProps)(Profile);
