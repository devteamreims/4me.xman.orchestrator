import d from 'debug';
const debug = d('4me.positions.actions');
import _ from 'lodash';
import merge from 'lodash/merge';

import {stubPositionData} from '../stubData';

import {
  getFlights,
  getFlightsWithData,
  getSortedFlightsInFilterWithData
} from '../selectors/flight';

import {
  getClients
} from '../selectors/socket-clients';

import {
  getSocket,
  sendFlightListUpdate
} from '../socket';



export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';

export function updatePositionsAction(positions) {
  return {
    type: UPDATE_POSITIONS,
    positions: positions,
    lastFetched: Date.now()
  };
}

export function updatePositions() {
  return (dispatch, getState) => {
    const flightIds = _.keys(getFlights(getState()));
    debug('Fetching positions for flights with IDs : [%s]', flightIds.join(','));
    
    const fetchPromise = new Promise((fulfill) => setTimeout(() => fulfill(_.cloneDeep(stubPositionData())), 5000));

    const oldState = _.cloneDeep(getState());

    return fetchPromise
    // Format our data
      .then(formatPositionData)
      .then((data) => dispatch(updatePositionsAction(data)))
      .then(() => sendNotifications(getState))
      .catch((err) => debug(err));
    
  }
}

// Some kind of diff mechanism
// Given state before position update and state after position update, send notifications to socket subscribers

function sendNotifications(getState) {
  const debug = d('4me.positions.actions.notifier');

  const newState = getState();

  debug('Now : ' + Date.now());
  debug('newState.lastFetched : ' + newState.positions.lastFetched);

  debug('Sending notifications to subscribers');

  const clients = getClients(getState());

  const socket = getSocket();

  _.each(clients, client => {
    const {sectors, verticalFilter} = client;

    const subscribedFlights = getSortedFlightsInFilterWithData(getState(), {sectors, verticalFilter});

    debug(`Notifying client with ID : ${client.id}`);
    debug(subscribedFlights);

    sendFlightListUpdate(socket, client.id, subscribedFlights);

  });

  return Promise.resolve();
}

function formatPositionData(rawData) {
  /*
   * Turn this : [{flightId: XXXX, ...}]
   * into this : {'flightId' : {...}}
   */

  let ret = {};
  _.each(_.cloneDeep(rawData), p => {
    ret[p.flightId] = p;
    delete ret[p.flightId].flightId;
  });

  return ret;
}