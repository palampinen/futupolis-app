'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  TextInput,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import Text from '../../components/Text';
import InstructionView from './InstructionView';
import SkipView from './SkipView';
import IntroView from './IntroView';
import Team from './Team';
import Toolbar from './RegistrationToolbar';
import {
  putUser,
  reset,
  dismissIntroduction,
  openRegistrationView,
  closeRegistrationView,
  isUserLoggedIn,
} from '../../concepts/registration';
import { openLoginView, isLoadingAppAuth, isLoginFailed as _isLoginFailed } from '../../concepts/auth';
import { setCity, getCityIdByTeam, getCityId } from '../../concepts/city';
import * as keyboard from '../../utils/keyboard';
import LoginLoader from './LoginLoader';
import AppIntroView from './AppIntroView';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class RegistrationView extends Component {
  propTypes: {
    isRegistrationViewOpen: PropTypes.bool.isRequired,
    isRegistrationInfoValid: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedCity: props.selectedCityId || 2,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isRegistrationViewOpen && this.props.isRegistrationInfoValid) {
        this.onCloseProfileEditor();
        return true;
      }
      return false;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isRegistrationViewOpen && nextProps.isRegistrationViewOpen) {
      const startingSelectedCity = nextProps.isRegistrationInfoValid
        ? nextProps.selectedCityId
        : nextProps.viewCityId;

      this.setState({ selectedCity: startingSelectedCity || 2 });
    }
  }

  @autobind
  onRegister() {
    this.props.putUser();
  }

  @autobind
  onDismissIntroduction() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.dismissIntroduction();
  }

  @autobind
  onClose() {
    this.props.reset();
    this.props.setCity(this.state.selectedCity);
    this.props.dismissIntroduction();
    this.props.closeRegistrationView();
  }

  @autobind
  onCloseProfileEditor() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.closeRegistrationView();
  }

  render() {
    const { isLoginLoading, isLoginFailed } = this.props;
    return (isLoginLoading) ? (
      <LoginLoader />
    ) : (
      <AppIntroView
        onClose={this.onClose}
        isLoginFailed={isLoginFailed}
        openLoginView={this.props.openLoginView} />
    );
  }
}

const mapDispatchToProps = {
  putUser,
  reset,
  setCity,
  dismissIntroduction,
  openRegistrationView,
  openLoginView,
  closeRegistrationView,
};

const select = store => {
  return {
    isIntroductionDismissed: store.registration.get('isIntroductionDismissed'),
    isRegistrationViewOpen: store.registration.get('isRegistrationViewOpen'),
    selectedCityId: getCityIdByTeam(store),
    viewCityId: getCityId(store),
    isRegistrationInfoValid:
      !!store.registration.get('name') && !!store.registration.get('selectedTeam'),
    isUserLogged: isUserLoggedIn(store),
    isLoginFailed: _isLoginFailed(store),
    isLoginLoading: isLoadingAppAuth(store),
  };
};

export default connect(select, mapDispatchToProps)(RegistrationView);
