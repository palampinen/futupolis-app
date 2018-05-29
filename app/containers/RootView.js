'use strict';

import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger';
import loggerConfig from '../utils/loggerConfig';
import * as reducers from '../reducers';
import MainView from './MainView';
import { checkUserLogin } from '../concepts/auth';

const IOS = Platform.OS === 'ios';

const middlewares = [thunk];
if (__DEV__) {
  // Disabling logging might help performance as XCode prints the whole objects
  // without respecing the collapsed parameter
  const logger = createLoggerMiddleware(loggerConfig);
  middlewares.push(logger);
  console.disableYellowBox = true;
}

const createStoreWithMiddleware = applyMiddleware.apply(this, middlewares)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

class RootView extends Component {
  componentDidMount() {
    // Statusbar style
    if (IOS) {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('light-content');
    }

    store.dispatch(checkUserLogin());
  }

  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

export default RootView;
