import { AppState, Alert } from 'react-native';
import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';
import { map, maxBy, parseInt, toString, get } from 'lodash';

import AsyncStorage from '../services/AsyncStorage';
import api from '../services/api';
import { createRequestActionTypes } from '../actions';
import StorageKeys from '../constants/StorageKeys';
import { getCurrentTab } from '../reducers/navigation';

import firebase from 'react-native-firebase';

// # Selectors
export const getNotifications = state => state.notifications.get('notifications', List()) || List();
export const getSingleNotificationId = state => state.notifications.get('singleNotificationId', null) || null;
export const isLoading = state => state.notifications.get('isLoading', false);

export const getSingleNotification = createSelector(
  getNotifications, getSingleNotificationId, (notifications, id) => {

    return notifications.get(id);
  });

export const getSortedNotifications = createSelector(
  getNotifications,
  (notifications) => notifications
    .toList()
    .sortBy(c => c.get('timestamp'))
    .reverse()
    .toList()
);

export const hasNewNotifications = createSelector(getSortedNotifications, notifications => {
  if (!notifications || !notifications.size) {
    return false;
  }

  return notifications.filter(n => n.get('new')).size;
})

export const getNotificationsData = createStructuredSelector({
  notifications: getSortedNotifications,
  isLoading,
  currentTab: getCurrentTab,
});

// # Action types & creators
const {
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_FAILURE,
} = createRequestActionTypes('GET_NOTIFICATIONS');

export const SET_NOTIFICATIONS = 'notifications/SET_NOTIFICATIONS';

export const SET_NOTIFICATION_ID = 'notifications/SET_NOTIFICATION_ID';

export const showNotificationItem = id => dispatch => {
  if (id) {
    updateLastCheckedId(id);
  }
  return dispatch({ type: SET_NOTIFICATION_ID, payload: id });
}

export const closeNotificationItem = () => dispatch => dispatch(showNotificationItem(null));

export const fetchNotifications = () => (dispatch, getState) => {
  dispatch({ type: GET_NOTIFICATIONS_REQUEST });

  const ref = firebase.database().ref('notifications');
  return ref.on('value', function(snapshot) {
    const newMessages = snapshot.val();
    const currentNotifications = getNotifications(getState());

    // Get last check time
    getCheckTime()
    .then(lastCheckTime => {

      const isExistingNotifications = currentNotifications && currentNotifications.size > 0;

      const newMessagesArray = map(newMessages, (item, id) => ({ id, timestamp: item.timestamp }));
      const latestMessage = maxBy(newMessagesArray, item => item.timestamp) || {};
      const latestMessageId = get(latestMessage, 'id');
      const isUnreadMessage = lastCheckTime && latestMessage && parseInt(latestMessage.timestamp) > parseInt(lastCheckTime);


      getLastCheckedId()
      .then(lastCheckedId => {
        const isAlreadySeenMessage = latestMessageId && lastCheckedId === latestMessageId;

        // Show popup in cases
        // - messages in store are updated
        // - or messages are loaded but user has not seen message yet (time and id rules)
        const isOkToShowPopup = latestMessageId && !isAlreadySeenMessage && (isExistingNotifications || isUnreadMessage)

        // # Popup latest message
        if (isOkToShowPopup) {
          dispatch(showNotificationItem(latestMessage.id))
        }
      })


      dispatch({
        type: SET_NOTIFICATIONS,
        payload: newMessages,
      });

      dispatch({ type: GET_NOTIFICATIONS_SUCCESS });

      // Update check time
      updateCheckTime();
    });

  });
};

// Get unread conversations count
const SET_UNREAD_NOTIFICATIONS_COUNT = 'notifications/SET_UNREAD_NOTIFICATIONS_COUNT';

const UPDATE_NOTIFICATION_CHECK_TIME = 'notifications/UPDATE_NOTIFICATION_CHECK_TIME';

const updateCheckTime = () => AsyncStorage.setItem(StorageKeys.notificationsLastChecked, toString(new Date().getTime()));
const getCheckTime = () => AsyncStorage.getItem(StorageKeys.notificationsLastChecked);

const updateLastCheckedId = id => AsyncStorage.setItem(StorageKeys.lastNotificationId, id);
const getLastCheckedId = () => AsyncStorage.getItem(StorageKeys.lastNotificationId);

// # Reducer
const initialState = fromJS({
  notifications: [],
  isLoading: false,
  singleNotificationId: null,
});

export default function notifications(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATIONS: {
      return state.set('notifications', fromJS(action.payload));
    }

    case GET_NOTIFICATIONS_REQUEST:
      return state.set('isLoading', true);

    case GET_NOTIFICATIONS_SUCCESS:
    case GET_NOTIFICATIONS_FAILURE: {
      return state.set('isLoading', false);
    }

    case SET_NOTIFICATION_ID:
      return state.set('singleNotificationId', action.payload);

    default: {
      return state;
    }
  }
}
