import {createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import deepFreeze from 'redux-freeze';

import d from 'debug';
const debug = d('4me.redux');

import {initializeSocket} from './actions/socket';
import reducers from './reducers';
import {fetchPositions} from './actions/positions';

import {firstStep, secondStep, thirdStep} from './actions/flight-list';
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

  // X seconds later, dispatch secondStep
  setTimeout(() => store.dispatch(secondStep()), 5000);
  setTimeout(() => store.dispatch(thirdStep()), 10000);
  setTimeout(() => store.dispatch(fetchPositions()), 20000);


  const randomSectors = () => {
    const s = [
      ['UF', 'KF'],
      ['UR', 'XR', 'KR'],
      ['YR', 'HR']
    ];

    return s[Math.floor(Math.random() * s.length)];
  }

  const stubCurrentStatus = () => ({
    when: Date.now() - 1000*Math.floor(Math.random() * 25*60),
    who: {
      cwpId: 23,
      sectors: randomSectors(),
    },
    machReduction: Math.floor(Math.random() * 4),
    speed: null,
    minimumCleanSpeed: !!Math.round(Math.random())
  });

  store.dispatch(commitCurrentStatus('a12345', stubCurrentStatus()));

/*
  const demoChanges = () => setTimeout(() => {
    store.dispatch(commitCurrentStatus('a12345', stubCurrentStatus()));
    demoChanges();
  }, 15000);

  const demoChanges2 = () => setTimeout(() => {
    store.dispatch(commitCurrentStatus('a12344', stubCurrentStatus()));
    demoChanges2();
  }, 6000);

  demoChanges();
  demoChanges2();
*/

  return store;
}