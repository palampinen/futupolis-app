import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { parseInt } from 'lodash';

import api from '../services/api';
import { createRequestActionTypes } from '../actions';
import { VOTE_FEED_ITEM_REQUEST, SET_COMMENTS } from '../actions/feed';
import { getUserId } from './registration';

// # Selectors
export const getUserImages = state => state.user.getIn(['profile', 'images'], List()) || List();
export const getUserPicture = state => state.user.getIn(['profile', 'profilePicture'], '');
export const getUserTeam = state => state.user.getIn(['profile', 'team'], List()) || List();
export const getTotalSimas = state => state.user.getIn(['profile', 'numSimas'], '') || '';
export const getSelectedUser = state => state.user.get('selectedUser', Map()) || Map();
export const isLoadingUserImages = state => state.user.get('isLoading', false) || false;

export const getMyImages = state => state.user.getIn(['myProfile', 'images'], List()) || List();
export const getMyTeam = state => state.user.getIn(['myProfile', 'team']);
export const getMyTotalSimas = state => state.user.getIn(['myProfile', 'numSimas'], '') || '';

export const getTotalVotesForUser = createSelector(getUserImages, posts => {
  const sumOfVotes = posts.reduce((total, post) => total + parseInt(post.get('votes', 0), 10), 0);
  return sumOfVotes;
});

export const getMyTotalVotes = createSelector(getMyImages, posts => {
  const sumOfVotes = posts.reduce((total, post) => total + parseInt(post.get('votes', 0), 10), 0);
  return sumOfVotes;
});

// # Action creators
const {
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAILURE,
} = createRequestActionTypes('GET_USER_PROFILE');
const SET_USER_PROFILE = 'SET_USER_PROFILE';

export const fetchUserImages = (userId, target = 'profile') => dispatch => {
  dispatch({ type: GET_USER_PROFILE_REQUEST });
  return api
    .getUserProfile(userId)
    .then(images => {
      dispatch({
        type: SET_USER_PROFILE,
        payload: { images, target },
      });
      dispatch({ type: GET_USER_PROFILE_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_USER_PROFILE_FAILURE, error: true, payload: error }));
};

export const fetchMyImages = () => (dispatch, getState) => {
  const id = getUserId(getState());
  dispatch(fetchUserImages(id, 'myProfile'));
};

// # Reducer
const initialState = fromJS({
  profile: {},
  myProfile: {},
  isLoading: false,
  selectedUser: null,
});

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE: {
      if (!action.payload.target) {
        return state;
      }
      return state.set(action.payload.target, fromJS(action.payload.images));
    }

    case GET_USER_PROFILE_REQUEST: {
      return state.merge({
        profile: Map(),
        isLoading: true,
      });
    }

    case GET_USER_PROFILE_SUCCESS:
    case GET_USER_PROFILE_FAILURE: {
      return state.set('isLoading', false);
    }

    case VOTE_FEED_ITEM_REQUEST: {
      const list = state.getIn(['profile', 'images'], List());
      const voteItemIndex = list.findIndex(item => item.get('id') === action.feedItemId);
      if (voteItemIndex < 0) {
        return state;
      } else {
        return state.mergeIn(['profile', 'images', voteItemIndex], {
          userVote: action.value,
          votes: action.votes,
        });
      }
    }

    case SET_COMMENTS: {
      const list = state.getIn(['profile', 'images'], List());
      const itemIndex = list.findIndex(item => item.get('id') === action.payload.postId);

      if (itemIndex < 0) {
        console.log(
          'Tried to update comment count for user image posts, but it was not found from state:',
          itemIndex
        );
        return state;
      } else {
        console.log('updating comment count for user image posts', itemIndex);
        return state.setIn(
          ['profile', 'images', itemIndex, 'commentCount'],
          action.payload.comments.length || 0
        );
      }
    }

    default: {
      return state;
    }
  }
}
