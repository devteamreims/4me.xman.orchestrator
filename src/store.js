import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import deepFreeze from 'redux-freeze';

import d from 'debug';
const debug = d('4me.redux');

import {initializeSocket} from './actions/socket';
import reducers from './reducers';
import {fetchPositions} from './actions/positions';

import {firstStep} from './actions/flight-list';

export default function makeStore(socketIo) {
  debug('Creating store');
  
  const logger = createLogger({
    logger: {
      log: d('4me.redux.logger'),
    },
    colors: {}
  });

  const store = createStore(reducers, applyMiddleware(thunk, deepFreeze, logger));
  
  // Initialize socketIo
  store.dispatch(initializeSocket(socketIo));


  // Example step
  store.dispatch(firstStep());

  store.dispatch(fetchPositions());


  return store;
}