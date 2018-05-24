import { PushNotificationIOS, Platform, Alert } from 'react-native';
import { fromJS } from 'immutable';
import PushNotification from 'react-native-push-notification-ce';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

import { GCM_SENDER_ID } from '../../env';
import getUserToken from '../services/token';
import theme from '../style/theme';

import firebase from 'react-native-firebase';

// # Action Types
export const PUSH_NOTIFICATION_SENT = 'push-notification/PUSH_NOTIFICATION_SENT';
export const PUSH_NOTIFICATION_CONFIGURED = 'push-notification/PUSH_NOTIFICATION_CONFIGURED';

const addPushTokenForUser = token =>
getUserToken().then(userId => {
  if (!userId) {
    return;
  }

  firebase
  .database()
  .ref('/pushTokens/' + userId)
  .set({ token })
  .then(snapshot => {
    console.log('pushToken added/updated for userId ' + userId);
  });
});

// # Actions
const showLocalNotification = (notif) => {
  console.log('I should show local notification', notif);
  const { notification } = notif;

  // Make sure we have actual notification
  if (!notification) {
    return;
  }

  FCM.presentLocalNotification({
    title: notification.title,
    body: notification.body,
    priority: "high",
    show_in_foreground: true,
    local: true
    // click_action: notification.click_action,
  });
}
export const configurePushNotifications = () => dispatch => {

  FCM.requestPermissions({
    badge: false,
    sound: true,
    alert: true
  });

  FCM.getFCMToken().then(token => {
    addPushTokenForUser(token);
  });


  FCM.getInitialNotification().then(notif => {
    console.log("INITIAL NOTIFICATION", notif);
    if (notif) {
      showLocalNotification(notif);
    }
  });

  FCM.on(FCMEvent.Notification, notif => {
    console.log("Notification", notif);

    if (Platform.OS ==='ios') {
      switch (notif._notificationType) {
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData);
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All);
          break;
      }
    }

    if (notif.opened_from_tray) {
      Alert.alert('Notification', 'opened from tray');
    }

    showLocalNotification(notif);
  });

/*
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('PUSH TOKEN:', token);
    addPushTokenForUser(token);
  },
  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification);

    notification.finish(PushNotificationIOS.FetchResult.NewData);
  },
  // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
  senderID: GCM_SENDER_ID,
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  // (optional) default: true
  //  - Specified if permissions (ios) and token (android and ios) will requested or not,
  //  - if not, you must call PushNotificationsHandler.requestPermissions() later

  requestPermissions: true,
});
*/

  return dispatch({ type: PUSH_NOTIFICATION_CONFIGURED });
};


const pushNotificationDefaults = {
  title: 'Futupolis',
  body: 'Notification',
};


export const sendLocalPushNotification = opts => (dispatch, getState) => {
  const pnOpts = Object.assign({}, pushNotificationDefaults, opts);

  PushNotification.localNotification({
    autoCancel: true,
    largeIcon: 'ic_launcher',
    smallIcon: 'ic_notification',

    color: theme.orange,
    vibrate: true,
    vibration: 300,
    ongoing: false,


    title: pnOpts.title,
    message: pnOpts.body,
    playSound: false,
    soundName: 'default',

});

  return dispatch({ type: PUSH_NOTIFICATION_SENT });
};

const initialState = fromJS({
  sent: false,
});

export default function pushNotification(state = initialState, action) {
  switch (action.type) {
    case PUSH_NOTIFICATION_SENT: {
      return state.set('sent', true);
    }

    default: {
      return state;
    }
  }
}
