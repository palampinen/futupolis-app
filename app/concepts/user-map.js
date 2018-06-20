// # concepts/map
// This is so called 'view concept'
// that combines core concepts like 'marker' and 'event'
import { AsyncStorage } from 'react-native';
import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { keyBy, map } from 'lodash';
import moment from 'moment';
import { createRequestActionTypes } from '../actions';

import SortTypes from '../constants/SortTypes';
import { getCurrentCityName } from './city';
import { getLocation, fetchUserLocation } from './location';
import {
  updateShowFilter as _updateShowFilter,
  toggleLocateMe as _toggleLocateMe,
} from '../actions/event';
import { fetchMarkers as _fetchMarkers } from '../actions/marker';
import { trackEvent } from '../services/analytics';
import { getFeedViewType } from './feed-view-type';

import { SET_COMMENTS } from './comments';
import { DELETE_FEED_ITEM } from '../actions/feed';
import { isLocating, getShowFilter, getEvents, getEventListState } from '../reducers/event';
import * as m from '../reducers/marker';
import api from '../services/api';
import LoadingStates from '../constants/LoadingStates';
import MarkerImages from '../constants/MarkerImages';
import time from '../utils/time';
import { BERLIN } from '../constants/Cities';
import StorageKeys from '../constants/StorageKeys';
import Tabs from '../constants/Tabs';

// # Constants
const MAP_QUERY_LIMIT = 15;
const ALL_CATEGORY = 'ALL';

// # Action types
const SET_MAP_POSTS = 'SET_MAP_POSTS';
const APPEND_POSTS = 'APPEND_POSTS';
const {
  GET_MAP_POSTS_REQUEST,
  GET_MAP_POSTS_SUCCESS,
  GET_MAP_POSTS_FAILURE,
} = createRequestActionTypes('GET_MAP_POSTS');

// # Selectors
const getSelectedCategory = state => state.usermap.get('selectedCategory');
export const getSelectedMarkerId = state => state.usermap.get('selectedMarkerId');
const getSelectedMarkerType = state => state.usermap.get('selectedMarkerType');
const getMapPostsState = state => state.usermap.get('loadingPosts');
export const getAllMapPostsInStore = state => state.usermap.get('posts') || List();

const isMapLoading = createSelector(
  m.getMarkerListState,
  getEventListState,
  getMapPostsState,
  (a, b, c) =>
    a === LoadingStates.LOADING || b === LoadingStates.LOADING || c === LoadingStates.LOADING
);

const getMarkers = createSelector(
  m.getMarkers,
  getAllMapPostsInStore,
  getSelectedCategory,
  (markers, posts) => {
    const postMarkers = posts.filter(post => post.has('location'));

    return postMarkers.concat(markers); // posts on top of markers
    // return markers.concat(postMarkers); // markers on top of posts
  }
);

const getMapMarkers = createSelector(getMarkers, markers =>
  markers.filter(marker => marker.has('location'))
);

const getMapMarkersCoords = createSelector(getMapMarkers, markers => {
  return markers.map(marker => marker.get('location')).toJS();
});

// Categories from markers got from marker endpoint only
// Hence cities
const getMarkerCategories = createSelector(m.getMarkers, markers => {
  const validMarkers = markers
    .filter(marker => marker.has('location'))
    .map(marker => marker.get('type', '').toUpperCase())
    .toSet()
    .toList(); // Immutable uniq

  // return validMarkers;
  return validMarkers.push(ALL_CATEGORY);
});

// (City) Markers Keyed by city
const getMarkerLocations = createSelector(m.getMarkers, markers => {
  const markersKeyByType = keyBy(markers.toJS(), 'type');

  return fromJS(markersKeyByType);
});

const getSelectedMarker = createSelector(
  getSelectedMarkerId,
  getSelectedMarkerType,
  getAllMapPostsInStore,
  m.getMarkers,
  getMarkerCategories,
  (id, type, posts, markers, categories) => {
    const isCategoryMarkerSelected = categories.indexOf(type) >= 0;
    const markerHayStack = isCategoryMarkerSelected ? markers : posts;

    return markerHayStack.find(post => post.get('id') === id);
  }
);

const isShowingMap = createSelector(getFeedViewType, viewType => viewType === Tabs.MAP);

// View concept selector
export const mapViewData = createStructuredSelector({
  currentCity: getCurrentCityName,
  locateMe: isLocating,
  showFilter: getShowFilter,
  markers: getMarkers,
  loading: isMapLoading,
  mapMarkers: getMapMarkers,
  selectedMarker: getSelectedMarker,
  selectedCategory: getSelectedCategory,
  categories: getMarkerCategories,
  markerLocations: getMarkerLocations,
  visiblemarkerCoords: getMapMarkersCoords,
  userLocation: getLocation,
  isShowingMap,
});

