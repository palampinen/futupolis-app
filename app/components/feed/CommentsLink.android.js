import React, { Component } from 'react';
import { isFunction } from 'lodash';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import Text from '../Text';

import theme from '../../style/theme';

class CommentsLinks extends Component {
  render() {
    const { commentCount, openComments, reverse, compact } = this.props;
    const hasComments = commentCount > 0;

    let calloutProps = {};
    if (openComments && isFunction(openComments)) {
      calloutProps = {
        onPress: openComments,
      };
    }

    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        delayPressIn={0}
        {...calloutProps}
      >
        <View style={styles.commentLink}>
          <View style={[styles.comment, reverse && { flexDirection: 'row-reverse' }]}>
            {(hasComments || !compact) && (
              <Text
                style={[
                  styles.commentText,
                  compact && styles.compactText,
                  reverse && { marginLeft: 8 },
                ]}
              >
                {hasComments ? commentCount : ''}
              </Text>
            )}
            <Text
              style={[
                styles.commentText,
                styles.commentIconWrap,
                !compact && styles.commentTextRight,
              ]}
            >
              <EntypoIcon
                style={[styles.commentIcon, hasComments ? styles.activeCommentIcon : {}]}
                name={'chat'}
              />
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

const styles = StyleSheet.create({
  comment: {
    padding: 5,
    paddingLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    color: theme.inactive,
    fontSize: 15,
  },
  commentTextRight: {
    marginLeft: 7,
  },
  commentIconWrap: {
    top: 1,
  },
  compactText: {
    marginRight: 3,
    marginLeft: -5,
    color: theme.blush,
  },
  commentIcon: {
    fontSize: 17,
    color: theme.inactive,
  },
  activeCommentIcon: {
    color: theme.blush,
  },
});

export default CommentsLinks;
