'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { get } from 'lodash';
import { connect } from 'react-redux';

import sceneConfig from '../utils/sceneConfig';
import NavRouteMapper from '../components/common/navbarRouteMapper';
import errorAlert from '../utils/error-alert';

import { isUserLoggedIn } from '../concepts/registration';
import { isLoadingAppAuth } from '../concepts/auth';
import { getCityPanelShowState } from '../concepts/city';
import IOSTabNavigation from './Navigation';
import RegistrationView from '../components/registration/RegistrationView';
import TextActionView from '../components/actions/TextActionView';
import { isIphoneX } from '../services/device-info';

const theme = require('../style/theme');

class MainView extends Component {
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={navigator} route={route} {...this.props} />;
    }
  }

  render() {
    const { showCitySelection, isUserLogged, isLoginLoading, errors, dispatch } = this.props;
    const showUserLoginView = !isUserLogged || isLoginLoading;

    const immutableError = errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      return errorAlert(dispatch, get(error, 'header'), get(error, 'message'));
    }

    if (showUserLoginView) {
      return <RegistrationView />;
    }

    return (
      <View style={{ flex: 1 }}>
        <Navigator
          style={styles.navigator}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navbar}
              routeMapper={NavRouteMapper(this.props)}
            />
          }
          initialRoute={{
            component: IOSTabNavigation,
            name: 'Futupolis',
          }}
          renderScene={this.renderScene}
          configureScene={() => sceneConfig}
        />

        <TextActionView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    paddingTop: isIphoneX ? 57 : 42,
    paddingBottom: 0,
    backgroundColor: theme.dark,
  },
  navbar: {
    backgroundColor: theme.dark,
    height: 62,
    paddingBottom: 5,
    top: isIphoneX ? 15 : 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const select = state => ({
  showCitySelection: getCityPanelShowState(state),
  errors: state.errors,
  currentTab: state.navigation.get('currentTab'),
  isLoginLoading: isLoadingAppAuth(state),
  isUserLogged: isUserLoggedIn(state),
});

export default connect(select)(MainView);
