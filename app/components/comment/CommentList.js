import React, { Component } from 'react';
import ReactNative, {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import autobind from 'autobind-decorator';

import { height } from '../../services/device-info';
import theme from '../../style/theme';
import { Comment, CommentPost } from './CommentPost';
import CommentImageZoom from './CommentImageZoom';
import CommentForm from './CommentForm';

const ScrollViewManager = NativeModules.ScrollViewManager;
const IOS = Platform.OS === 'ios';

const insertText = (str, index, indexEnd, value) =>
  str.substr(0, index) + value + str.substr(index + (indexEnd - index));

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = { zoomedImage: null };
  }

  @autobind
  scrollBottom(animated = false) {
    if (this.commentScrollView) {
      const containerHeight = height - 130;
      // this.commentScrollView.scrollToEnd({ animated });
      if (ScrollViewManager && ScrollViewManager.getContentSize) {
        ScrollViewManager.getContentSize(
          ReactNative.findNodeHandle(this.commentScrollView),
          contentSize => {
            const scrollYPos = contentSize.height - containerHeight;
            this.commentScrollView.scrollTo({
              x: 0,
              y: Math.max(0, scrollYPos),
              animated,
            });
          }
        );
      }
    }
  }

  @autobind
  postComment(comment) {
    this.scrollBottom(true);
    return this.props.postComment(comment);
  }

  @autobind
  zoomImage(zoomedImage) {
    this.setState({ zoomedImage });
  }

  @autobind
  resetZoomImage() {
    this.setState({ zoomedImage: null });
  }

  renderLoader() {
    return <ActivityIndicator size="large" color={theme.orange} />;
  }

  render() {
    const {
      postItem,
      comments,
      postComment,
      deleteComment,
      editComment,
      editCommentText,
      loadingComments,
      loadingCommentPost,
      openUserView,
    } = this.props;

    return (
      <View style={styles.commentList}>
        <KeyboardAvoidingView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          behavior={IOS ? 'position' : 'position'}
          keyboardVerticalOffset={IOS ? 60 : 300}
        >
          <View style={styles.commentView}>
            <View style={styles.commentScroll}>
              {loadingComments ? (
                this.renderLoader()
              ) : (
                <ScrollView
                  ref={ref => (this.commentScrollView = ref)}
                  onContentSizeChange={(contentWidth, contentHeight) => {
                    this.scrollBottom(false);
                  }}
                  keyboardShouldPersistTaps="always"
                >
                  <View>
                    <CommentPost
                      item={postItem}
                      openUserView={openUserView}
                      onImagePress={this.zoomImage}
                    />
                    {comments.map((comment, index) => (
                      <Comment
                        onImagePress={this.zoomImage}
                        key={index}
                        deleteComment={deleteComment}
                        item={comment}
                        openUserView={openUserView}
                      />
                    ))}
                  </View>
                </ScrollView>
              )}
            </View>

            <View style={styles.commentForm}>
              <CommentForm
                toggleEmojiPicker={this.toggleEmojiPicker}
                postComment={this.postComment}
                editComment={editComment}
                text={editCommentText}
                postCommentCallback={this.scrollBottom}
                loadingCommentPost={loadingCommentPost}
              />
            </View>
          </View>
        </KeyboardAvoidingView>

        <CommentImageZoom imageUrl={this.state.zoomedImage} onClose={this.resetZoomImage} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // # <CommentList />
  commentList: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: theme.dark,
  },
  commentView: {
    // minHeight: height - 40,
    // maxHeight: height - 40,
    // flex: 1,
    // justifyContent: 'space-between',
    flexGrow: 1,
    backgroundColor: theme.dark,
  },
  commentScroll: {
    // flex: 1,
    // flexGrow: 1,
    // minHeight: height - 107,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.dark,
    paddingBottom: IOS ? 0 : 20,
  },
  commentForm: {
    height: 52,
    position: 'relative',
    left: 0,
    right: 0,
    bottom: IOS ? 0 : 25,
  },

  emojiPicker: {
    zIndex: 20,
    position: 'absolute',
    left: 0,
    bottom: 50,
    width: 50,
    flex: 1,
  },
});

export default CommentList;
