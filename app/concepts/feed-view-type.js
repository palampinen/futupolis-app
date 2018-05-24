import { fromJS } from 'immutable';
import Tabs from '../constants/Tabs';
import { fetchFeed, refreshFeed } from '../actions/feed';
import { fetchPostsForCity, selectMarker, clearSelectedMarker, checkIfPostExists } from './user-map';

// # Action creators
export const SET_FEED_VIEW_TYPE = 'sortType/SET_FEED_VIEW_TYPE';
export const setFeedViewType = (payload) => dispatch =>
  Promise.resolve(
    dispatch({ type: SET_FEED_VIEW_TYPE, payload })
  )
  .then(() => {
    let refreshFn;
    if (payload === Tabs.FEED){
      dispatch(clearSelectedMarker());
      refreshFn = refreshFeed;
    } else {
      refreshFn = fetchPostsForCity;
    }

    return dispatch(refreshFn());
  });


export const showMapView = () => dispatch => dispatch(setFeedViewType(Tabs.MAP));
export const showFeedView = () => dispatch => dispatch(setFeedViewType(Tabs.FEED));

export const openFeedItemInMap = (item) => dispatch =>
  Promise.resolve(dispatch(showMapView()))
  .then(() => dispatch(checkIfPostExists(fromJS(item))))
  .then(() => {
    return dispatch(selectMarker(item.id))
  })


// # Selectors
export const getFeedViewType = state => state.feedViewType.get('type');


// # Reducer
const initialState = fromJS({
  type: Tabs.FEED
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_FEED_VIEW_TYPE: {
      return state.set('type', action.payload);
    }

    default: {
      return state;
    }
  }
}
