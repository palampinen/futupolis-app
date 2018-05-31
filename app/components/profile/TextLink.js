import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import feedback from '../../services/feedback';
import Text from '../Text';
import WebViewer from '../webview/WebViewer';
import AnimateMe from '../AnimateMe';
import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class TextLink extends Component {
  @autobind
  onLinkPress(url, text, openInWebview) {
    if (!url) {
      return;
    }
    if (!openInWebview) {
      Linking.openURL(url);
    } else {
      this.props.navigator.push({
        component: WebViewer,
        showName: true,
        name: text,
        url: url,
      });
    }
  }

  @autobind
  renderLinkItem(item, index) {
    const linkItemStyles = [];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    if (item.last) {
      linkItemStyles.push(styles.listItemLast);
    }

    return (
      <View style={styles.listItemButton}>
        <PlatformTouchable
          key={index}
          underlayColor={'#eee'}
          activeOpacity={0.6}
          delayPressIn={0}
          onPress={() =>
            item.mailto
              ? feedback.sendEmail(item.mailto)
              : this.onLinkPress(item.link, item.title, item.showInWebview)
          }
        >
          <View style={linkItemStyles}>
            <View style={styles.listItem}>
              <View style={styles.listItemIcons}>
                <Icon style={styles.listItemIcon} name={item.icon} />
              </View>

              <View style={styles.listItemTitles}>
                <Text style={styles.listItemText}>{item.title}</Text>
                {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
              </View>
              {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
            </View>
          </View>
        </PlatformTouchable>
      </View>
    );
  }

  @autobind
  renderComponentItem(item, index) {
    const linkItemStyles = [];
    const { navigator } = this.props;
    const { component, title } = item;

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    return (
      <View style={styles.listItemButton}>
        <PlatformTouchable
          key={index}
          underlayColor={'#eee'}
          activeOpacity={0.6}
          delayPressIn={0}
          onPress={() => navigator.push({ name: title, component, showName: true })}
        >
          <View style={linkItemStyles}>
            <View style={styles.listItem}>
              <View style={styles.listItemIcons}>
                <View style={styles.listItemIconWrap}>
                  <Icon style={styles.listItemIcon} name={item.icon} />
                </View>
              </View>
              <View style={styles.listItemTitles}>
                <Text style={styles.listItemText}>{item.title}</Text>
                {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
              </View>
              {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
            </View>
          </View>
        </PlatformTouchable>
      </View>
    );
  }

  @autobind
  renderCustomItem(item, index) {
    const linkItemStyles = [];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    if (item.last) {
      linkItemStyles.push(styles.listItemLast);
    }

    return (
      <View style={styles.listItemButton}>
        <PlatformTouchable
          key={index}
          underlayColor={'#eee'}
          activeOpacity={0.6}
          delayPressIn={0}
          onPress={item.onPress}
        >
          <View style={linkItemStyles}>
            <View style={styles.listItem}>
              <View style={styles.listItemIcons}>
                <View style={styles.listItemIconWrap}>
                  <Icon style={styles.listItemIcon} name={item.icon} />
                </View>
              </View>
              <View style={styles.listItemTitles}>
                <Text style={styles.listItemText}>{item.title}</Text>
                {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
              </View>
              {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
            </View>
          </View>
        </PlatformTouchable>
      </View>
    );
  }

  render() {
    const { item } = this.props;

    if (item.hidden) {
      return null;
    }

    const key = item.id || item.title;
    if (item.onPress) {
      return this.renderCustomItem(item, key);
    } else if (item.component) {
      return this.renderComponentItem(item, key);
    } else if (item.link || item.mailto) {
      return this.renderLinkItem(item, key);
    }

    return null;
  }
}

const styles = StyleSheet.create({
  listItem: {
    flex: IOS ? 1 : 0,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: IOS ? theme.dark : theme.transparent,
    borderRadius: 5,
    overflow: 'hidden',
  },
  heroItem: {
    height: IOS ? 180 : 190,
    marginBottom: 0,
    flex: 0,
    width,
    margin: 0,
  },
  listItemSeparator: {},
  listItemButton: {
    backgroundColor: IOS ? theme.transparent : theme.dark,
    padding: 0,
    width: width - 10,
    margin: 5,
    marginBottom: 0,
    borderRadius: 5,
  },
  listItemIcons: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.transparent,
    marginRight: 15,
  },
  listItemIconWrap: {
    marginBottom: 0,
  },
  listItemIcon: {
    fontSize: 30,
    color: theme.blush,
    alignItems: 'center',
  },

  subIconWrap: {
    position: 'absolute',
    right: 0,
    top: 10,
  },
  subIcon: {
    opacity: 0.75,
    color: theme.white,
    fontSize: 30,
  },
  listItemSubtitle: {
    textAlign: 'center',
    color: theme.inactive,
    top: 1,
    fontSize: 11,
  },

  listItemText: {
    color: theme.white,
    textAlign: 'center',
    fontSize: 14,
    marginTop: IOS ? 5 : 0,
  },
  listItemText__highlight: {
    color: theme.blue2,
    fontWeight: 'bold',
    backgroundColor: theme.transparent,
    padding: 0,
    paddingHorizontal: 0,
    top: 0,
    fontSize: 14,
  },
  listItemText__downgrade: {
    color: 'rgba(0,0,0,.8)',
    fontWeight: 'bold',
  },
  listItemText__small: {
    fontSize: 12,
    paddingTop: 12,
    color: theme.blue1,
  },
  listItemTitles: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemBottomLine: {
    // position: 'absolute',
    // right: 0,
    // left: 70,
    // bottom: 0,
    // height: 0,
    // backgroundColor: 'rgba(255,255,255,.2)',
  },

  plainItem: {
    width,
  },
});

export default TextLink;
