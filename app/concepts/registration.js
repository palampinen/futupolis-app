import DeviceInfo from 'react-native-device-info';
import { fromJS, Map } from 'immutable';
import { createSelector } from 'reselect';
import _ from 'lodash';

import AsyncStorage from '../services/AsyncStorage';
import { createRequestActionTypes } from '../actions';
import { NO_SELECTED_CITY_FOUND } from './city';
import { getTeams } from '../reducers/team';

import api from '../services/api';
import { APP_STORAGE_KEY, AUTH_CLIENTID, AUTH_DOMAIN } from '../../env';
import namegen from '../services/namegen';
import getUserToken from '../services/token';
import Tabs from '../constants/Tabs';

// # Action types
const { CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE } = createRequestActionTypes(
  'CREATE_USER'
);
const { GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAILURE } = createRequestActionTypes(
  'GET_USER'
);

const {
  POST_PROFILE_PICTURE_REQUEST,
  POST_PROFILE_PICTURE_SUCCESS,
  POST_PROFILE_PICTURE_FAILURE,
} = createRequestActionTypes('POST_PROFILE_PICTURE');

const OPEN_REGISTRATION_VIEW = 'OPEN_REGISTRATION_VIEW';
const CLOSE_REGISTRATION_VIEW = 'CLOSE_REGISTRATION_VIEW';
const UPDATE_NAME = 'UPDATE_NAME';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const RESET = 'RESET';
const SELECT_TEAM = 'SELECT_TEAM';
const CLOSE_TEAM_SELECTOR = 'CLOSE_TEAM_SELECTOR';
const DISMISS_INTRODUCTION = 'DISMISS_INTRODUCTION';
const SET_USER_STORAGE = 'SET_USER_STORAGE';

// # Selectors
export const getUserId = state => state.registration.get('userId');
export const getUserPicture = state => state.registration.get('profilePicture');
export const getUserName = state => state.registration.get('name');
export const getUserTeamId = state => state.registration.get('selectedTeam', 0);
export const getStoredUser = state =>
  state.registration.get('storageUser', fromJS({})) || fromJS({});
export const getUserTeam = createSelector(getUserTeamId, getTeams, (teamId, teams) =>
  teams.find(item => item.get('id') === teamId)
);

export const isUserLoggedIn = createSelector(getStoredUser, user => !!user && !user.isEmpty());

// # Action creators
export const openRegistrationView = () => {
  return { type: OPEN_REGISTRATION_VIEW };
};

export const closeRegistrationView = () => {
  return { type: CLOSE_REGISTRATION_VIEW };
};

export const dismissIntroduction = () => {
  return { type: DISMISS_INTRODUCTION };
};

export const putUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_USER_REQUEST });

    const state = getState();
    const name = state.registration.get('name');
    const team = state.registration.get('selectedTeam');
    const profilePicture = state.registration.get('profilePicture');

    return getUserToken().then(uuid =>
      api
        .putUser({ uuid, name, team, profilePicture })
        .then(response => {
          dispatch({ type: CREATE_USER_SUCCESS });
          dispatch({ type: CLOSE_REGISTRATION_VIEW });
        })
        .catch(error => dispatch({ type: CREATE_USER_FAILURE, error: error }))
    );
  };
};

export const selectTeam = team => {
  return (dispatch, getState) => {
    const state = getState();

    const teams = state.team.get('teams').toJS();
    const currentName = state.registration.get('name');
    const currentTeam = _.find(teams, ['id', team]);

    dispatch({ type: CLOSE_TEAM_SELECTOR });
    dispatch({ type: SELECT_TEAM, payload: team });
    // Generate new name if not given name
    if (!currentName) {
      dispatch({ type: UPDATE_NAME, payload: namegen.generateName(currentTeam.name) });
    }
  };
};

export const updateName = name => ({ type: UPDATE_NAME, payload: name });

export const updateProfile = payload => ({ type: UPDATE_PROFILE, payload });

export const reset = () => {
  return { type: RESET };
};

export const postProfilePicture = imageData => (dispatch, getState) => {
  if (!imageData) {
    return;
  }

  dispatch({ type: POST_PROFILE_PICTURE_REQUEST });

  const name = getUserName(getState());
  const team = getUserTeamId(getState());

  return getUserToken().then(uuid =>
    api
    .putUser({ uuid, name, team, imageData })
    .then(response => {
      Promise.resolve(dispatch(getUser())).then(() => {
        dispatch({ type: POST_PROFILE_PICTURE_SUCCESS });
      });
    })
    .catch(error => dispatch({ type: POST_PROFILE_PICTURE_FAILURE, error: error }))
  );
};


