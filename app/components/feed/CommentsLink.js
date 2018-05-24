import React, { Component } from 'react';
import { isFunction } from 'lodash';
import { View, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/Entypo';

import theme from '../../style/theme';

const IOS = Platform.OS === 'ios';

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
      <TouchableOpacity activeOpacity={0.8} style={styles.commentLink} {...calloutProps}>
        <View style={[styles.comment, reverse && { flexDirection: 'row-reverse' }]}>
          {(hasComments || !compact) && (
            <Text
              style={[
                styles.commentText,
                compact && styles.compactText,
                reverse && { marginLeft: 7 },
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
            <MDIcon
              style={[styles.commentIcon, hasComments ? styles.activeCommentIcon : {}]}
              name={'chat'}
            />
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  comment: {
    padding: 8,
    paddingHorizontal: 15,
    paddingLeft: 25,
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
    top: 2,
  },
  commentTextRight: {
    marginLeft: 7,
  },
  commentIconWrap: {
    top: 2,
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
