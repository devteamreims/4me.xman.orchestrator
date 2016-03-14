import d from 'debug';
const debug = d('4me.positions.actions');
import _ from 'lodash';
import merge from 'lodash/merge';

import {stubPositionData} from '../stubData';

import rp from 'request-promise';

const request = rp;

import {
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

import {
  getFlights,
} from '../selectors/flight-list';



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
    const flights = getFlights(getState());
    const ifplIds = _.keys(flights);
    debug('Fetching positions for flights with IDs : [%s]', ifplIds.join(','));

    const assocArray = _.map(flights, (f, key) => ({arcid: f.arcid, ifplId: key}));
    const callsigns = _.map(assocArray, f => f.arcid);

    const url = process.env.POSITIONS_URL;

    const reqParams = {
      callsigns,
    };

    const normalizePositionData = (assocArray) => (rawData) => {
      const arcidToIfplId = (arcid) => _.get(_.find(assocArray, f => f.arcid === arcid), 'ifplId');

      const when = rawData.lastFetched;

      const flights = _.reduce(rawData.flights, (prev, pos) => {
        const arcid = pos.callsign;
        const ifplId = arcidToIfplId(arcid);
        const vertical = {
          currentFlightLevel: Math.floor(parseInt(pos.alt)/100),
        };
        const horizontal = {
          long: pos.long,
          lat: pos.lat,
        };

        const toMerge = {
          [ifplId]: {
            when,
            vertical,
            horizontal,
          }
        };

        return Object.assign(prev, toMerge);
      }, {});

      return Object.assign({}, rawData, {flights});
    };

    return request({
      url,
      qs: reqParams,
    })
      .then(data => {
        debug('Got position data');
        return JSON.parse(data);
      })
      .then(normalizePositionData(assocArray))
      .then(data => {
        debug('Normalized data :');
        debug(data);
        return dispatch(updatePositionsAction(data.flights));
      });



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
