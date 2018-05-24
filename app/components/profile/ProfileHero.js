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

import {
  getMyImages,
  getMyTeam,
  getMyTotalSimas,
  getMyTotalVotes,
  fetchMyImages,
  isLoadingUserImages,
} from '../../concepts/user';
import {
  getUserName,
  getUserId,
  postProfilePicture,
  getUserPicture,
} from '../../concepts/registration';
import { openLightBox } from '../../concepts/lightbox';

import ImageCaptureOptions from '../../constants/ImageCaptureOptions';
import permissions from '../../services/android-permissions';
import { width, IOS } from '../../services/device-info';
import { getInitialLetters } from '../../services/user';
import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';
import Text from '../Text';
import RingLightImage from '../RingLight';

const avatarFilterImage = require('../../../assets/futupolis/film-filter.png');
const solidPattern = require('../../../assets/futupolis/solid.png');
const robot = require('../../../assets/futupolis/face-fade.gif');
const robotAvatar = require('../../../assets/futupolis/avatar--robot.png');

class ProfileHero extends Component {
  @autobind
  chooseImage() {
    // cancel action if already loading image
    if (this.props.isLoadingPicture) {
      return;
    }

    if (IOS) {
      this.openImagePicker();
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker();
        });
      });
    }
  }

  @autobind
  openImagePicker() {
    // Create selfie image capture options
    const selfieCaptureOptions = Object.assign({}, ImageCaptureOptions, {
      title: 'Change Avatar',
      maxWidth: 200,
      maxHeight: 200,
      cameraType: 'front',
      takePhotoButtonTitle: 'Take a selfie',
    });

    ImagePickerManager.showImagePicker(selfieCaptureOptions, response => {
      if (!response.didCancel && !response.error) {
        const image = 'data:image/jpeg;base64,' + response.data;
        this.props.postProfilePicture(image);
      }
    });
  }

  render() {
    const {
      images,
      isLoading,
      totalVotes,
      totalSimas,
      userTeam,
      userName,
      userImage,
      renderContent,
    } = this.props;

    let { user } = this.props.route ? this.props.route : { user: null };

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    const imagesCount = images.size;

    const avatarInitialLetters = getInitialLetters(user.name);

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

              {!!user.name && (
                <TouchableOpacity
                  onPress={this.openImagePicker}
                  style={styles.avatarChangeIconWrap}
                >
                  <View>
                    <Icon style={styles.avatarChangeIcon} name="camera-alt" />
                  </View>
                </TouchableOpacity>
              )}

              <AnimateMe delay={100} animationType="fade-from-bottom">
                <Text style={styles.headerTitle} bold>{user.name}</Text>
              </AnimateMe>
              {/*
              <View style={styles.headerKpis}>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? imagesCount : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>photos</Text>
                </View>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? totalVotes : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>votes for photos</Text>
                </View>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? totalSimas || '-' : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>simas</Text>
                </View>
              </View>
            */}
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
  editButton: {
    position: 'absolute',
    right: 20,
    top: 20,
  },
  editIcon: {
    color: theme.white,
    opacity: 0.9,
    fontSize: 25,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: IOS ? 10 : 20,
    marginTop: IOS ? 25 : 15,
  },
  headerKpiTitle: {
    color: theme.transparentLight,
    fontWeight: '500',
    fontSize: 11,
  },
  headerKpiValue: {
    fontSize: 26,
    color: theme.transparentLight,
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

const mapDispatchToProps = { openLightBox, postProfilePicture };

const mapStateToProps = createStructuredSelector({
  images: getMyImages,
  isLoading: isLoadingUserImages,
  userId: getUserId,
  userName: getUserName,
  userTeam: getMyTeam,
  userImage: getUserPicture,
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHero);
