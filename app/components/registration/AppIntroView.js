import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Modal,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalBox from 'react-native-modalbox';

import theme from '../../style/theme';

import Button from '../../components/common/Button';
import Text from '../../components/Text';
import AnimateMe from '../../components/AnimateMe';
import SkipView from './SkipView';
import IntroView from './IntroView';
import HeartPage from './HeartPage';

import { width, height, isIphoneX, IOS } from '../../services/device-info';
const heartPageShowTime = 5000;

class AppIntroView extends Component {
  constructor(props) {
    super(props);
    this.state = { showHeartPage: true };
    this.hideHeartPage = this.hideHeartPage.bind(this);
  }

  componentDidMount(){

    setTimeout(this.hideHeartPage, heartPageShowTime);
  }

  hideHeartPage(slideNo) {
    this.setState({ showHeartPage: false });
  }

  render() {
    const { openLoginView, onClose, isLoginFailed } = this.props;
    const { showHeartPage } = this.state;

    return (
      <ModalBox
        isOpen={true}
        swipeToClose={false}
        backdropPressToClose={false}
        animationDuration={0}
        style={{ backgroundColor: theme.black }}
      >

        {showHeartPage && !isLoginFailed && <HeartPage delay={heartPageShowTime} />}

        <View style={[styles.iconWrap, styles.backgroundFace]}>
          <Image
            style={[styles.subImage, { width, height: height / 2.5 }]}
            source={require('../../../assets/futupolis/face-fade.gif')}
          />
        </View>

        <View style={{ flex: 1, zIndex: 10 }}>
          <View style={[styles.slide, styles.slideIntro]}>
            <View style={styles.topArea}>
              {!showHeartPage && (
                <AnimateMe animationType="scale-fade-in" delay={800} duration={800}>
                  <View style={styles.iconWrap}>
                    <Image
                      style={[styles.subImage, styles.robotImage]}
                      source={require('../../../assets/futupolis/robot.png')}
                    />
                  </View>
                </AnimateMe>
              )}
            </View>
            <SkipView
              isLoginFailed={isLoginFailed}
              onPressProfileLink={() => {
                onClose();
                openLoginView();
              }}
            />
          </View>

        </View>
      </ModalBox>
    );
  }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: theme.transparent,
    padding: 0,
  },
  // Slide top
  slideIntro: {
    backgroundColor: theme.transparent,
    paddingTop: height / 2.3,
  },
  topArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.transparent,
    minHeight: height / 2,
    // alignItems: 'center',
    // justifyContent: 'flex-start',
  },
  iconWrap: {
    backgroundColor: theme.transparent,
    position: 'absolute',
    width: width,
    height: height / 2.5,
    left: 0,
    top: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundFace: {
    top: 0,
    height: height / 2.5 + 20,
  },
  subImage: {
    width: width - 200,
    height: width - 200,
    left: 0,
    bottom: 0,
    position: 'relative',
    zIndex: 2,
  },
  robotImage: {
    tintColor: theme.orange,
    top: isIphoneX ? -15 : -10,
    marginRight: -8,
    width: width - 200,
    height: isIphoneX ? width - 105 :  width - 150,
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
    // tintColor: theme.white,
    color: theme.blue2,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: IOS ? 90 : 60,
    left: IOS ? 140 : 135,
    top: IOS ? -5 : 10,
    position: 'absolute',
  },
});

export default AppIntroView;
