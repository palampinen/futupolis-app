import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
  Dimensions,
  StyleSheet,
  Modal,
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
  deleteComment,
  closeComments,
} from '../../concepts/comments';
import { fetchUserImages } from '../../concepts/user';

import theme from '../../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommentPost from './CommentPost';
import CommentList from './CommentList';
import ScrollHeader from '../common/ScrollHeader';
import UserView from '../user/UserView';

const { width, height } = Dimensions.get('window');

class CommentsView extends Component {
  @autobind
  onClose() {
    this.props.closeComments();
    this.props.navigator.pop();
  }

  @autobind
  openUserView(user) {
    this.props.fetchUserImages(user.id);
    this.props.navigator.push({ component: UserView, name: `${user.name}`, showName: true });
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
        <ScrollHeader icon={'close'} onIconClick={this.onClose} title="Comment" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapDispatchToProps = {
  editComment,
  postComment,
  closeComments,
  deleteComment,
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

export default connect(
  select,
  mapDispatchToProps
)(CommentsView);
