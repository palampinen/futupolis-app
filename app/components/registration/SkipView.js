'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform, ScrollView, Dimensions } from 'react-native';
import theme from '../../style/theme';
import PlatformTouchable from '../../components/common/PlatformTouchable';
import Text from '../../components/Text';
import AnimateMe from '../../components/AnimateMe';

const { width, height } = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

class SkipView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1, width: null, height: null }}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>START JOURNEY</Text>
              <Text style={styles.text}>
                Login with your
                <Text bold> @futurice </Text>email address.
              </Text>
              {this.props.isLoginFailed &&
                <AnimateMe animationType="drop-in">
                  <Text style={styles.failureText}>Login failed, try again or contact futupolisapp@futurice.com</Text>
                </AnimateMe>
              }
            </View>
              <PlatformTouchable
                onPress={this.props.onPressProfileLink}
                background={IOS ? null : PlatformTouchable.SelectableBackgroundBorderless()}
              >
              <View style={styles.editButton}>
                <View style={{ flex: IOS ? 0 : 1}}>
                  <Text style={{ fontSize: 16, top: IOS ? 3 : 0, color: theme.darker }} bold>
                    LOGIN TO FUTUPOLIS
                  </Text>
                </View>
              </View>
              </PlatformTouchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.transparent,
  },
  content: {
    margin: 20,
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topArea: {
    backgroundColor: theme.transparent,
    height: height / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrap: {
    overflow: 'hidden',
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,.1)',
    left: width / 2 - 100,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    // width: 200,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 150,
    width: 150,
    height: 150,
    // tintColor: theme.blue2,
    color: theme.blue2,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 50,
    top: 30,
    position: 'absolute',
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 200,
    height: 200,
    bottom: 0,
    opacity: 0.3,
  },

  textContainer: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    color: theme.white,
    fontSize: 30,
    margin: 15,
    marginTop: 35,
    letterSpacing: 3,
    textAlign: 'center',
  },
  subTitle: {
    textAlign: 'center',
    color: theme.white,
    fontWeight: '600',
    fontSize: 16,
    margin: 15,
    marginTop: 30,
  },
  text: {
    marginTop: 35,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 20,
    color: theme.white,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 40,
    marginBottom: 10,
    padding: 5,
    paddingTop: 12,
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 10,
    borderWidth: 0,
    backgroundColor: theme.white,
    width: 250,
  },
  failureText: {
    color: theme.blush,
    textAlign: 'center',
    lineHeight: 17
  }
});

export default SkipView;
