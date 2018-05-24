import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from 'react-native';
import PhotoView from 'react-native-photo-view';
import ImageZoom from 'react-native-image-zoom';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ModalBackgroundView from '../common/ModalBackgroundView';
import PlatformTouchable from '../common/PlatformTouchable';
import AnimateMe from '../AnimateMe';
import theme from '../../style/theme';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const CommentZoomImage = ({ imageUrl, onClose }) => {
  if (!imageUrl) {
    return null;
  }

  return (
    <ModalBackgroundView style={styles.layer} blurType="light">
      <View style={styles.closeButtonWrap}>
        <PlatformTouchable
          delayPressIn={0}
          onPress={onClose}
          activeOpacity={0.8}
          background={IOS ? null : PlatformTouchable.SelectableBackgroundBorderless()}
        >
          <View style={styles.closeButton}>
            <Icon style={styles.closeButtonIcon} name="close" />
          </View>
        </PlatformTouchable>
      </View>

      <AnimateMe
        style={{ flex: 1, width, height: height - 60 }}
        duration={200}
        animationType="comment-image"
      >
        {IOS ? (
          <PhotoView
            source={{ uri: imageUrl }}
            minimumZoomScale={1}
            maximumZoomScale={4}
            resizeMode={'contain'}
            style={{ width, height: height - 60 }}
          />
        ) : (
          <ImageZoom
            source={{ uri: imageUrl }}
            resizeMode={'contain'}
            style={{ width, height: height - 60, flex: 1 }}
          />
        )}
      </AnimateMe>
    </ModalBackgroundView>
  );
};

const styles = StyleSheet.create({
  layer: {
    width,
    height: height - 60,
    paddingBottom: 0,
    backgroundColor: IOS ? 'transparent' : 'rgba(255,255,255,.85)',
    zIndex: 10,
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonWrap: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 11,
    elevation: 3,
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  closeButton: {
    backgroundColor: theme.white,
    opacity: IOS ? 0.7 : 1,
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    elevation: 0,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      height: 6,
      width: 0,
    },
  },
  closeButtonIcon: {
    color: theme.dark,
    fontSize: 20,
  },
});

export default CommentZoomImage;
