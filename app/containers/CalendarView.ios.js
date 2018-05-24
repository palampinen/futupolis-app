'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';

import sceneConfig from '../utils/sceneConfig';

import ProgramDayTabs from './ProgramDayTabs';
const theme = require('../style/theme');

const styles = StyleSheet.create({
  navigator: {
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: theme.black,
  },
});

class TimelineListWrapper extends Component {
  @autobind
  renderScene(route, navigator) {
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
          component: ProgramDayTabs,
          name: 'Events',
        }}
        renderScene={this.renderScene}
        configureScene={() => sceneConfig}
      />
    );
  }
}

export default TimelineListWrapper;
