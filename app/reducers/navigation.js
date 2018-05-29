'use strict';

import Immutable from 'immutable';
import { CHANGE_TAB, CHANGE_TRIP_TAB } from '../actions/navigation';
import Tabs from '../constants/Tabs';

export const getCurrentTab = state => state.navigation.get('currentTab');
export const getCurrentTripViewTab = state => state.navigation.get('currentTripTab');

const initialState = Immutable.fromJS({
  currentTab: Tabs.FEED,
  currentTripTab: Tabs.INFO,
});

export default function navigation(state = initialState, action) {
  switch (action.type) {
    case CHANGE_TAB:
      return state.set('currentTab', action.payload);
    case CHANGE_TRIP_TAB:
      return state.set('currentTripTab', action.payload);
    default:
      return state;
  }
}
