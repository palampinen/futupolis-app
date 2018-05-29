'use strict';

const CHANGE_TAB = 'CHANGE_TAB';
const CHANGE_TRIP_TAB = 'CHANGE_TRIP_TAB';

const changeTab = (newTab) => ({ type: CHANGE_TAB, payload: newTab })
const changeTripTab = (newTab) => ({ type: CHANGE_TRIP_TAB, payload: newTab })

export {
  CHANGE_TAB,
  CHANGE_TRIP_TAB,
  changeTab,
  changeTripTab
};
