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
  firstStep,
  secondStep,
  thirdStep,
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


/*
  // Example step
  store.dispatch(firstStep());
  store.dispatch(updatePositions());

  // X seconds later, dispatch secondStep
  setTimeout(() => store.dispatch(secondStep()), 5000);
  setTimeout(() => store.dispatch(thirdStep()), 10000);
*/

  const periodicFlightUpdate = () => store.dispatch(updateFlights());
  const periodicPositionUpdate = () => store.dispatch(updatePositions());

  setInterval(periodicFlightUpdate, 1000*60);
  setInterval(periodicPositionUpdate, 1000*30);

  setTimeout(() => {
    periodicFlightUpdate()
      .then(() => periodicPositionUpdate());
  }, 200);

  //demoChanges(store);

  return store;
}

function demoChanges(store) {
  const periodicRemove = () => setTimeout(() => {
    const socket = getSocket();
    const flightsToRemove = ['a12346', 'BLABLA'];

    debug('Periodic removal of flights : ' + flightsToRemove.join(','));
    socketIo.emit('remove_flights', flightsToRemove);
    periodicRemove();
  }, 5000);

  //periodicRemove();


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

  //store.dispatch(commitCurrentStatus('a12345', stubCurrentStatus()));


  const demoChanges = () => setTimeout(() => {
    store.dispatch(commitCurrentStatus('a12345', stubCurrentStatus()));
    demoChanges();
  }, 15000);

  const demoChanges2 = () => setTimeout(() => {
    store.dispatch(commitCurrentStatus('a12344', stubCurrentStatus()));
    demoChanges2();
  }, 6000);

  //demoChanges();
  //demoChanges2();

}
