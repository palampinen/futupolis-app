'use strict';

import React, { Component } from 'react';
import { View, Switch, StyleSheet, TextInput, Platform, Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../Text';
import theme from '../../../style/theme';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  postSettings: {
    backgroundColor: theme.darker,

    height: IOS ? 150 : 140,
    padding: 20,
    paddingBottom: 10,
    paddingTop: IOS ? 30 : 20,
    marginBottom: 0,
  },
  settingsRow: {
    minHeight: 45,
    flex: 1,
    flexDirection: 'row',
    alignItems: IOS ? null : 'center',
    justifyContent: 'space-between',
  },
  settingsRowComplex: {
    alignItems: 'center',
  },
  settingsRowTitle: {
    flexDirection: 'row',
  },
  settingsRowTitleTextWrap: {
    flexDirection: 'column',
  },
  settingsRowTitleText: {
    fontWeight: 'normal',
    color: theme.white,
    marginTop: IOS ? 7 : 5,
  },
  smaller: {
    fontSize: 11,
    color: '#bbb',
  },
  settingsRowIcon: {
    color: theme.mellow,
    fontSize: 22,
    top: 2,
    marginRight: 13,
    marginLeft: -5,
  },
  inputField: {
    color: theme.white,
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
    padding: 0,
    paddingTop: IOS ? 0 : 2,
    width: width - 60,
    minHeight: 50,
    fontSize: 14,
  },
});

class PostSettings extends Component {
  render() {
    const {
      onChangeImageText,
      imageText,
      postLocationStatus,
      togglePostLocationStatus,
    } = this.props;

    return (
      <View style={styles.postSettings}>
        <View style={[styles.settingsRow, { marginBottom: 10 }]}>
          <View style={styles.settingsRowTitle}>
            <Icon style={styles.settingsRowIcon} name="text-fields" />
          </View>
          <TextInput
            multiline={true}
            autoCorrect={false}
            autoCapitalize={'none'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={styles.inputField}
            onChangeText={onChangeImageText}
            value={imageText}
            placeholder={'Write a caption...'}
            placeholderTextColor={'#aaa'}
            underlineColorAndroid={'transparent'}
          />
        </View>
        <View style={[styles.settingsRow, styles.settingsRowComplex]}>
          <View style={styles.settingsRowTitle}>
            <Icon style={styles.settingsRowIcon} name="location-on" />
            <View style={styles.settingsRowTitleTextWrap}>
              <View>
                <Text style={styles.settingsRowTitleText}>Show Post on Map</Text>
              </View>
            </View>
          </View>
          <Switch
            onTintColor={IOS ? theme.orange : theme.blush}
            thumbTintColor={IOS ? null : theme.orange}
            value={postLocationStatus}
            onValueChange={togglePostLocationStatus}
          />
        </View>
      </View>
    );
  }
}

export default PostSettings;
