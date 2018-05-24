'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.dark,
    elevation: 0,
    height: 56,
  },
});

const iconColor = theme.blue2;

const selectedActionIcon = '• '; //‣ • ● ♥

const getElevation = tab => {
  switch (tab) {
    case Tabs.MAP:
    case Tabs.SETTINGS: {
      return 0;
    }
    default: {
      return 0;
    }
  }
};

const getActions = (tab, sortType) => {
  switch (tab) {
    case Tabs.FEED: {
      return [
        {
          title: `${sortType === SortTypes.SORT_NEW ? selectedActionIcon : '  '} NEW`,
          id: SortTypes.SORT_NEW,
          show: 'never',
        },
        {
          title: `${sortType === SortTypes.SORT_HOT ? selectedActionIcon : '  '} HOT`,
          id: SortTypes.SORT_HOT,
          show: 'never',
        },
      ];
    }
    default: {
      return [];
    }
  }
  return [];
};

class EventDetailToolbar extends Component {
  @autobind
  onActionSelected(position) {
    const { currentTab, navigator } = this.props;
    switch (position) {
      case 0: {
        this.props.setFeedSortType(SortTypes.SORT_NEW);
        break;
      }
      case 1: {
        this.props.setFeedSortType(SortTypes.SORT_HOT);
        break;
      }

      default:
        {
          console.log('No action for this selection');
          break;
        }

        return;
    }
  }

  render() {
    const toolbarStyles = [styles.toolbar];

    const { backgroundColor, titleColor, currentTab, selectedSortType } = this.props;

    const elevation = getElevation(currentTab);
    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation });
    }

    return (
      <ToolbarAndroid
        actions={getActions(currentTab, selectedSortType)}
        logo={require('../../../assets/futupolis/futupolis-neon.png')}
        overflowIconName={'sort'}
        overflowIcon={require('../../../assets/icons/sort.png')}
        title={''}
        onActionSelected={this.onActionSelected}
        iconColor={theme.white}
        titleColor={titleColor || theme.white}
        style={toolbarStyles}
      />
    );
  }
}

export default EventDetailToolbar;
