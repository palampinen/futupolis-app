'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { connect } from 'react-redux';

import {
  getMyImages,
  fetchMyImages,
  isLoadingUserImages,
} from '../../concepts/user';
import { getUserName, getUserId } from '../../concepts/registration';
import { openLightBox } from '../../concepts/lightbox';
import { getCurrentTab } from '../../reducers/navigation';

import AnimateMe from '../AnimateMe';
import theme from '../../style/theme';
import Loader from '../common/Loader';
import { width, IOS } from '../../services/device-info';

class UserView extends Component {
  componentDidMount() {
    this.props.fetchMyImages();
  }

  componentWillReceiveProps({ tab }) {
    // Fetch on Settings tab
    if (tab !== this.props.tab && tab === 'SETTINGS') {
      this.props.fetchMyImages();
    }
  }

  render() {
    const { images, isLoading, userName } = this.props;

    let { user } = this.props.route ? this.props.route : { user: null };

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName };
    }

    return (
      <View style={styles.container}>
        {isLoading &&
          images.size === 0 && (
            <View style={styles.loader}>
              <Loader size="large" color={theme.orange} />
            </View>
          )}
        {images.size > 0 && (
          <AnimateMe style={{ flex: IOS ? 1 : 0 }} delay={300} animationType="fade-in">
            <View style={styles.imageContainer}>
              {images.map(image => (
                <View key={image.get('id')}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.props.openLightBox(image.get('id'))}
                  >
                    <Image
                      key={image.get('id')}
                      style={{
                        height: width / 3 - 7,
                        width: width / 3 - 7,
                        margin: 3,
                        backgroundColor: theme.darker,
                        borderRadius: 3,
                      }}
                      source={{ uri: image.get('url') }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </AnimateMe>
        )}
        {!isLoading &&
          !images.size && (
            <View style={styles.imageTitleWrap}>
              <Text style={styles.imageTitle}>No photos from you. Add first from Feed-tab.</Text>
            </View>
          )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.darker,
    padding: 0,
    paddingTop: 0,
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
    backgroundColor: theme.darker,
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

const mapDispatchToProps = { openLightBox, fetchMyImages };

const mapStateToProps = state => ({
  images: getMyImages(state),
  isLoading: isLoadingUserImages(state),
  userId: getUserId(state),
  userName: getUserName(state),
  tab: getCurrentTab(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
