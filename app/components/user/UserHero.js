'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { cloneDeep } from 'lodash';
import autobind from 'autobind-decorator';
import ImagePickerManager from 'react-native-image-picker';
import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { openLightBox } from '../../concepts/lightbox';
import { width, IOS } from '../../services/device-info';
import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';
import Text from '../Text';

const avatarFilterImage = require('../../../assets/futupolis/film-filter.png');
const solidPattern = require('../../../assets/futupolis/solid.png');
const robot = require('../../../assets/futupolis/face-fade.gif');
const robotAvatar = require('../../../assets/futupolis/avatar--robot.png');

class UserProfileHero extends Component {
  render() {
    const {
      userName,
      userImage,
      renderContent,
    } = this.props;

    let { user } = this.props.route ? this.props.route : { user: null };

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    return (
      <View style={{ flex: 1 }}>
        <ParallaxView
          backgroundSource={solidPattern}
          windowHeight={250}
          style={{ backgroundColor: theme.darker, shadowOpacity: 0 }}
          scrollableViewStyle={{ shadowColor: theme.transparent }}
          header={
            <View style={styles.header}>
              <Image
                resizeMode={userImage ? 'cover' : 'contain'}
                source={userImage ? { uri: userImage } : robotAvatar}
                style={userImage ? styles.userStyles : styles.placeholderAvatarStyles}
              />
              <Image
                source={avatarFilterImage}
                resizeMode="contain"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.25,
                }}
              />
              <AnimateMe delay={100} animationType="fade-from-bottom">
                <Text style={styles.headerTitle} bold>{user.name}</Text>
              </AnimateMe>


              {!IOS && (
                <View style={styles.backLink}>
                  <TouchableHighlight
                    onPress={() => navigator.pop()}
                    style={styles.backLinkText}
                    underlayColor={'rgba(255, 255, 255, .1)'}
                  >
                    <Icon name="arrow-back" size={28} style={styles.backLinkIcon} />
                  </TouchableHighlight>
                </View>
              )}

            </View>
          }
        >
          <View style={styles.container}>{renderContent()}</View>
        </ParallaxView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.darker,
  },
  header: {
    flex: 1,
    paddingBottom: 15,
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    paddingHorizontal: 15,
    textAlign: 'left',
    color: theme.white,
    backgroundColor: 'transparent',
  },
  avatar: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 84,
    height: 84,
    backgroundColor: theme.stable,
    borderRadius: 44,
    borderWidth: 0,
    borderColor: theme.white,
  },
  profilePic: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.secondary,
    fontSize: 60,
  },
  avatarInitials: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 3,
    backgroundColor: theme.transparent,
    color: theme.secondary,
  },
  avatarChangeIconWrap: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: 'rgba(30,30,30,.25)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  avatarTextChangeIconWrap: {},
  avatarChangeIcon: {
    color: theme.white,
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  userStyles: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -20,
    top: -20,
    opacity: 1,
  },
  placeholderAvatarStyles: {
    position: 'absolute',
    left: (width/2)-150,
    width: 300,
    height: 300,
    top: -30,
    right: 0,
  },
  loader: {
    marginTop: 50,
  },
  backLink: {
    position: 'absolute',
    left: 7,
    top: 7,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.transparent,
  },
  backLinkIcon: {
    color: theme.orange,
  },
});

const mapDispatchToProps = { openLightBox };

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileHero);
