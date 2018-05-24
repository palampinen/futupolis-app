import Auth0 from 'react-native-auth0';
import { fromJS } from 'immutable';
import md5 from 'blueimp-md5';

import { AsyncStorage } from 'react-native';

// import AsyncStorage from '../services/AsyncStorage';
import api from '../services/api';
import { updateProfile, putUser, getUser, setUserToStorage } from './registration';
import { fetchAppContent } from './app';
import { getTeams } from '../reducers/team';
import { createRequestActionTypes } from '../actions';

import { AUTH0_CLIENTID, AUTH0_DOMAIN } from '../../env';
import STORAGE_KEYS from '../constants/StorageKeys';

// # Action types
export const SET_TOKEN = 'SET_TOKEN';

export const SHOW_LOGIN_ERROR = 'SHOW_LOGIN_ERROR';
export const HIDE_LOGIN_ERROR = 'HIDE_LOGIN_ERROR';
export const SHOW_LOGIN_LOADER = 'SHOW_LOGIN_LOADER';
export const HIDE_LOGIN_LOADER = 'HIDE_LOGIN_LOADER';

const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENTID });

// # Selectors
export const isLoginFailed = state => state.auth.get('isLoginFailed', false);
export const isLoadingAppAuth = state => state.auth.get('isLoadingAppAuth', false);

// # Actions

// Clear login: AsyncStorage.clear();

const parseJwt = token => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// const setTokenToStore = payload => ({ type: SET_TOKEN, payload });
const setTokenToStore = setUserToStorage;

export const openLoginView = () => (dispatch, getState) => {
  const state = getState();
  const teams = getTeams(state);
  let tokens;

  // Hide possible login error
  dispatch({ type: HIDE_LOGIN_ERROR });
  dispatch({ type: SHOW_LOGIN_LOADER });
  dispatch(startLoginProcess());

  console.log('opening login view');

  auth0.webAuth
    .authorize({
      scope: 'openid profile email'/*, audience: `https://${AUTH0_DOMAIN}/userinfo` */,
    })
    .then(credentials => {
      console.log('Auth0 authorized', credentials);
      tokens = credentials;
      const { accessToken, idToken } = credentials;

      console.log(parseJwt(idToken));

      return auth0.auth.userInfo({ token: accessToken });
    })
    .then(profile => {
      console.log('Auth0 userinfo', profile);
      const userFields = {
        profilePicture: profile.picture,
        name: profile.name,
        selectedTeam: 1,
      };

      // Create userToken from email
      const email = profile.emailVerified ? profile.email : null;
      tokens.userToken = md5((email || '').toLowerCase());
      tokens.email = email;

      // Save tokens to Storage
      console.log('Save tokens to storage', tokens, STORAGE_KEYS.token);
      const saveTokenToStorage = AsyncStorage.setItem(STORAGE_KEYS.token, JSON.stringify(tokens));

      // Save profile to state
      // (we don't have user id yet, because user is not created)
      Promise.resolve(dispatch(updateProfile(userFields)))
        .then(saveTokenToStorage)
        .then(() => {
          // Set storage info to state
          // needed for user creation already (putUser)
          console.log('Save token to store');
          dispatch(setTokenToStore(tokens));

          // If user already exists
          return dispatch(getUser())
            .then(user => {
              if (!user) {
                console.log('Create user');
                return dispatch(saveUser());
              } else {
                console.log('User exists - retrieving user');
                dispatch(endLoginProcess());
                return dispatch(onLoginReady());
              }
            })
            .catch(() => dispatch(onLoginError()));
        });
    })
    .catch(err => {
      console.log('Auth0 login error', err);
      dispatch(onLoginError());
    });
};

// Need to keep flags of login completion in order to make sure user is cretated
const startLoginProcess = () => dispatch =>
  AsyncStorage.setItem(STORAGE_KEYS.loginInProgress, 'true');
const endLoginProcess = () => dispatch =>
  AsyncStorage.setItem(STORAGE_KEYS.loginInProgress, 'false');

export const saveUser = () => dispatch =>
  dispatch(putUser())
    .then(dispatch(endLoginProcess()))
    .then(dispatch(onLoginReady()));

const onLoginReady = () => dispatch => {
  return dispatch(fetchAppContent()).then(() => dispatch({ type: HIDE_LOGIN_LOADER }));
};

const onLoginError = () => dispatch => {
  dispatch(logoutUser());
  dispatch({ type: SHOW_LOGIN_ERROR });
  dispatch({ type: HIDE_LOGIN_LOADER });
};

// # Logout
// Remove user from AsyncStorage and state
export const logoutUser = () => dispatch => {
  AsyncStorage.removeItem(STORAGE_KEYS.token, () => {
    dispatch(setTokenToStore(null));
    AsyncStorage.clear();
  });
};

export const checkUserLogin = () => dispatch => {
  // Check that login is not in progress
  // This can happen when user has closed app
  // on login process before user is created but token already is stored

  console.log('is login in progress?');
  AsyncStorage.getItem(STORAGE_KEYS.loginInProgress, (error, loginInProgress) => {
    if (loginInProgress && loginInProgress === 'true') {
      return dispatch(logoutUser());
    }

    console.log('is user logged in?');
    // Check token
    AsyncStorage.getItem(STORAGE_KEYS.token, (err, token) => {
      if (token) {
        const tokenObj = JSON.parse(token);
        dispatch(setTokenToStore(tokenObj));

        // Get all app content
        return dispatch(fetchAppContent());
      }
    });
  });
};

const initialState = fromJS({
  isLoginFailed: false,
  isLoadingAppAuth: false,
});

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOGIN_ERROR:
      return state.set('isLoginFailed', true);

    case HIDE_LOGIN_ERROR:
      return state.set('isLoginFailed', false);

    case SHOW_LOGIN_LOADER:
      return state.set('isLoadingAppAuth', true);

    case HIDE_LOGIN_LOADER:
      return state.set('isLoadingAppAuth', false);

    default:
      return state;
  }
}
