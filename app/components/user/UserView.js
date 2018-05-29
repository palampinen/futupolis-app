'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Platform,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserPicture,
  fetchUserImages,
  isLoadingUserImages,
} from '../../concepts/user';
import { getUserName, getUserId } from '../../concepts/registration';
import { openLightBox } from '../../concepts/lightbox';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';
import UserHero from './UserHero';

const headerImage = require('../../../assets/futupolis/face-fade.gif');
const { height, width } = Dimensions.get('window');


class UserView extends Component {
  render() {
    const {
      images,
      isLoading,
      userName,
      navigator,
      profilePicture,
    } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    const imagesCount = images.size;

    return (
      <View style={{ flex: 1, flexGrow: 1, backgroundColor: theme.dark }}>
        <UserHero
          userName={userName}
          userImage={profilePicture}
          renderContent={() => (
          <View style={styles.container}>
            {isLoading && (
              <View style={styles.loader}>
                <Loader size="large" />
              </View>
            )}
            {images.size > 0 && (
              <View style={styles.imageContainer}>
                {images.map(image => (
                  <View key={image.get('id')}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this.props.openLightBox(image.get('id'))}
                    >
                      <Image
                        key={image.get('id')}
                        style={{
                          height: width / 3 - 5,
                          width: width / 3 - 5,
                          margin: 2,
                          backgroundColor: theme.darker,
                          borderRadius: 3,
                        }}
                        source={{ uri: image.get('url') }}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            {!isLoading &&
              !images.size && (
                <View style={styles.imageTitleWrap}>
                  <Text style={styles.imageTitle}>No photos</Text>
                </View>
              )}
          </View>
        )} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark,
    minHeight: height / 2,
  },
  header: {
    flex: 1,
    elevation: 3,
    paddingTop: 30,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.white,
    marginBottom: 3,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
  },
  avatar: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 90,
    backgroundColor: theme.stable,
    borderRadius: 45,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: 60,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 0,
  },
  headerKpiTitle: {
    color: theme.blush,
    fontWeight: '500',
    fontSize: 11,
  },
  headerKpiValue: {
    fontSize: 26,
    color: theme.blush,
    fontWeight: '400',
  },
  loader: {
    marginTop: 50,
  },
  imageContainer: {
    margin: 1,
    marginTop: 2,
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  imageTitle: {
    textAlign: 'center',
    color: theme.grey,
    margin: 20,
    marginTop: 40,
    fontSize: 15,
    fontWeight: '600',
  },
  imageTitleWrap: {
    flex: 1,
    marginTop: 0,
  },
});

const mapDispatchToProps = { openLightBox, fetchUserImages };

const mapStateToProps = state => ({
  images: getUserImages(state),
  profilePicture: getUserPicture(state),
  isLoading: isLoadingUserImages(state),
  userId: getUserId(state),
  userName: getUserName(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
