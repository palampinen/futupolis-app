'use strict';

import React, { Component } from 'react';
import {
  View,
  Animated,
  Image,
  StyleSheet,
  Easing,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';

import theme from '../../style/theme';
import Text from '../Text';

import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class InstructionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springAnim: new Animated.Value(0),
    };
  }

  handlePress(id) {
    this.props.onSelect(id);

    this.state.springAnim.setValue(0);
    Animated.timing(this.state.springAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.elastic(1),
    }).start();
  }

  render() {
    const containerStyles = [styles.container, styles.modalBackgroundStyle];
    const { springAnim } = this.state;

    const active = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });
    const unactive = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 1] });

    return (
      <View style={containerStyles}>
        <View style={styles.topArea}>
          {/*
          <View style={styles.iconWrap}>
            <Image
              style={styles.subImage}
              // source={require('../../../assets/futupolis/robot.png')}
              source={require('../../../assets/futupolis/face-fade.gif')}
              resizeMode="contain"
            />
          </View>
        */}
        </View>

        <ScrollView style={{ flex: 1, width: null, height: null }}>
          <View style={styles.container}>
            <View style={styles.bottomArea}>
              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>FUTUPOLIS</Text>
                  <Text style={styles.subTitle}>
                    The Mediator between head and hands must be the heart
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.transparent,
    alignSelf: 'stretch',
  },
  area: {
    alignItems: 'stretch',
  },
  topArea: {
    paddingTop: 30,
    backgroundColor: theme.transparent,
    minHeight: height / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomArea: {
    flex: 1,
  },
  iconWrap: {
    position: 'absolute',
    width: width,
    height: IOS ? 190 : height / 2.5,
    borderRadius: IOS ? 95 : 105,
    left: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 190,
    width: 190,
    height: 190,
    color: theme.white,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 40,
    top: 10,
    position: 'absolute',
  },
  subImage: {
    width: width,
    height: height / 2.5,
    position: 'relative',
    zIndex: 2,
    // tintColor: theme.orange,
  },
  accentImage: {
    width: 40,
    height: 25,
    left: 5,
    top: 55,
    position: 'absolute',
    zIndex: 1,
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 190,
    height: 190,
    borderRadius: 95,
    bottom: 0,
    opacity: 0.01,
  },
  content: {
    margin: 20,
    marginTop: 0,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
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
    color: theme.white,
    fontSize: 16,
    lineHeight: 22,
    margin: 15,
    marginTop: 25,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 18,
    marginTop: 40,
    color: theme.blue1,
    textAlign: 'center',
  },
  cities: {
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 50,
  },
  touchable: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  circle: {
    flex: 1,
    backgroundColor: theme.secondary,
    padding: 12,
    paddingTop: 16,
    borderWidth: 2,
    borderColor: theme.white,
    alignItems: 'center',
    borderRadius: 50,
  },
  cityIcon: {
    width: 40,
    height: 40,
    zIndex: 4,
  },
  cityText: {
    fontSize: 12,
    color: theme.white,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  activeCityText: {
    color: theme.accentLight,
  },
  cityTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checked: {
    zIndex: 2,
    position: 'absolute',
    bottom: 5,
    right: 35,
    fontSize: 25,
    color: theme.accentLight,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bottomButtons: {
    flex: 1,
    flexDirection: 'column',
    margin: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    height: 50,
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalButton: {
    borderRadius: 0,
    flex: 1,
    marginLeft: 0,
  },
});

export default InstructionView;
