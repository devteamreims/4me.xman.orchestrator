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
  sendFlightListUpdate,
} from '../socket';

import {
  getFlights,
} from '../selectors/flight-list';

import {
  escalatePositions,
  recoverPositions,
} from './status';

import {
  shouldFlightBeCaptured,
} from '../hooks';

import {
  lifecycleLogger,
} from '../logger';

export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';
export const CAPTURE_FLIGHTS = 'CAPTURE_FLIGHTS';

export function updatePositionsAction(positions) {
  return {
    type: UPDATE_POSITIONS,
    positions: positions,
    lastFetched: Date.now()
  };
}

export function captureFlightsAction(ifplIds) {
  return {
    type: CAPTURE_FLIGHTS,
    ifplIds,
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

        let currentFlightLevel = Math.floor(parseInt(pos.alt)/100);
        if(currentFlightLevel % 10 <= 2 || currentFlightLevel % 10 >= 8) {
          currentFlightLevel = Math.round(currentFlightLevel / 10) * 10;
        }

        const vertical = {
          currentFlightLevel,
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
      // Update positions
      .then(data => {
        debug('Normalized data :');
        debug(data);
        return dispatch(updatePositionsAction(data.flights));
      })
      // Set captured flag
      .then(() => {
        const flights = getFlightsWithData(getState());
        const capturedIfplIds = _.reduce(flights, (prev, flight) => {
          if(shouldFlightBeCaptured(flight) && flight.captured === false) {
            return [...prev, flight.ifplId];
          }
          return prev;
        }, []);

        if(capturedIfplIds.length) {
          lifecycleLogger(
            'Capturing %d flights : %s',
            capturedIfplIds.length,
            capturedIfplIds.join(',')
          );
          return dispatch(captureFlightsAction(capturedIfplIds));
        } else {
          return;
        }
      })
      // Send notifications to socket
      .then(() => sendNotifications(getState))
      // Recover status
      .then(() => dispatch(recoverPositions()))
      .catch(err => {
        debug('Failed to fetch positions !');
        debug(err);

        return dispatch(escalatePositions('Something went wrong fetching flight positions'));
      });
  }
}

// Some kind of diff mechanism
// Given state before position update and state after position update, send notifications to socket subscribers

function sendNotifications(getState) {
  const debug = d('4me.positions.actions.notifier');

  const newState = getState();
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
