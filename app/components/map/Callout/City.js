import React from 'react';
import { Dimensions, StyleSheet, View, Linking, Platform } from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import ParsedText from 'react-native-parsed-text';


import Text from '../../Text';
import Button from '../../common/Button';
import Callout from '.';
import theme from '../../../style/theme';
import locationService from '../../../services/location';
const IOS = Platform.OS === 'ios';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  postImage: {
    width: 110,
    height: 110,
    borderRadius: 3,
  },
  postInfo: {
    flexGrow: 1,
    marginLeft: 20,
    maxWidth: width - 130 - 0,
  },
  postAuthorName: {
    color: theme.white,
    fontSize: 14,
    paddingBottom: 3,
  },
  postTextMessage: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 12,
    color: theme.stable,
    backgroundColor: theme.transparent,
    fontFamily: IOS ? 'Futurice' : 'Futurice-Regular',
  },
  calloutButton: {
    top: 0,
    maxHeight: 36,
    maxWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  url: {
    fontSize: 0,
    opacity: 0,
  }
});

const onDirectionsPress = model => {
  const location = model && model.toJS ? model.toJS() : model;
  const geoUrl = locationService.getGeoUrl(location);

  Linking.openURL(geoUrl);
};

const CalloutPost = ({ item, onImagePress }) => {
  return (
    <Callout imageUrl={item.get('imageUrl')} onImagePress={onImagePress}>
      <View style={styles.postInfo}>
        <Text style={styles.postAuthorName}>{item.get('title')}</Text>
        <ParsedText
          style={styles.postTextMessage}
          parse={[{ type: 'url', style: styles.url }]}
          numberOfLines={5}
        >
          {item.get('subtitle')}
        </ParsedText>
        {/*IOS && (
          <Button style={styles.calloutButton} onPress={() => onDirectionsPress(item)}>
            Directions
          </Button>
        )*/}
      </View>
    </Callout>
  );
};

export default CalloutPost;
