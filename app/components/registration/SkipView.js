'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

import theme from '../../style/theme';
import PlatformTouchable from '../common/PlatformTouchable';
import Text from '../Text';
import AnimateMe from '../AnimateMe';
import Terms from '../terms/Terms';
import { width, height, isSmall, IOS } from '../../services/device-info';

class SkipView extends Component {
  constructor(props) {
    super(props);

    this.state = { showTerms: false };
  }
  render() {
    const { showTerms } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1, width: null, height: null }}>
          <View style={styles.content}>
            <View style={styles.textContent}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>START JOURNEY</Text>
                <Text style={styles.text}>
                  Login with your
                  <Text bold> @futurice </Text>email
                </Text>
                {this.props.isLoginFailed &&
                  <AnimateMe animationType="drop-in">
                    <Text style={styles.failureText}>Login failed, try again or contact futupolisapp@gmail.com</Text>
                  </AnimateMe>
                }


              </View>
                <PlatformTouchable
                  onPress={this.props.onPressProfileLink}
                  background={IOS ? null : PlatformTouchable.SelectableBackgroundBorderless()}
                >
                <View style={styles.loginButton}>
                  <View style={{ flex: IOS ? 0 : 1}}>
                    <Text style={{ fontSize: 16, top: IOS ? 3 : 0, color: theme.darker }} bold>
                      LOGIN TO FUTUPOLIS
                    </Text>
                  </View>
                </View>
                </PlatformTouchable>
            </View>

            <View style={styles.termsLinkWrap}>
              <Text style={styles.termsText}>By logging in you accept</Text>
              <TouchableOpacity onPress={() => this.setState({ showTerms: !showTerms})}>
                <Text style={styles.termsLink}>Terms of Service</Text>
              </TouchableOpacity>
            </View>

            {showTerms &&
              <AnimateMe animationType="fade-in">
                <Terms backgroundColor={theme.black} />
              </AnimateMe>
            }
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
    paddingBottom: 25,
    flex: 1,
  },
  textContent: {
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
    fontSize: 28,
    marginBottom: isSmall ? 5 : 15,
    marginTop: isSmall ? 25 : 35,
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
    marginTop: 20,
    marginBottom: isSmall ? 15 : 25,
    fontSize: 16,
    lineHeight: 20,
    color: theme.white,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: isSmall ? 20 : 30,
    marginBottom: 20,
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
  },
  termsLinkWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    color: theme.stable,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 17
  },
  termsLink: {
    fontSize: 12,
    lineHeight: 17,
    color: theme.stable,
    textDecorationLine: 'underline',
    textDecorationColor: theme.stable,
  }
});

export default SkipView;
