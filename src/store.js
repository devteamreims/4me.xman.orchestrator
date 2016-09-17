import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import deepFreeze from 'redux-freeze';

import _ from 'lodash';

import d from 'debug';
const debug = d('4me.redux');

import {initializeSocket} from './actions/socket';
import reducers from './reducers';
import {updatePositions} from './actions/positions';

import {
  updateFlights,
} from './actions/flight-list';

import {
  commitCurrentStatus,
  pruneOldStatuses,
} from './actions/current-statuses';

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
  const periodicStatusPrune = () => store.dispatch(pruneOldStatuses());

  setInterval(periodicFlightUpdate, 1000*20);
  setInterval(periodicPositionUpdate, 1000*5);
  setInterval(periodicStatusPrune, 1000*60*30);

  installSubscriptions(store);

  periodicFlightUpdate()
    .then(() => periodicPositionUpdate());


  return store;
}


import {
  getSubscribers,
} from './subscribers';

function installSubscriptions(store) {
  // Status change subscription
  const subscriptions = getSubscribers(store);

  const unsubscribeHandlers = _.mapValues(subscriptions, s => store.subscribe(s));
}
