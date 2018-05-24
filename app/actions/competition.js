'use strict';

import { isNil } from 'lodash';
import api from '../services/api';
import ActionTypes from '../constants/ActionTypes';
import * as NotificationMessages from '../utils/notificationMessage';
import { refreshFeed } from './feed';
import { sortFeedChronological } from '../concepts/sortType';
import { getCityId } from '../concepts/city';
import { fetchUserLocation, getLocation } from '../concepts/location';
import { createRequestActionTypes } from '.';

const { POST_ACTION_REQUEST, POST_ACTION_SUCCESS, POST_ACTION_FAILURE } = createRequestActionTypes(
  'POST_ACTION'
);
const {
  GET_ACTION_TYPES_REQUEST,
  GET_ACTION_TYPES_SUCCESS,
  GET_ACTION_TYPES_FAILURE,
} = createRequestActionTypes('GET_ACTION_TYPES');

const OPEN_TEXTACTION_VIEW = 'OPEN_TEXTACTION_VIEW';
const CLOSE_TEXTACTION_VIEW = 'CLOSE_TEXTACTION_VIEW';
const OPEN_CHECKIN_VIEW = 'OPEN_CHECKIN_VIEW';
const CLOSE_CHECKIN_VIEW = 'CLOSE_CHECKIN_VIEW';
const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';
const UPDATE_COOLDOWNS = 'UPDATE_COOLDOWNS';
const SET_EDITABLE_IMAGE = 'SET_EDITABLE_IMAGE';
const CLEAR_EDITABLE_IMAGE = 'CLEAR_EDITABLE_IMAGE';

const openTextActionView = () => ({ type: OPEN_TEXTACTION_VIEW });

const closeTextActionView = () => ({ type: CLOSE_TEXTACTION_VIEW });

const openCheckInView = () => ({ type: OPEN_CHECKIN_VIEW });

const closeCheckInView = () => ({ type: CLOSE_CHECKIN_VIEW });

const _postAction = (payload, addLocation) => {
  return (dispatch, getState) => {
    dispatch({ type: POST_ACTION_REQUEST });

    const state = getState();

    const maybeFetchLocation = addLocation
      ? Promise.resolve(dispatch(fetchUserLocation()))
      : Promise.resolve(null);

    return maybeFetchLocation
      .then(res => {
        const state = getState();
        const maybeLocationToPost = addLocation ? getLocation(state) : null;

        return api.postAction(payload, maybeLocationToPost);
      })
      .then(response => {
        // Set feed sort to 'new' if posted image or text, otherwise just refresh
        if ([ActionTypes.TEXT, ActionTypes.IMAGE].indexOf(payload.type) >= 0) {
          dispatch(sortFeedChronological());
        } else {
          dispatch(refreshFeed());
        }

        dispatch({ type: POST_ACTION_SUCCESS, payload: { type: payload.type } });
        dispatch({ type: SHOW_NOTIFICATION, payload: NotificationMessages.getMessage(payload) });

        setTimeout(() => {
          dispatch({ type: HIDE_NOTIFICATION });
        }, 3000);
      })
      .catch(e => {
        console.log('Error catched on competition action post!', e);

        if (e.response.status === 429) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: NotificationMessages.getRateLimitMessage(payload),
          });
        } else if (e.response.status === 403) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: NotificationMessages.getInvalidEventMessage(payload),
          });
        } else {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: NotificationMessages.getErrorMessage(payload),
          });
        }
        dispatch({ type: POST_ACTION_FAILURE, error: e });

        setTimeout(() => {
          dispatch({ type: HIDE_NOTIFICATION });
        }, 3000);
      });
  };
};

const postAction = type => {
  return _postAction({
    type,
  });
};

const postText = text => dispatch =>
  Promise.resolve(
    dispatch(
      _postAction({
        type: ActionTypes.TEXT,
        text: text,
      })
    )
  ).then(() => {
    setTimeout(() => {
      dispatch(closeTextActionView());
    }, 2000);
  });

const postImage = ({ image, text, imageText, imageTextPosition, addLocation }) => {
  const postObject = Object.assign(
    {
      type: ActionTypes.IMAGE,
      imageData: image,
    },
    !!text ? { text } : {},
    !!imageText ? { imageText, imageTextPosition } : {}
  );
  return _postAction(postObject, addLocation);
};

const checkIn = eventId => {
  return _postAction({
    type: ActionTypes.CHECK_IN_EVENT,
    eventId: eventId,
  });
};

const fetchActionTypes = () => {
  return dispatch => {
    dispatch({ type: GET_ACTION_TYPES_REQUEST });
    api
      .fetchModels('actionTypes')
      .then(actionTypes => dispatch({ type: GET_ACTION_TYPES_SUCCESS, payload: actionTypes }))
      .catch(e => dispatch({ type: GET_ACTION_TYPES_FAILURE, error: true, payload: e }));
  };
};

const updateCooldowns = () => {
  return { type: UPDATE_COOLDOWNS };
};

const setEditableImage = editableImage => ({ type: SET_EDITABLE_IMAGE, payload: editableImage });
const clearEditableImage = () => ({ type: CLEAR_EDITABLE_IMAGE });

export {
  POST_ACTION_REQUEST,
  POST_ACTION_SUCCESS,
  POST_ACTION_FAILURE,
  GET_ACTION_TYPES_REQUEST,
  GET_ACTION_TYPES_SUCCESS,
  GET_ACTION_TYPES_FAILURE,
  OPEN_TEXTACTION_VIEW,
  OPEN_CHECKIN_VIEW,
  CLOSE_CHECKIN_VIEW,
  CLOSE_TEXTACTION_VIEW,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  UPDATE_COOLDOWNS,
  SET_EDITABLE_IMAGE,
  CLEAR_EDITABLE_IMAGE,
  postAction,
  postText,
  postImage,
  openCheckInView,
  checkIn,
  closeCheckInView,
  openTextActionView,
  closeTextActionView,
  fetchActionTypes,
  updateCooldowns,
  setEditableImage,
  clearEditableImage,
};
