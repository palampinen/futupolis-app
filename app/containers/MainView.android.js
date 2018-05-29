'use strict';

import React, { Component } from 'react';
import { View, StatusBar, BackHandler } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';

import _ from 'lodash';
import { connect } from 'react-redux';

import { isUserLoggedIn } from '../concepts/registration';
import { isLoadingAppAuth } from '../concepts/auth';
import AndroidTabNavigation from './Navigation';
import RegistrationView from '../components/registration/RegistrationView';
import TextActionView from '../components/actions/TextActionView';
import errorAlert from '../utils/error-alert';

const theme = require('../style/theme');

let _navigator;
BackHandler.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class MainView extends Component {
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={_navigator} route={route} {...this.props} />;
    }
  }

  render() {
    const immutableError = this.props.errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      return errorAlert(this.props.dispatch, _.get(error, 'header'), _.get(error, 'message'));
    }

    const { isUserLogged, isLoginLoading } = this.props;
    const showUserLoginView = !isUserLogged || isLoginLoading;

    if (showUserLoginView) {
      return <RegistrationView />;
    }

    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor={theme.darker} barStyle="light-content" />

        <Navigator
          initialRoute={{
            component: AndroidTabNavigation,
            name: 'Futupolis',
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromBottomAndroid,
          })}
        />
        <TextActionView />
      </View>
    );
  }
}

const select = state => ({
  errors: state.errors,
  isLoginLoading: isLoadingAppAuth(state),
  isUserLogged: isUserLoggedIn(state),
});

export default connect(select)(MainView);
