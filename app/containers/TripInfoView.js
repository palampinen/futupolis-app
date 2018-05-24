import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';

import TripInfo from './TripInfo';
import sceneConfig from '../utils/sceneConfig';
import theme from '../style/theme';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: theme.dark,
  },
  navbar: {
    backgroundColor: theme.dark,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

var _navigator; // eslint-disable-line

class TripInfoView extends Component {
  @autobind
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />;
    }
  }

  render() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{
          component: TripInfo,
          name: 'Trip',
        }}
        renderScene={this.renderScene}
        configureScene={() => sceneConfig}
      />
    );
  }
}

export default TripInfoView;