export const generateName = () => {
  return (dispatch, getStore) => {
    const currentTeamId = getStore().registration.get('selectedTeam');

    if (currentTeamId) {
      const teams = getStore()
        .team.get('teams')
        .toJS();
      const selectedTeam = _.find(teams, ['id', currentTeamId]);
      if (selectedTeam) {
        dispatch({ type: UPDATE_NAME, payload: namegen.generateName(selectedTeam.name) });
      }
    }
  };
};

export const getUser = () => dispatch => {
  dispatch({ type: GET_USER_REQUEST });

  return getUserToken().then(uuid =>
    api
      .getUser(uuid)
      .then(user => {
        dispatch({ type: GET_USER_SUCCESS, payload: user });
        return user;
      })
      .catch(error => {
        dispatch({ type: GET_USER_FAILURE, error: error });
      })
  );
};

// # Login
export const setUserToStorage = payload => ({ type: SET_USER_STORAGE, payload });

/*
const Auth0Lock = require('react-native-lock');
const lock = new Auth0Lock({ clientId: AUTH_CLIENTID, domain: AUTH_DOMAIN, useBrowser: true });
const userKey = `${APP_STORAGE_KEY}:user`;

export const openLoginView = () => (dispatch, getState) => {
  const state = getState();
  const teams = getTeams(state);

  lock.show(
    {
      connections: ['google-oauth2'],
    },
    (err, profile, token) => {
      const userFields = {
        profilePicture: profile.picture,
        name: profile.name,
        selectedTeam: teams.getIn([0, 'id'], 1),
      };

      // Save profile to state
      // (we don't have user id yet, because user is not created)
      Promise.resolve(dispatch(updateProfile(userFields))).then(() => {
        // Save profile to Storage
        AsyncStorage.setItem(userKey, JSON.stringify(profile), () => {
          // Set storage info to state
          dispatch(setUserToStorage(profile));

          // Send profile info to server
          // and then get created user
          Promise.resolve(dispatch(putUser())).then(() => dispatch(getUser()));
        });
      });
    }
  );
};
*/

// # Logout
// Remove user from AsyncStorage and state
export const logoutUser = () => dispatch => {
  AsyncStorage.removeItem(userKey, () => {
    dispatch(setUserToStorage(null));
  });
};

export const checkUserLogin = () => (dispatch, getState) => {
  AsyncStorage.getItem(userKey, (err, user) => {
    if (!user) {
      // # No need to show login here
      //    App Intro is shown when user has not logged and
      //    from there user has to login in order to continue
    } else {
      const userObj = JSON.parse(user);
      dispatch(setUserToStorage(userObj));
    }
  });
};

const initialState = fromJS({
  isRegistrationViewOpen: false,
  name: '',
  selectedTeam: 0,
  profilePicture: '',
  isLoading: false,
  isError: false,
  isIntroductionDismissed: false,
  userId: '',
  storageUser: {},
});

export default function registration(state = initialState, action) {
  switch (action.type) {
    case OPEN_REGISTRATION_VIEW:
      return state.set('isRegistrationViewOpen', true);
    case CLOSE_REGISTRATION_VIEW:
      return state.merge({
        isIntroductionDismissed: false,
        isRegistrationViewOpen: false,
      });
    case DISMISS_INTRODUCTION:
      return state.set('isIntroductionDismissed', true);
    case UPDATE_NAME:
      return state.set('name', action.payload);
    case UPDATE_PROFILE: {
      const { name, profilePicture, selectedTeam } = action.payload;
      return state.merge({ name, profilePicture, selectedTeam });
    }
    case SELECT_TEAM:
      return state.set('selectedTeam', action.payload);
    case RESET:
      return state.merge({
        name: '',
        selectedTeam: 0,
      });
    case CREATE_USER_REQUEST:
      return state.merge({
        isLoading: true,
        isError: false,
      });
    case GET_USER_REQUEST:
      return state.set('isLoading', true);
    case CREATE_USER_SUCCESS:
      return state.merge({
        isLoading: false,
        isError: false,
      });
    case CREATE_USER_FAILURE:
    case GET_USER_FAILURE:
      return state.merge({
        isLoading: false,
        isError: true,
      });
    case NO_SELECTED_CITY_FOUND:
      return state.merge({
        isRegistrationViewOpen: action.payload,
      });
    case GET_USER_SUCCESS:
      return state.merge({
        userId: action.payload.id,
        name: action.payload.name,
        selectedTeam: action.payload.team,
        profilePicture: action.payload.profilePicture,
        uuid: action.payload.uuid,
        isLoading: false,
      });
    case SET_USER_STORAGE:
      return state.set('storageUser', fromJS(action.payload));

    default:
      return state;
  }
}
