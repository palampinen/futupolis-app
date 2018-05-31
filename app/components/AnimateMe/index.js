import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, View, Dimensions } from 'react-native';
import autobind from 'autobind-decorator';
import { noop } from 'lodash';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

const getAnimationStyles = (type, animation) => {
  switch (type) {
    case 'fade-in':
      return { opacity: animation };
    case 'fade-out':
      return {
        opacity: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      };
    case 'scale-in':
      return { transform: [{ scale: animation }] };

    case 'drop-in':
      return {
        opacity: animation,
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1.05, 1] }) },
        ],
      };

    case 'shake':
      return {
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1.025, 1] }) },
          { rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '3deg'] }) },
        ],
      };

    case 'shake2':
      return {
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1.01, 1] }) },
          { rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-1deg'] }) },
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
        ],
      };

    case 'shake3':
      return {
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) },
          { rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '4deg'] }) },
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
        ],
      };

    case 'scale-small-in':
      return {
        transform: [
          {
            scale: animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.85, 1.2, 1] }),
          },
        ],
      };

    case 'fade-from-bottom': {
      return {
        opacity: animation,
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
        ],
      };
    }

    case 'new-notification': {
      return {
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [-1, 2] }) },
        ],
      };
    }

    case 'slide-from-bottom': {
      return {
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) },
        ],
      };
    }

    case 'slide-fully-from-bottom': {
      return {
        opacity: animation,
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [6, 0] }) },
        ],
      };
    }

    case 'fade-from-top': {
      return {
        opacity: animation,
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
        ],
      };
    }

    case 'fade-from-left': {
      return {
        opacity: animation,
        transform: [
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) },
        ],
      };
    }
    case 'fade-from-right': {
      return {
        opacity: animation,
        transform: [
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) },
        ],
      };
    }

    case 'small-slide-from-top': {
      return {
        opacity: animation,
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) },
        ],
      };
    }

    case 'small-slide-from-bottom': {
      return {
        opacity: animation,
        transform: [
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) },
        ],
      };
    }

    case 'comment-image': {
      return {
        opacity: animation,
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) },
        ],
      };
    }

    case 'scale-fade-in': {
      return {
        opacity: animation,
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) },
        ],
      };
    }

    case 'directions-bus':
      return {
        transform: [
          {
            scale: animation.interpolate({
              inputRange: [0, 0.5, 0.50001, 1],
              outputRange: [1, 1.1, 0.8, 1],
            }),
          },
          {
            translateY: animation.interpolate({
              inputRange: [0, 0.5, 0.50001, 1],
              outputRange: [0, 70, -70, 0],
            }),
          },
          {
            translateX: animation.interpolate({
              inputRange: [0, 0.25, 0.5, 0.75, 1],
              outputRange: [0, 2, -2, 2, 0],
            }),
          },
        ],
      };

    // case 'flight':
    //   return {
    //     transform: [
    //       { rotate: animation.interpolate({ inputRange: [0, 0.3, 1], outputRange: ['0deg', '30deg', '30deg'] }) },
    //       { translateY: animation.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0, -220] }) },
    //       { translateX: animation.interpolate({ inputRange: [0, 0.25, 1], outputRange: [0, 0, 5] }) },
    //     ],
    //   };

    case 'flight':
      return {
        transform: [
          {
            rotate: animation.interpolate({
              inputRange: [0, 0.3, 0.9, 1],
              outputRange: ['0deg', '30deg', '30deg', '0deg'],
            }),
          },
          {
            translateY: animation.interpolate({
              inputRange: [0, 0.2, 0.7, 0.70001, 1],
              outputRange: [0, 0, -220, 220, 0],
            }),
          },
          {
            translateX: animation.interpolate({
              inputRange: [0, 0.25, 0.7, 0.70001, 1],
              outputRange: [0, 0, 5, 5, 0],
            }),
          },
        ],
      };

    case 'send':
      return {
        transform: [
          {
            rotate: animation.interpolate({
              inputRange: [0, 0.2, 1],
              outputRange: ['0deg', '-45deg', '-45deg'],
            }),
          },
          {
            translateX: animation.interpolate({
              inputRange: [0, 0.1, 1],
              outputRange: [0, 0, 300],
            }),
          },
        ],
      };

    case 'cloud':
      return {
        transform: [
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [50, -100] }) },
        ],
      };

    case 'sunny':
      return {
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 0.4, 0.9, 1],
              outputRange: [100, 0, 0, -50],
            }),
          },
          {
            rotate: animation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ['0deg', '0deg', '90deg'],
            }),
          },
        ],
      };

    case 'note':
      return {
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 0.4, 0.65, 0.8, 0.9, 1],
              outputRange: [100, -2, 0, -2, 0, -50],
            }),
          },
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-50, -50] }) },
          {
            scale: animation.interpolate({
              inputRange: [0, 0.5, 0.65, 0.8, 0.9, 1],
              outputRange: [0, 1, 0.9, 1, 0.9, 0],
            }),
          },
        ],
      };

    case 'moon':
      return {
        transform: [
          {
            translateY: animation.interpolate({
              inputRange: [0, 0.4, 0.7, 0.8, 0.9, 1],
              outputRange: [100, -5, 0, -2, 0, -50],
            }),
          },
          { scale: animation.interpolate({ inputRange: [0, 0.9, 1], outputRange: [1, 1, 0] }) },
        ],
      };
  }
};

class AnimatedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { animation: new Animated.Value(0) };
  }

  animationRepeater = null;
  componentDidMount() {
    this.animationRepeater = true;
    setTimeout(this.startAnimation, this.props.delay);
  }

  componentWillUnmount() {
    if (this.animationRepeater) {
      this.animationRepeater = null;
    }
  }

  @autobind
  startAnimation() {
    const next = this.props.infinite && this.animationRepeater ? this.repeatAnimation : noop;
    Animated.timing(this.state.animation, { toValue: 1, duration: this.props.duration }).start(
      next
    );
  }

  @autobind
  repeatAnimation() {
    if (!this.state || !this.state.animation) {
      return;
    }

    Animated.timing(this.state.animation, { toValue: 0, duration: this.props.duration }).start(
      this.startAnimation
    );
  }

  render() {
    const { animationType, style, children } = this.props;
    const { animation } = this.state;

    const animationStyles = getAnimationStyles(animationType, animation);

    return (
      <Animated.View style={[{ flex: IOS ? 0 : 1 }, style, animationStyles]}>
        {children}
      </Animated.View>
    );
  }
}

AnimatedComponent.propTypes = {
  animationType: PropTypes.string,
  children: PropTypes.node,
  delay: PropTypes.number,
  duration: PropTypes.number,
};

AnimatedComponent.defaultProps = {
  children: null,
  delay: 0,
  duration: 500,
  animationType: 'fade-in',
};

module.exports = AnimatedComponent;
