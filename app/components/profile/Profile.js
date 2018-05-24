import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  ListView,
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

import theme from '../../style/theme';
import { fetchLinks } from '../../actions/profile';
import { getCurrentCityName } from '../../concepts/city';
import { logoutUser } from '../../concepts/auth';
import { getStoredUser, getUserPicture } from '../../concepts/registration';


import ProfileHero from './ProfileHero';
import TabBarItem from '../tabs/Tabs';
import MyImages from './MyImages';
import ListItem from './ListItem';
import TextLink from './TextLink';

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

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
    };
  }

  componentDidMount() {
    this.props.fetchLinks();
  }

  @autobind
  renderItem(item) {
    return <ListItem item={item} navigator={this.props.navigator}  />;
  }

  @autobind
  renderTextLink(item) {
    return <TextLink item={item} navigator={this.props.navigator}  />;
  }

  @autobind
  renderContent() {
    const { name, links, terms, cityName, user, profilePicture, logoutUser } = this.props;

    const listData = [].concat(links.toJS());


    const logoutItem = {
      title: 'Logout from App',
      onPress: () => logoutUser(),
      icon: 'exit-to-app',
      separatorAfter: true,
      id: 'logout',
    };
    const termsLinks = [].concat(terms.toJS());
    termsLinks.push(logoutItem)

    return (
      <ScrollTabs
        initialPage={0}
        tabBarActiveTextColor={theme.blush}
        tabBarBackgroundColor={theme.dark}
        tabBarInactiveTextColor={theme.inactive}
        locked={IOS}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => <TabBarItem height={50} />}
      >
        <MyImages tabLabel="Photos" />
        <View tabLabel="Settings" style={styles.scrollView}>
          <View style={styles.cardWrap}>
            {/*listData.map(this.renderItem)*/}
            {termsLinks.map(this.renderTextLink)}
          </View>
        </View>
      </ScrollTabs>
    );
  }

  render() {

    return (
      <View style={styles.container}>
        <ProfileHero renderContent={this.renderContent} />
      </View>
    )
  }
}

const mapDispatchToProps = { fetchLinks, logoutUser };

const select = store => ({
  selectedTeam: store.registration.get('selectedTeam'),
  teams: store.team.get('teams'),
  name: store.registration.get('name'),
  links: store.profile.get('links'),
  terms: store.profile.get('terms'),
  cityName: getCurrentCityName(store),
  user: getStoredUser(store),
  profilePicture: getUserPicture(store),
});

export default connect(select, mapDispatchToProps)(Profile);
