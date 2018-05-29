'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';

import analytics from '../services/analytics';
import FeedTab from './FeedTab';
import theme from '../style/theme';

const VIEW_NAME = 'FeedView';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: 0,
    backgroundColor: theme.dark,
  },
});

class FeedView extends Component {
  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />;
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: theme.lightgrey }}>
        <Navigator
          style={styles.navigator}
          initialRoute={{
            component: FeedTab,
            name: 'Feed',
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromRight,
          })}
        />
      </View>
    );
  }
}

export default FeedView;
