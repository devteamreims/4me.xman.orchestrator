import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import deepFreeze from 'redux-freeze';

import d from 'debug';
const debug = d('4me.redux');

import {initializeSocket} from './actions/socket';
import reducers from './reducers';
import {updatePositions} from './actions/positions';

import {
  updateFlights,
} from './actions/flight-list';

import {commitCurrentStatus} from './actions/current-statuses';

import {getSocket} from './socket';

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

  const periodicFlightUpdate = () => store.dispatch(updateFlights());
  const periodicPositionUpdate = () => store.dispatch(updatePositions());

  setInterval(periodicFlightUpdate, 1000*60);
  setInterval(periodicPositionUpdate, 1000*30);

  setTimeout(() => {
    periodicFlightUpdate()
      .then(() => periodicPositionUpdate());
  }, 200);


  return store;
}
