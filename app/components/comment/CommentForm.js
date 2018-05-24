import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Text,
} from 'react-native';
import autobind from 'autobind-decorator';
import { isEmpty, noop } from 'lodash';
import AnimateMe from '../AnimateMe';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

import permissions from '../../services/android-permissions';
import ImagePickerManager from 'react-native-image-picker';
import ImageCaptureOptions from '../../constants/ImageCaptureOptions';
import { isIphoneX } from '../../services/device-info';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class CommentForm extends Component {
  @autobind
  onChangeText(text) {
    this.props.editComment(text);
  }

  @autobind
  onSendText() {
    const { postComment, text, loadingCommentPost, postCommentCallback } = this.props;

    if (!text) {
      Keyboard.dismiss();
    }

    if (!text || isEmpty(text.trim()) || loadingCommentPost) {
      return;
    }

    postComment({ text }).then(() => {
      Keyboard.dismiss();
      postCommentCallback();
    });
  }

  renderPostLoader() {
    return <ActivityIndicator style={styles.button} size={'small'} color={theme.blush} />;
  }

  @autobind
  chooseImage() {
    if (IOS) {
      this.openImagePicker();
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker();
        });
      });
    }
  }

  @autobind
  openImagePicker() {
    ImagePickerManager.showImagePicker(ImageCaptureOptions, response => {
      if (!response.didCancel && !response.error) {
        const imageData = 'data:image/jpeg;base64,' + response.data;
        // text as '...'' because API does not yet approve comments without text
        this.props.postComment({ imageData }).then(this.props.postCommentCallback);
      }
    });
  }

  renderImageUpload() {
    return (
      <AnimateMe animationType="fade-in" duration={200}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this.chooseImage}>
            <Text>
              <Icon name="photo-camera" style={[styles.buttonIcon, styles.secondaryIcon]} />
            </Text>
          </TouchableOpacity>
        </View>
      </AnimateMe>
    );
  }

  @autobind
  renderSubmit() {
    return (
      <AnimateMe animationType="fade-from-left" duration={250}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this.onSendText}>
            <Text>
              <Icon name="send" style={styles.buttonIcon} />
            </Text>
          </TouchableOpacity>
        </View>
      </AnimateMe>
    );
  }

  render() {
    const { text, loadingCommentPost } = this.props;

    return (
      <View style={styles.itemWrapper}>
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            underlineColorAndroid={'transparent'}
            returnKeyType={'send'}
            style={styles.inputField}
            numberOfLines={1}
            blurOnSubmit={true}
            maxLength={151}
            placeholderTextColor={'rgba(255,255,255, 0.4)'}
            placeholder="Add comment..."
            onSubmitEditing={this.onSendText}
            onChangeText={this.onChangeText}
            value={text}
            onFocus={() => {
              // With android need additional input focus callback
              // To scroll to bottom of the list!
              !IOS && this.props.onInputFocus(true, 200);
            }}
          />

          <View style={styles.rightButtons}>
            {!text && !loadingCommentPost && this.renderImageUpload()}
            {!!text && !loadingCommentPost && this.renderSubmit()}
            {loadingCommentPost && this.renderPostLoader()}
          </View>
        </View>
      </View>
    );
  }
}

CommentForm.defaultProps = {
  onInputFocus: noop,
};

const styles = StyleSheet.create({
  itemWrapper: {
    width,
    height: isIphoneX ? 67 : 52,
    paddingBottom: isIphoneX ? 15 : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    elevation: 1,
    borderTopColor: theme.darker,
    borderTopWidth: 1,
    backgroundColor: theme.dark,
    justifyContent: 'flex-start',
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 15,
    width,
  },
  inputField: {
    backgroundColor: theme.red,
    color: theme.white,
    height: 52,
    fontSize: 14,
    position: 'relative',
    borderRadius: 0,
    padding: 0,
    paddingLeft: 0,
    left: 0,
    width: width - (IOS ? 75 : 60),
  },
  rightButtons: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    zIndex: 1,
    position: 'relative',
    height: 52,
    width: 52,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.transparent,
  },
  buttonIcon: {
    backgroundColor: theme.transparent,
    color: theme.blush,
    fontSize: 25,
  },
  secondaryIcon: {
    color: theme.inactive,
  },
});

export default CommentForm;
