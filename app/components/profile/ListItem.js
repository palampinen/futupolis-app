import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, Linking, Image } from 'react-native';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import feedback from '../../services/feedback';
import Tabs from '../../constants/Tabs';
import Text from '../Text';
import WebViewer from '../webview/WebViewer';
import AnimateMe from '../AnimateMe';
import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';
import { IOS, isIphoneX, width, height } from '../../services/device-info';

const getSubIcon = mainIcon => {
  let name;
  let animation;
  switch (mainIcon) {
    case 'flight': {
      name = 'md-cloud';
      animation = 'cloud';
      break;
    }
    // case 'directions-bus': {
    case 'hotel': {
      animation = 'moon';
      name = 'md-moon';
      break;
    }
    case 'location-city': {
      name = 'md-musical-notes';
      animation = 'note';
      break;
    }
    default: {
    }
  }

  return { name, animation };
};

class ListItem extends Component {
  constructor(props) {
    super(props);

    this.state = { animated: false, opening: false };
    this.animateItem = this.animateItem.bind(this);
  }

  componentDidMount() {
    this.animateItem();
  }

  componentWillReceiveProps({ currentTab }) {
    if (currentTab !== this.props.currentTab && currentTab === Tabs.TRIP && this.state) {
      this.animateItem();
    }
  }

  animateItem() {
    const { index } = this.props;

    setTimeout(() => {
      this.setState({ animated: true });

      setTimeout(() => this.setState({ animated: false }), 3000);
    }, index * 500);
  }

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
    const { animated } = this.state;
    const linkItemStyles = [styles.listItemButton];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    if (item.plain) {
      linkItemStyles.push(styles.plainItem);
    }

    if (item.last) {
      linkItemStyles.push(styles.listItemLast);
    }

    const IconComponent = animated ? AnimateMe : View;
    const subIcon = getSubIcon(item.icon);

    return (
      <View style={styles.listItemButton}>
        <PlatformTouchable
          key={index}
          underlayColor={'#eee'}
          activeOpacity={0.6}
          background={IOS ? null : PlatformTouchable.SelectableBackgroundBorderless()}
          delayPressIn={0}
          style={styles.listItemButton}
          // onPressIn={() => this.setState({ animated: true })}
          // onPressOut={() => setTimeout(() => this.setState({ animated: false }), 1200)}
          onPress={() =>
            item.mailto
              ? feedback.sendEmail(item.mailto)
              : this.onLinkPress(item.link, item.title, item.showInWebview)
          }
        >
          <View style={linkItemStyles}>
            <LinearGradient
              locations={[0, 0.5, 0.9]}
              start={{ x: 0.1, y: 0.1 }}
              end={{ x: 0.6, y: 0.9 }}
              colors={['rgba(70,70,70,0.2)', theme.dark, theme.dark]}
              style={styles.listItem}
            >
              <View style={styles.listItemIcons}>
                {animated &&
                  subIcon.name && (
                    <IconComponent
                      style={styles.subIconWrap}
                      animationType={subIcon.animation}
                      duration={2500}
                    >
                      <IonIcon name={subIcon.name} style={styles.subIcon} />
                    </IconComponent>
                  )}
                <IconComponent
                  style={styles.listItemIconWrap}
                  animationType={item.icon}
                  duration={2500}
                >
                  <Icon style={styles.listItemIcon} name={item.icon} />
                </IconComponent>
              </View>

              <View style={styles.listItemTitles}>
                <Text style={styles.listItemText}>{item.title}</Text>
                {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
              </View>
              {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
            </LinearGradient>
          </View>
        </PlatformTouchable>
      </View>
    );
  }

  @autobind
  renderComponentItem(item, index) {
    const linkItemStyles = [styles.listItemButton];
    const { navigator } = this.props;
    const { component, title } = item;
    const { animated } = this.state;

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    const IconComponent = animated ? AnimateMe : View;
    const subIcon = getSubIcon(item.icon);

    return (
      <PlatformTouchable
        key={index}
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
        onPress={() => navigator.push({ name: title, component, showName: true })}
      >
        <View style={linkItemStyles}>
          <LinearGradient
            locations={[0, 0.5, 0.9]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.6, y: 0.9 }}
            colors={['rgba(70,70,70,0.2)', theme.dark, theme.dark]}
            style={styles.listItem}
          >
            <View style={styles.listItemIcons}>
              {animated &&
                subIcon.name && (
                  <IconComponent
                    style={styles.subIconWrap}
                    animationType={subIcon.animation}
                    duration={2500}
                  >
                    <IonIcon name={subIcon.name} style={styles.subIcon} />
                  </IconComponent>
                )}
              <IconComponent
                style={styles.listItemIconWrap}
                animationType={item.icon}
                duration={2500}
              >
                <Icon style={styles.listItemIcon} name={item.icon} />
              </IconComponent>
            </View>
            <View style={styles.listItemTitles}>
              <Text style={styles.listItemText}>{item.title}</Text>
              {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
            </View>
            {!item.separatorAfter && !item.last && <View style={styles.listItemBottomLine} />}
          </LinearGradient>
        </View>
      </PlatformTouchable>
    );
  }

  @autobind
  renderCustomItem(item, index) {
    const linkItemStyles = [styles.listItemButton];

    if (item.separatorAfter || item.last) {
      linkItemStyles.push(styles.listItemSeparator);
    }

    if (item.last) {
      linkItemStyles.push(styles.listItemLast);
    }

    return (
      <PlatformTouchable
        key={index}
        underlayColor={'#eee'}
        activeOpacity={0.6}
        delayPressIn={0}
        style={styles.listItemButton}
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
    flex: 1,
    padding: 15,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: IOS ? theme.dark : theme.transparent,
    borderRadius: 5,
    overflow: 'hidden',
  },
  listItemSeparator: {},
  listItemLast: {
    marginBottom: 0,
  },
  listItemButton: {
    backgroundColor: IOS ? theme.transparent : theme.dark,
    padding: 0,
    width: IOS ? width / 2 - 9 : width / 2 - 7,
    minHeight: IOS ? (isIphoneX ? (height - 196) / 2 : (height - 172) / 2) : (height - 196) / 2,
    margin: 3,
    marginBottom: IOS ? 0 : 2,
    marginTop: IOS ? 3 : 3,
    borderRadius: 5,
  },
  listItemIcons: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.blush,
    marginBottom: 15,
    overflow: 'hidden',
  },
  listItemIconWrap: {
    marginBottom: 0,
    flex: 0,
  },
  listItemIcon: {
    fontSize: 34,
    color: theme.dark,
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
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
    lineHeight: 13,
    minHeight: 30, // "2 rows"
  },

  listItemText: {
    color: theme.white,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 5,
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

export default ListItem;