// # Action types & creators
const SELECT_MARKER = 'map/SELECT_MARKER';
const SELECT_CATEGORY = 'map/SELECT_CATEGORY';

export const fetchMarkers = _fetchMarkers;
export const updateShowFilter = _updateShowFilter;

// export const toggleLocateMe = _toggleLocateMe;
export const toggleLocateMe = () => (dispatch, getState) => {
  const isLocatingAlready = isLocating(getState());

  // fetch location if locateMe is OFF and will be toggled ON
  const maybeFetchLocationFirst = isLocatingAlready
    ? Promise.resolve(null)
    : Promise.resolve(dispatch(fetchUserLocation()));

  return maybeFetchLocationFirst.then(() => dispatch(_toggleLocateMe()));
};

export const selectMarker = (markerId, markerType) => ({
  type: SELECT_MARKER,
  markerId,
  markerType,
});

export const clearSelectedMarker = () => dispatch => dispatch(selectMarker(null, null));

export const selectCategory = payload => dispatch => {
  trackEvent('map', 'select-city', payload);

  // Not saving *ALL*-selection as default
  // since fetching data on start is not working
  if (payload !== ALL_CATEGORY) {
    AsyncStorage.setItem(StorageKeys.mapCategory, payload);
  }

  return Promise.resolve(dispatch({ type: SELECT_CATEGORY, payload })).then(() =>
    dispatch(fetchMapPosts())
  );
};

export const initializeUsersCitySelection = () => (dispatch, getState) =>
  AsyncStorage.getItem(StorageKeys.mapCategory)
    .then(city => {
      if (city) {
        return dispatch(selectCategory(city));
      }
      return Promise.resolve();
    })
    .catch(error => {
      console.log('error when initializing map category');
    });

export const fetchMapPosts = () => dispatch => {
  // Query Params
  const type = 'IMAGE'; // show only images
  const sort = SortTypes.SORT_NEW; // sort chronologically
  const since = moment()
    .subtract(2, 'weeks')
    .toISOString(); // 2 weeks ago
  const limit = MAP_QUERY_LIMIT; // limit to 30
  const locationRequired = true;

  const mapQueryParams = { sort, since, limit, type, locationRequired };

  dispatch({ type: GET_MAP_POSTS_REQUEST });

  return api
    .fetchModels('feed', mapQueryParams)
    .then(items => {
      dispatch({ type: GET_MAP_POSTS_SUCCESS });
      return dispatch({
        type: SET_MAP_POSTS,
        payload: items,
      });
    })
    .catch(error => dispatch({ type: GET_MAP_POSTS_FAILURE, error: true, payload: error }));
};

export const checkIfPostExists = item => (dispatch, getState) => {
  const currentPosts = getAllMapPostsInStore(getState());

  const itemIndex = currentPosts.findIndex(post => post.get('id') === item.get('id'));
  if (itemIndex < 0) {
    const updated = currentPosts.push(item);
    return dispatch({ type: SET_MAP_POSTS, payload: updated });
  }

  return Promise.resolve();
};

// # Reducer
const initialState = fromJS({
  selectedCategory: BERLIN,
  selectedMarkerType: null,
  posts: [],
  loadingPosts: false,
  showPostsSince: null,
});

export default function usermap(state = initialState, action) {
  switch (action.type) {
    case SELECT_MARKER: {
      return state.merge({
        selectedMarkerId: action.markerId,
        selectedMarkerType: action.markerType,
      });
    }

    case SELECT_CATEGORY: {
      return state.merge({
        selectedCategory: action.payload,
        selectedMarkerId: null,
        selectedMarkerType: null,
      });
    }

    case SET_MAP_POSTS:
      return state.set('posts', fromJS(action.payload));

    case GET_MAP_POSTS_REQUEST:
      return state.set('loadingPosts', LoadingStates.LOADING);

    case GET_MAP_POSTS_SUCCESS:
      return state.set('loadingPosts', LoadingStates.READY);

    case GET_MAP_POSTS_FAILURE:
      return state.set('loadingPosts', LoadingStates.FAILED);

    case SET_COMMENTS: {
      const list = state.get('posts');
      const itemIndex = list.findIndex(item => item.get('id') === action.payload.postId);

      if (itemIndex < 0) {
        console.log(
          'Tried to update comment count for map post, but it was not found from state:',
          itemIndex
        );
        return state;
      } else {
        console.log('updating comment count for map post', itemIndex);
        return state.setIn(
          ['posts', itemIndex, 'commentCount'],
          action.payload.comments.length || 0
        );
      }
    }

    case DELETE_FEED_ITEM:
      const originalList = state.get('posts');
      const itemIndex = originalList.findIndex(item => item.get('id') === action.item.id);

      if (itemIndex < 0) {
        console.log('Tried to delete item, but it was not found from state:', itemIndex);
        return state;
      } else {
        return state.set('posts', originalList.delete(itemIndex));
      }

    default: {
      return state;
    }
  }
}
