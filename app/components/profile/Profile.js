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

import theme from '../../style/theme';
import { fetchLinks } from '../../actions/profile';
import { logoutUser } from '../../concepts/auth';
import { getStoredUser, getUserPicture } from '../../concepts/registration';

import ProfileHero from './ProfileHero';
import TabBarItem from '../tabs/Tabs';
import MyImages from './MyImages';
import TextLink from './TextLink';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.darker,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.darker,
    paddingTop: IOS ? 0 : 1,
  },
  cardWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 30,
    paddingBottom: 30,
    backgroundColor: theme.darker,
  },
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
  renderTextLink(item) {
    return <TextLink item={item} navigator={this.props.navigator} key={item.id} />;
  }

  @autobind
  renderContent() {
    const { name, links, terms, user, profilePicture, logoutUser } = this.props;

    const listData = [].concat(links.toJS());

    const logoutItem = {
      title: 'Logout from App',
      onPress: () => logoutUser(),
      icon: 'exit-to-app',
      separatorAfter: true,
      id: 'logout',
    };
    const termsLinks = [].concat(terms.toJS());
    termsLinks.push(logoutItem);

    return (
      <ScrollTabs
        initialPage={0}
        tabBarActiveTextColor={theme.blush}
        tabBarBackgroundColor={theme.dark}
        tabBarInactiveTextColor={theme.inactive}
        prerenderingSiblingsNumber={0}
        locked={false}
        renderTabBar={() => <TabBarItem height={52} />}
      >
        <MyImages tabLabel="Photos" />
        <View tabLabel="Settings" style={styles.scrollView}>
          <View style={styles.cardWrap}>{termsLinks.map(this.renderTextLink)}</View>
        </View>
      </ScrollTabs>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ProfileHero renderContent={this.renderContent} />
      </View>
    );
  }
}

const mapDispatchToProps = { fetchLinks, logoutUser };

const select = store => ({
  name: store.registration.get('name'),
  links: store.profile.get('links'),
  terms: store.profile.get('terms'),
  user: getStoredUser(store),
  profilePicture: getUserPicture(store),
});

export default connect(
  select,
  mapDispatchToProps
)(Profile);
