'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform, WebView, Linking } from 'react-native';
import theme from '../../style/theme';
import ScrollHeader from '../header/ScrollHeader';
import AnimateMe from '../AnimateMe';
const IOS = Platform.OS === 'ios';

class WebViewer extends Component {
  openLinksInBrowser = event => {
    const isClicked = event.navigationType === 'click';
    const isDifferentUrlAsLoaded = event.url !== this.props.route.url;
    if (isDifferentUrlAsLoaded && isClicked) {
      this.webview.stopLoading();
      Linking.openURL(event.url);
    }
  };

  render() {
    let { url, name } = this.props.route;

    if (IOS && url.indexOf('https') < 0) {
      url = 'https://crossorigin.me/' + url;
    }

    return (
      <View style={styles.container}>
        {!IOS && (
          <ScrollHeader
            extraStyles={styles.header}
            title={name}
            icon="arrow-back"
            onIconClick={() => this.props.navigator.pop()}
          />
        )}

        {url && (
          <AnimateMe animationType="small-slide-from-bottom" style={{ flex: 1 }} delay={300}>
            <WebView
              ref={ref => {
                this.webview = ref;
              }}
              source={{ uri: url }}
              scalesPageToFit={false}
              style={{ flex: 1, backgroundColor: theme.dark }}
              onNavigationStateChange={this.openLinksInBrowser}
            />
          </AnimateMe>
        )}
      </View>
    );
  }
}

WebViewer.propTypes = {
  url: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: IOS ? 10 : 52,
    backgroundColor: theme.dark,
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    elevation: 2,
    height: 56,
  },
});

export default WebViewer;
