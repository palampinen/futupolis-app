'use strict';

import React, { Component } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from './ActionButton';
import Text from '../Text';
import ActionButtonLabel from './ActionButtonLabel';
import { openRegistrationView } from '../../concepts/registration';
import theme from '../../style/theme';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { updateCooldowns } from '../../actions/competition';
import { getActionTypesForFeed } from '../../reducers/competition';

const IOS = Platform.OS === 'ios';

// in a happy world all this would be calculated on the fly but no
const BUTTON_COUNT = 6;
const DISTANCE = 60;
const BUTTON_WIDTH = 46;
const BIG_BUTTON_WIDTH = 56;
const BUTTON_DELAY = 40;

const OPEN = 'OPEN';
const CLOSED = 'CLOSED';

const BUTTON_POS = [];
for (let i = 0; i < BUTTON_COUNT; i++) {
  BUTTON_POS.push({
    x: 0,
    y: -DISTANCE * i - (BUTTON_WIDTH + BIG_BUTTON_WIDTH / 2) + 10,
  });
}

const styles = StyleSheet.create({
  mainButton: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0,
    },
  },
  scrollTopButton: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    backgroundColor: '#FFF',
  },
  scrollTopButtonContent: {
    color: theme.dark,
  },
  buttonEnclosure: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    bottom: IOS ? 0 : 26,
    right: 20,
    overflow: 'visible',
    width: 200,
    height: 56,
    borderRadius: 28,
  },
  actionButton: {
    bottom: 4,
    right: 5,
    width: 46,
    height: 46,
  },
  actionButtonContent: {
    color: theme.dark,
  },
  overlay: {
    right: 43,
    bottom: IOS ? 20 : 49,
    position: 'absolute',
    backgroundColor: theme.white,
    opacity: 0.9,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

const actions = {};
const getBoundAction = (type, fn) => {
  if (actions[type]) {
    return actions[type];
  }

  actions[type] = fn.bind(null, type);
  return actions[type];
};

class ActionButtons extends Component {
  // mixins: [TimerMixin]
  constructor(props) {
    super(props);

    this.state = {
      buttons: BUTTON_POS.map(() => new Animated.ValueXY()),
      plusButton: new Animated.Value(0),
      labels: BUTTON_POS.map(() => new Animated.Value(0)),
      actionButtonsOpen: false,
      actionButtonsWidth: new Animated.Value(56),
      overlayOpacity: new Animated.Value(0),
    };
  }

  animateButtonsToState(nextState) {
    // state is manipulated here directly on purpose, so the animations works smoothly
    /*eslint-disable */
    this.state.actionButtonsOpen = nextState === OPEN;
    /*eslint-enable */
    BUTTON_POS.forEach((pos, i) => {
      // Animate action buttons, iOS handles delay better
      if (IOS) {
        Animated.parallel([
          Animated.delay(
            nextState === OPEN ? BUTTON_POS.length * BUTTON_DELAY - i * BUTTON_DELAY : 0
          ),
          Animated.spring(this.state.buttons[i], {
            toValue: nextState === OPEN ? pos : { x: 0, y: 0 },
          }),
        ]).start();
      } else {
        Animated.spring(this.state.buttons[i], {
          toValue: nextState === OPEN ? pos : { x: 0, y: 0 },
        }).start();
      }

      // Animate action button labels, 200ms later than buttons
      Animated.parallel([
        Animated.delay(
          nextState === OPEN ? 200 + BUTTON_POS.length * BUTTON_DELAY - i * BUTTON_DELAY : 0
        ),
        Animated.timing(this.state.labels[i], {
          duration: 200,
          toValue: nextState === OPEN ? 1 : 0,
        }),
      ]).start();
    });
    Animated.spring(this.state.plusButton, { toValue: nextState === OPEN ? 1 : 0 }).start();

    // buttonset width
    Animated.timing(this.state.actionButtonsWidth, {
      duration: 0,
      toValue: nextState === OPEN ? 220 : 56,
    }).start();
  }

  @autobind
  onToggleActionButtons() {
    this.props.updateCooldowns();

    if (this.state.actionButtonsOpen === false) {
      this.updateCooldownInterval = this.setInterval(() => {
        this.props.updateCooldowns();
      }, 1000);
    } else {
      this.clearInterval(this.updateCooldownInterval);
    }
    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      Animated.timing(this.state.overlayOpacity, {
        duration: 300,
        easing: Easing.ease,
        toValue: this.state.actionButtonsOpen ? 0 : 1,
      }).start();
      this.animateButtonsToState(this.state.actionButtonsOpen ? CLOSED : OPEN);
    }
  }

  @autobind
  onPressActionButtons(type, fn) {
    // Start the action
    getBoundAction(type, fn)();

    // Close Action buttons
    this.onToggleActionButtons();
  }

  componentDidMount() {
    // Close Action buttons on back press
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.actionButtonsOpen) {
        this.onToggleActionButtons();
        return true;
      }
      return false;
    });
  }

  getIconForAction(type) {
    const mapping = {
      TEXT: 'textsms',
      IMAGE: 'photo-camera',
      SIMA: 'local-bar',
      CHECK_IN_EVENT: 'location-on',
      default: 'image',
    };
    return mapping[type] || mapping['default'];
  }

  getLabelForAction(type) {
    const mapping = {
      TEXT: 'Add Message',
      IMAGE: 'Add Photo',
      SIMA: 'Have a sima',
      CHECK_IN_EVENT: 'Check into event',
      default: 'Add Image',
    };
    return mapping[type] || mapping['default'];
  }

  getCooldownTime(actionType) {
    const now = new Date().getTime();
    const diffInSecs = (this.props.cooldownTimes.get(actionType) - now) / 1000;
    const minutes = Math.floor(diffInSecs / 60);
    const seconds = Math.floor(diffInSecs % 60);

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  renderActionButtons() {
    const { actionTypes } = this.props;

    return actionTypes.map((actionType, i) => {
      const actionTypeCode = actionType.get('code');
      const actionTypeValue = actionType.get('value');
      const iconName = this.getIconForAction(actionTypeCode);
      const labelName = this.getLabelForAction(actionTypeCode);
      const isCoolingDown = this.props.disabledActionTypes.find(dat => dat === actionTypeCode);

      const iconOrCooldownTime = isCoolingDown ? (
        <Text style={[styles.actionButtonContent, { top: IOS ? 3 : 0 }]}>
          {this.getCooldownTime(actionTypeCode)}
        </Text>
      ) : (
        <Icon name={iconName} size={22} style={styles.actionButtonContent} />
      );

      const actionButtonStyles = [
        styles.buttonEnclosure,
        {
          transform: this.state.buttons[i].getTranslateTransform(),
          width: this.state.actionButtonsWidth,
        },
      ];

      const onActionButtonPress = this.onPressActionButtons.bind(
        this,
        actionTypeCode,
        this.props.onPressAction
      );

      return (
        <Animated.View key={`button-${i}`} style={actionButtonStyles}>
          <ActionButtonLabel
            additionalLabel={actionTypeValue}
            extraStyle={{ opacity: this.state.labels[i] }}
            onPress={onActionButtonPress}
          >
            {labelName}
          </ActionButtonLabel>
          <ActionButton
            onPress={onActionButtonPress}
            disabled={isCoolingDown}
            extraStyle={styles.actionButton}
          >
            {iconOrCooldownTime}
          </ActionButton>
        </Animated.View>
      );
    });
  }

  renderMenuButton() {
    // Show scroll top button instead of add button when scrolled down
    if (this.props.showScrollTopButton) {
      return (
        <ActionButton
          onPress={this.props.onScrollTop}
          underLayColor={theme.lightgrey}
          extraStyle={styles.scrollTopButton}
        >
          <View>
            <Icon
              name={'keyboard-arrow-up'}
              size={26}
              style={[styles.actionButtonContent, styles.scrollTopButtonContent]}
            />
          </View>
        </ActionButton>
      );
    }

    const rotation = this.state.plusButton.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '225deg'],
    });

    return (
      <ActionButton onPress={this.onToggleActionButtons} extraStyle={styles.mainButton}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Icon name={'add'} size={24} style={styles.actionButtonContent} />
        </Animated.View>
      </ActionButton>
    );
  }

  render() {
    const { isLoading, actionTypes, style, visibilityAnimation } = this.props;

    if (isLoading || !actionTypes || actionTypes.size === 0) {
      return null;
    }

    const actionButtonsTranslate = visibilityAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, IOS ? 30 : 0],
    });

    return (
      <Animated.View style={[style, { bottom: actionButtonsTranslate }]}>
        <Animated.View
          style={[
            styles.overlay,
            {
              transform: [
                {
                  scale: this.state.overlayOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 200],
                  }),
                },
              ],
            },
          ]}
        />
        {this.renderActionButtons()}
        {this.renderMenuButton()}
      </Animated.View>
    );
  }
}

const mapDispatchToProps = { updateCooldowns, openRegistrationView };

const select = store => {
  return {
    actionTypes: getActionTypesForFeed(store),
    disabledActionTypes: store.competition.get('disabledActionTypes'),
    cooldownTimes: store.competition.get('cooldownTimes'),
  };
};

reactMixin(ActionButtons.prototype, TimerMixin);
export default connect(
  select,
  mapDispatchToProps
)(ActionButtons);
