'use strict';
import React, { Component } from 'react';
import { View, StyleSheet, BackHandler, Modal } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { getSingleNotification, closeNotificationItem } from '../concepts/notifications';

import { isIphoneX, IOS } from '../services/device-info';
import PlatformTouchable from '../components/common/PlatformTouchable';
import AnimateMe from '../components/AnimateMe';
import Text from '../components/Text';
import SingleNotification from '../components/notification/SingleNotification';
import theme from '../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

class PopupInfo extends Component {
  render() {
    const { popupInfoItem } = this.props;

    if (!popupInfoItem) {
      return null;
    }

    return (
      <Modal
        onRequestClose={this.onClose}
        visible={true}
        backButtonClose={true}
        style={styles.modal}
        transparent={true}
        animationType={'fade'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <PlatformTouchable
              onPress={this.props.closeNotificationItem}
              background={!IOS ? PlatformTouchable.SelectableBackgroundBorderless() : null}
              delayPressIn={0}
            >
              <View style={styles.button}>
                <Icon name="close" style={styles.buttonIcon} />
              </View>
            </PlatformTouchable>

            <AnimateMe animationType="new-notification" infinite duration={400}>
              <Text style={styles.title}>📣 New Notification 📣</Text>
            </AnimateMe>

            <View style={{ width: 50 }} />
          </View>

          <SingleNotification
            notification={popupInfoItem}
            noHeader
            navigator={this.props.navigator}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.dark,
  },
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.dark,
  },
  header: {
    position: 'relative',
    left: 0,
    top: 0,
    right: 0,
    padding: 0,
    paddingTop: IOS ? (isIphoneX ? 30 : 20) : 0,
    height: IOS ? (isIphoneX ? 80 : 70) : 56,
    zIndex: 99,
    backgroundColor: theme.dark,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: theme.orange,
    fontSize: 17,
    top: 2,
  },
  button: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    top: 0,
  },
  buttonIcon: {
    color: theme.white,
    fontSize: 22,
  },
});

const select = store => ({
  popupInfoItem: getSingleNotification(store),
});

const mapDispatch = { closeNotificationItem };

export default connect(
  select,
  mapDispatch
)(PopupInfo);
