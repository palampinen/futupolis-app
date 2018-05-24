import { fetchActionTypes } from '../actions/competition';
import { fetchEvents } from '../actions/event';
import { fetchFeed } from '../actions/feed';
import { getUser } from './registration';
import { fetchNotifications } from './notifications';
import { fetchMarkers } from '../actions/marker';
import { configurePushNotifications } from './push-notifications';

// # Action types
const APP_CONTENT_LOADED = 'APP_CONTENT_LOADED';

// # Actions
// This will be done ONLY for logged in users
// Load all content after successful login
export const fetchAppContent = () => dispatch =>
  Promise.all([
    dispatch(getUser()),
    dispatch(fetchActionTypes()),
    dispatch(fetchFeed()),
    dispatch(fetchMarkers()),
    dispatch(fetchNotifications()),
    dispatch(configurePushNotifications()),
  ]).then(() => dispatch({ type: APP_CONTENT_LOADED }));
