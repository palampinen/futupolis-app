// # Lightbox concept
import { fromJS, Map } from 'immutable';
import { createSelector } from 'reselect';
import { isNil, toString } from 'lodash';

import { getAllPostsInStore } from '../reducers/feed';

// # Action types
const OPEN_LIGHTBOX = 'lightbox/OPEN_LIGHTBOX';
const CLOSE_LIGHTBOX = 'lightbox/CLOSE_LIGHTBOX';

// # Selectors
export const isLightBoxOpen = state => state.lightbox.get('isLightBoxOpen', false);
export const getLightBoxItemId = state => state.lightbox.get('lightBoxItemId', null);

export const getLightboxItem = createSelector(
  getLightBoxItemId,
  getAllPostsInStore,
  (id, allPosts) => {
    if (isNil(id)) {
      return Map();
    }

    return allPosts.find(item => toString(item.get('id', '')) === toString(id));
  }
);

// # Actions
export const openLightBox = itemId => ({ type: OPEN_LIGHTBOX, payload: itemId });
export const closeLightBox = () => ({ type: CLOSE_LIGHTBOX });

// # Reducer
const initialState = fromJS({
  lightBoxItem: {},
  lightBoxItemId: null,
  isLightBoxOpen: false,
});

export default function lightbox(state = initialState, action) {
  switch (action.type) {
    case OPEN_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: true,
        lightBoxItemId: action.payload,
      });

    case CLOSE_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: false,
        lightBoxItemId: null,
      });

    default:
      return state;
  }
}
