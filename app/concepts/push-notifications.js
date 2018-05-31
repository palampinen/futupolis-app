import { Platform, Alert, AsyncStorage, AppState } from 'react-native';
import { fromJS } from 'immutable';
import { get, has, set, isFunction } from 'lodash';
import firebase from 'react-native-firebase';
// import PushNotification from 'react-native-push-notification-ce';
// import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

import { changeTab, changeTripTab } from '../actions/navigation';
import { showNotificationItem } from './notifications';
import { GCM_SENDER_ID } from '../../env';
import getUserToken from '../services/token';
import Tabs from '../constants/Tabs';

import theme from '../style/theme';

// # Action Types
export const PUSH_NOTIFICATION_SENT = 'push-notification/PUSH_NOTIFICATION_SENT';
export const PUSH_NOTIFICATION_CONFIGURED = 'push-notification/PUSH_NOTIFICATION_CONFIGURED';

const navigateToNotificationList = notif => dispatch => {
  const notificationId = get(notif, 'notification.messageId');
  const killedNotificationId = get(notif, ['data', 'gcm.notification.messageId']);
  // const androidPayloadNotificationId = get(notif, ['data', 'messageId']);

  const messageId = notificationId || killedNotificationId;

  // Alert.alert('Message ID', messageId);

  if (!isFunction(dispatch)) {
    return;
  }

  if (messageId) {
    // show popup notification
    dispatch(showNotificationItem(messageId));
  } else {
    // just show notif tab
    dispatch(changeTab(Tabs.TRIP));
    dispatch(changeTripTab(Tabs.NOTIFICATIONS));
  }
};

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
// const showLocalNotification = (notif) => {
//   console.log('I should show local notification', notif);
//   // If app is killed or background, notification payload is in notif.notification
//   const { notification } = notif;

//   // If app is foreground, notification payload might be in notif.aps.alert
//   const foreGroundNotification = get(notif, 'aps.alert');

//   const notificationPayload = notification || foreGroundNotification;

//   // Make sure we have actual notification
//   if (!notificationPayload) {
//     return;
//   }

//   FCM.presentLocalNotification({
//     title: notificationPayload.title,
//     body: notificationPayload.body,
//     priority: 'high',
//     show_in_foreground: true,
//     local: true,

//     // Android
//     icon: 'ic_notification',
//     color: theme.orange,
//     vibrate: 300,
//     wake_screen: true
//     // click_action: notification.click_action,
//   });
// }

// # App Killed State
// function registerKilledListener() {
//   // these callback will be triggered even when app is killed
//   FCM.on(FCMEvent.Notification, notif => {
//     AsyncStorage.setItem('lastNotification', JSON.stringify(notif));
//   });
// }

// registerKilledListener();

// # App Foreground/Background State
// function registerAppListener(dispatch) {
//   FCM.on(FCMEvent.Notification, notif => {
//     console.log("Notification", notif);

//     if (Platform.OS ==='ios') {
//       switch (notif._notificationType) {
//         case NotificationType.Remote:
//           notif.finish(RemoteNotificationResult.NewData);
//           break;
//         case NotificationType.NotificationResponse:
//           notif.finish();
//           break;
//         case NotificationType.WillPresent:
//           notif.finish(WillPresentNotificationResult.All);
//           break;
//       }
//     }

//     if (notif.opened_from_tray) {
//       Alert.alert('Notification', 'opened from tray');
//       dispatch(navigateToNotificationList(notif));
//     }

//     showLocalNotification(notif);
//   });
// }

const FCM = firebase.messaging();

export const configurePushNotifications = () => dispatch => {
  FCM.requestPermission();

  FCM.getToken().then(addPushTokenForUser);

  // Listen for Notifications
  this.notificationDisplayedListener = firebase
    .notifications()
    .onNotificationDisplayed(notification => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
    });

  this.notificationListener = firebase.notifications().onNotification(notification => {
    // Process your notification as required
  });

  // App in Foreground and background
  this.notificationOpenedListener = firebase
    .notifications()
    .onNotificationOpened(notificationOpen => {
      // Get the action triggered by the notification being opened
      const action = notificationOpen.action;
      // Get information about the notification that was opened
      const notification = notificationOpen.notification;

      console.log(notificationOpen);
      // Alert.alert('Background App open', JSON.stringify(notification, getCircularReplacer()));
      if (dispatch) {
        dispatch(navigateToNotificationList(notification));
      }
    });

  firebase
    .notifications()
    .getInitialNotification()
    .then(notificationOpen => {
      if (notificationOpen) {
        // App was opened by a notification
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;

        // console.log(notificationOpen);
        // Alert.alert('Killed App open', getCircularReplacer());

        if (dispatch) {
          dispatch(navigateToNotificationList(notification));
        }
      }
    });

  // AsyncStorage.getItem('lastNotification').then(data => {
  //   if (data) {
  //     // if notification arrives when app is killed, it should still be logged here
  //     console.log('last notification', JSON.parse(data));
  //     Alert.alert('Last notification', data);

  //     dispatch(navigateToNotificationList(JSON.parse(data)));
  //     AsyncStorage.removeItem('lastNotification');
  //   }
  // });

  // FCM.requestPermissions({
  //   badge: false,
  //   sound: true,
  //   alert: true
  // });

  // FCM.getFCMToken().then(token => {
  //   addPushTokenForUser(token);
  // });

  // FCM.getInitialNotification().then(notif => {
  //   console.log("INITIAL NOTIFICATION", notif);
  //   // if (notif) {
  //   //   showLocalNotification(notif);
  //   // }
  // });

  // FCM.enableDirectChannel();

  // registerAppListener(dispatch);

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

const getCircularReplacer = () => {
  let seen = [];
  return (key, val) => {
    if (val != null && typeof val == 'object') {
      if (seen.indexOf(val) >= 0) {
        return;
      }
      seen.push(val);
    }
    return val;
  };
};

/*
const getCircularReplacer = () => {
  const seen = {};
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (has(seen, value)) {
        return;
      }
      set(seen, value);
    }
    return value;
  };
};
*/

// const pushNotificationDefaults = {
//   title: 'Futupolis',
//   body: 'Notification',
// };

// export const sendLocalPushNotification = opts => (dispatch, getState) => {
//   const pnOpts = Object.assign({}, pushNotificationDefaults, opts);

//   PushNotification.localNotification({
//     autoCancel: true,
//     largeIcon: 'ic_launcher',
//     smallIcon: 'ic_notification',

//     color: theme.orange,
//     vibrate: true,
//     vibration: 300,
//     ongoing: false,

//     title: pnOpts.title,
//     message: pnOpts.body,
//     playSound: false,
//     soundName: 'default',

// });

//   return dispatch({ type: PUSH_NOTIFICATION_SENT });
// };

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
