import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';
import ScrollHeader from '../header/ScrollHeader';
import PlatformTouchable from '../common/PlatformTouchable';
import ViewSelector from '../header/ViewSelector';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.dark,
    elevation: 2,
    height: 56,
  },
  iconWrap: {
    borderRadius: 28,
    width: 56,
    height: 56,
    marginRight: 0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconImage: {
    width: 36,
    height: 36,
  },
  rightContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 56,
  },
});

const getElevation = tab => {
  switch (tab) {
    case Tabs.TRIP:
    case Tabs.CALENDAR: {
      return 0;
    }

    default: {
      return 2;
    }
  }
};

class MainHeader extends Component {
  static propTypes: {
    title: PropTypes.string,
    navigator: PropTypes.object.isRequired,
  };

  getHeaderProps() {
    const {
      selectedSortType,
      setFeedSortType,
      currentTab,
      navigator,
      openRegistrationView,
    } = this.props;

    let headerProps;
    switch (currentTab) {
      case Tabs.FEED: {
        headerProps = {
          renderRightContent: () => (
            <View style={styles.rightContent}>
              <ViewSelector />
            </View>
          ),
        };
        break;
      }

      default: {
        headerProps = {};
      }
    }

    return headerProps;
  }

  render() {
    const { backgroundColor, titleColor, currentTab } = this.props;
    const toolbarStyles = [styles.toolbar];
    const elevation = getElevation(currentTab);

    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation });
    }
    const headerProps = this.getHeaderProps();

    return (
      <ScrollHeader
        logo={require('../../../assets/futupolis/futupolis-neon.png')}
        {...headerProps}
        elevation={elevation}
      />
    );
  }
}

export default MainHeader;
