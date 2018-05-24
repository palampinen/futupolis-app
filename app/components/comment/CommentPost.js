import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
  Linking,
  Text,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { noop } from 'lodash';

import ParsedText from 'react-native-parsed-text';
import time from '../../utils/time';
import theme from '../../style/theme';
import abuse from '../../services/abuse';
import { getInitialLetters } from '../../services/user';
import AnimateMe from '../AnimateMe';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const CommentAvatar = ({ onAuthorPress, name, id, avatar }) => (
  <View style={styles.commentAvatar}>
    <TouchableOpacity onPress={() => onAuthorPress({ name, id })}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.commentAvatarImage} />
      ) : (
        <Text style={styles.commentAvatarLetters}>{getInitialLetters(name)}</Text>
      )}
    </TouchableOpacity>
  </View>
);

const CommentAuthor = ({ name, ago, avatar, id, ownComment, onAuthorPress }) => (
  <View style={styles.authorField}>
    <TouchableOpacity onPress={() => onAuthorPress({ name, id })}>
      <Text style={[styles.commentAuthor, ownComment && styles.myCommentName]}>
        {ownComment ? 'You' : name}
      </Text>
    </TouchableOpacity>
    <Text style={styles.itemTimestamp}>• {ago}</Text>
  </View>
);

const CommentText = ({ text, style }) => (
  <ParsedText
    style={style}
    parse={[
      {
        type: 'url',
        style: { textDecorationLine: 'underline' },
        onPress: url => Linking.openURL(url),
      },
    ]}
  >
    {text}
  </ParsedText>
);

const commentIsCreatedByMe = item => item.get('authorType') === 'ME';
const feedItemIsCreatedByMe = item => item.getIn(['author', 'type']) === 'ME';

const showCommentDialog = (onDelete, comment) => {
  if (commentIsCreatedByMe(comment)) {
    Alert.alert('Remove Comment', 'Do you want to remove this comment?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, remove comment',
        onPress: () => onDelete(comment.get('id')),
        style: 'destructive',
      },
    ]);
  } else {
    Alert.alert('Report Content', 'Do you want to report this comment?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes, report comment',
        onPress: () => {
          abuse.reportFeedItem(comment.toJS(), 'comment');
        },
        style: 'destructive',
      },
    ]);
  }
};

const Comment = ({ item, openUserView, onImagePress, deleteComment }) => {
  const ago = time.getTimeAgo(item.get('createdAt'));
  const profilePicture = item.get('profilePicture');

  const hasImage = !!item.get('imagePath');

  const authorProps = {
    avatar: profilePicture,
    onAuthorPress: openUserView,
    id: item.get('userId'),
    name: item.get('userName'),
    ago: ago,
    ownComment: commentIsCreatedByMe(item),
  };

  return (
    <AnimateMe delay={140} duration={200} animationType="fade-from-bottom" style={{ flex: 1 }}>
      <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <CommentAvatar {...authorProps} />
          </View>

          <View style={styles.commentTextContent}>
            {hasImage ? (
              <TouchableWithoutFeedback onLongPress={() => showCommentDialog(deleteComment, item)}>
                <View>
                  <CommentAuthor {...authorProps} />
                  <TouchableOpacity onPress={() => onImagePress(item.get('imagePath'))}>
                    <Image style={styles.commentImage} source={{ uri: item.get('imagePath') }} />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback onLongPress={() => showCommentDialog(deleteComment, item)}>
                <View>
                  <CommentAuthor {...authorProps} />
                  <CommentText style={styles.commentText} text={item.get('text')} />
                </View>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    </AnimateMe>
  );
};

const CommentPost = ({ item, openUserView, onImagePress }) => {
  if (!item) {
    return null;
  }

  const ago = time.getTimeAgo(item.get('createdAt'));
  const profilePicture = item.getIn(['author', 'profilePicture']);
  const userName = item.getIn(['author', 'name']);
  const userId = item.getIn(['author', 'id']);
  const hasImage = item.get('type') === 'IMAGE';
  const hasText = !!item.get('text');

  const authorProps = {
    avatar: profilePicture,
    onAuthorPress: openUserView,
    id: userId,
    name: userName,
    ago,
    ownComment: feedItemIsCreatedByMe(item),
  };

  return (
    <AnimateMe delay={0} duration={200} animationType="fade-from-bottom" style={{ flex: 1 }}>
      <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <CommentAvatar {...authorProps} />
          </View>

          <View style={styles.commentTextContent}>
            {hasImage && (
              <View>
                <CommentAuthor {...authorProps} />
                <TouchableOpacity onPress={() => onImagePress(item.get('url'))}>
                  <Image style={styles.commentImage} source={{ uri: item.get('url') }} />
                </TouchableOpacity>
              </View>
            )}
            {hasText && (
              <View style={{ marginTop: hasImage ? 10 : 0 }}>
                {!hasImage && <CommentAuthor {...authorProps} />}
                <CommentText style={styles.commentText} text={item.get('text')} />
              </View>
            )}
          </View>
        </View>
      </View>
    </AnimateMe>
  );
};

const styles = StyleSheet.create({
  comment: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 3,
    paddingTop: 13,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  commentAvatarCol: {
    paddingRight: 15,
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarImage: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  commentAvatarLetters: {
    fontSize: 10,
    color: 'rgba(255,255,255,.6)',
    fontWeight: 'bold',
  },
  commentAvatarIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#e3e3e3',
    borderRadius: 13,
    color: theme.white,
    fontSize: 32,
    lineHeight: IOS ? 38 : 37,
    backgroundColor: theme.transparent,
  },
  commentImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  commentText: {
    textAlign: 'left',
    color: theme.white,
  },
  commentListItemImg: {
    width: width,
    height: width,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  commentTextContent: {
    flex: 1,
  },
  authorField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    color: theme.white,
    fontWeight: 'normal',
    opacity: 0.8,
    fontSize: 11,
  },
  myCommentName: {
    opacity: 1,
    color: theme.blush,
  },
  itemTimestamp: {
    marginLeft: 4,
    flex: 1,
    color: theme.white,
    opacity: 0.8,
    fontSize: 11,
    fontWeight: 'normal',
  },
});

export { Comment, CommentPost };
