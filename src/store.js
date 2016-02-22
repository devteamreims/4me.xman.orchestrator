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
import {commitCurrentStatus} from './actions/current-statuses';

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

  const stubCurrentStatus = () => ({
    when: Date.now() - 1000*Math.floor(Math.random() * 15*60),
    who: {
      cwpId: 23,
      sectors: ['UF', 'KF'],
    },
    machReduction: Math.floor(Math.random() * 4),
    speed: null,
    minimumCleanSpeed: !!Math.round(Math.random())
  });

  const demoChanges = () => setTimeout(() => {
    store.dispatch(commitCurrentStatus(12345, stubCurrentStatus()));
    demoChanges();
  }, 15000);

  demoChanges();


  return store;
}