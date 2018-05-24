import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import {
  isCommentsViewOpen,
  isLoadingComments,
  isLoadingCommentPost,
  getCommentItem,
  getComments,
  getCommentEditText,
  editComment,
  postComment,
  closeComments,
  deleteComment,
} from '../../concepts/comments';
import { fetchUserImages } from '../../concepts/user';

import theme from '../../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommentPost from './CommentPost';
import CommentList from './CommentList';
import Toolbar from '../common/Toolbar';
import UserView from '../user/UserView';

const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class CommentsView extends Component {
  @autobind
  onClose() {
    this.props.closeComments();
  }

  @autobind
  openUserView(user, avatar) {
    this.props.fetchUserImages(user.id);
    this.props.navigator.push({
      component: UserView,
      name: `${user.name}`,
      singleColorHeader: true,
    });
  }

  render() {
    const {
      isCommentsViewOpen,
      commentItem,
      comments,
      postComment,
      editComment,
      editCommentText,
      loadingComments,
      loadingCommentPost,
    } = this.props;

    if (!isCommentsViewOpen) {
      return false;
    }

    return (
      <View style={styles.container}>
        <CommentList
          openUserView={this.openUserView}
          postItem={commentItem}
          comments={comments}
          postComment={postComment}
          deleteComment={this.props.deleteComment}
          editComment={editComment}
          editCommentText={editCommentText}
          loadingComments={loadingComments}
          loadingCommentPost={loadingCommentPost}
        />
      </View>
    );
  }
}

CommentsView.propTypes = {
  isCommentsViewOpen: PropTypes.bool,
  commentItem: PropTypes.object,
  comments: PropTypes.object,
  postComment: PropTypes.func,
  editComment: PropTypes.func,
  editCommentText: PropTypes.string,
  loadingComments: PropTypes.bool,
  loadingCommentPost: PropTypes.bool,
  isModal: PropTypes.bool,
};

CommentsView.defaultProps = {
  isCommentsViewOpen: false,
  loadingComments: false,
  loadingCommentPost: false,
  isModal: false,
};

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
    backgroundColor: theme.white,
  },
});

const mapDispatchToProps = {
  editComment,
  postComment,
  deleteComment,
  closeComments,
  fetchUserImages,
};

const select = createStructuredSelector({
  isCommentsViewOpen,
  commentItem: getCommentItem,
  comments: getComments,
  editCommentText: getCommentEditText,
  loadingComments: isLoadingComments,
  loadingCommentPost: isLoadingCommentPost,
});

export default connect(select, mapDispatchToProps)(CommentsView);
