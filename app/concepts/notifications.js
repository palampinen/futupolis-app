import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';

import AsyncStorage from '../services/AsyncStorage';
import api from '../services/api';
import { createRequestActionTypes } from '../actions';
import StorageKeys from '../constants/StorageKeys';
import { getCurrentTab } from '../reducers/navigation';

import firebase from 'react-native-firebase';

// # Selectors
export const getNotifications = state => state.notifications.get('notifications', List()) || List();
export const getUnreadConversationCount = state =>
  state.notifications.get('unreadNotifications', 0);
export const getLastNotificationCheckTime = state =>
  state.notifications.get('lastNotificationCheck', null);
export const getPrevNotificationCheckTime = state =>
  state.notifications.get('prevNotificationCheck', null);
export const isLoading = state => state.notifications.get('isLoading', false);

export const getSortedNotifications = createSelector(
  getNotifications,
  getPrevNotificationCheckTime,
  (notifications, prevCheckTime) => {
    return (
      notifications
        .toList()
        .sortBy(c => c.get('timestamp'))
        .reverse()
        .map(c => c.set('new', !!prevCheckTime && prevCheckTime < c.get('timestamp')))
        .toList()
    );
  }
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

export const fetchNotifications = () => dispatch => {
  dispatch({ type: GET_NOTIFICATIONS_REQUEST });

  const ref = firebase.database().ref('notifications');
  return ref.on('value', function(snapshot) {
    dispatch({
      type: SET_NOTIFICATIONS,
      payload: snapshot.val(),
    });

    AsyncStorage.getItem(StorageKeys.notificationsLastChecked)
    .then(lastCheck => {
      let since = lastCheck || moment().toISOString();
      dispatch(storePreviousCheckTime(since));
      dispatch(updateCheckTime());
    });

    dispatch({ type: GET_NOTIFICATIONS_SUCCESS });
  });

  // return api
  //   .fetchModels('notifications')
  //   .then(conversations => {
  //     dispatch({
  //       type: SET_NOTIFICATIONS,
  //       payload: { conversations },
  //     });
  //     dispatch({ type: GET_NOTIFICATIONS_SUCCESS });

  //     // Update check time and set unread conversations to 0
  //     dispatch(updateCheckTimeInStorage());
  //     dispatch({ type: SET_UNREAD_NOTIFICATIONS_COUNT, payload: 0 });
  //   })
  //   .catch(error => dispatch({ type: GET_NOTIFICATIONS_FAILURE, error: true, payload: error }));
};

// Get unread conversations count
const SET_UNREAD_NOTIFICATIONS_COUNT = 'notifications/SET_UNREAD_NOTIFICATIONS_COUNT';

// export const fetchUnreadConversationCount = () => (dispatch, getState) => {
//   const params = {};

//   AsyncStorage.getItem(StorageKeys.notificationsLastChecked).then(lastCheck => {
//     let since = lastCheck || moment().toISOString();

//     params.since = since;
//     dispatch(storePreviousCheckTime(since));

//     dispatch(updateCheckTime());

//     return api.fetchModels('conversationsCount', params).then(count =>
//       dispatch({
//         type: SET_UNREAD_NOTIFICATIONS_COUNT,
//         payload: count,
//       })
//     );
//   });
// };

const UPDATE_NOTIFICATION_CHECK_TIME = 'notifications/UPDATE_NOTIFICATION_CHECK_TIME';
const UPDATE_PREV_NOTIFICATION_CHECK_TIME = 'notifications/UPDATE_PREV_NOTIFICATION_CHECK_TIME';
const updateCheckTimeInStorage = () => dispatch => {
  const now = moment().valueOf();

  // update storage
  return AsyncStorage.setItem(StorageKeys.notificationsLastChecked, now);
};

const updateCheckTime = () => dispatch => {
  const now = moment().valueOf();
  // update store
  return dispatch({ type: UPDATE_NOTIFICATION_CHECK_TIME, payload: now });
};

const storePreviousCheckTime = time => ({
  type: UPDATE_PREV_NOTIFICATION_CHECK_TIME,
  payload: time,
});

// # Reducer
const initialState = fromJS({
  notifications: [],
  unreadNotifications: 0,
  lastNotificationCheck: null,
  prevNotificationCheck: null,
  isLoading: false,
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

    case SET_UNREAD_NOTIFICATIONS_COUNT:
      return state.set('unreadNotifications', action.payload);

    case UPDATE_NOTIFICATION_CHECK_TIME:
      return state.set('lastNotificationCheck', action.payload);

    case UPDATE_PREV_NOTIFICATION_CHECK_TIME:
      return state.set('prevNotificationCheck', action.payload);

    default: {
      return state;
    }
  }
}
