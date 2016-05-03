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
  shouldFlightBeFrozen,
  shouldFlightBeTracked,
} from '../hooks';

import {
  lifecycleLogger,
} from '../logger';

import {
  flightToString,
} from '../utils/flight';

export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';
export const CAPTURE_FLIGHTS = 'CAPTURE_FLIGHTS';
export const FREEZE_FLIGHTS = 'FREEZE_FLIGHTS';
export const TRACK_FLIGHTS = 'TRACK_FLIGHTS';

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

export function freezeFlightsAction(ifplIds) {
  return {
    type: FREEZE_FLIGHTS,
    ifplIds,
  };
}

export function trackFlightsAction(ifplIds) {
  return {
    type: TRACK_FLIGHTS,
    ifplIds,
  };
}

export function updatePositions() {
  return (dispatch, getState) => {
    const flights = getFlights(getState());
    const ifplIds = _.keys(flights);

    // No need to perform a request since we have no tracked flights
    if(_.isEmpty(ifplIds)) {
      return;
    }

    debug('Fetching positions for flights : %s', _.map(flights, flightToString).join(', '));

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
      // Set captured and freeze flag
      .then(() => {

        const flights = getFlightsWithData(getState());

        const toIfplId = flight => _.get(flight, 'ifplId');

        const capturedFlights = _.filter(flights, flight => {
          const isFlightAlreadyCaptured = _.get(flight, 'captured', false);
          return !isFlightAlreadyCaptured && shouldFlightBeCaptured(flight);
        });
        const capturedIfplIds = _.map(capturedFlights, toIfplId);

        const frozenFlights = _.filter(flights, flight => {
          const isFlightAlreadyFrozen = _.get(flight, 'frozen', false);
          return !isFlightAlreadyFrozen && shouldFlightBeFrozen(flight);
        });
        const frozenIfplIds = _.map(frozenFlights, toIfplId);

        const trackedFlights = _.filter(flights, flight => {
          const isFlightAlreadyTracked = _.get(flight, 'tracked', false);
          return !isFlightAlreadyTracked && shouldFlightBeTracked(flight);
        });
        const trackedIfplIds = _.map(trackedFlights, toIfplId);

        if(!_.isEmpty(capturedIfplIds)) {
          _.each(capturedFlights, (f) => lifecycleLogger(
            '[%s] is now captured',
            flightToString(f)
          ));
          dispatch(captureFlightsAction(capturedIfplIds));
        }

        if(!_.isEmpty(frozenIfplIds)) {
          _.each(frozenFlights, f => lifecycleLogger(
            '[%s] is now frozen',
            flightToString(f)
          ));
          dispatch(freezeFlightsAction(frozenIfplIds));
        }

        if(!_.isEmpty(trackedIfplIds)) {
          _.each(trackedFlights, f => lifecycleLogger(
            '[%s] is now tracked',
            flightToString(f)
          ));
          dispatch(trackFlightsAction(trackedIfplIds));
        }

        const ignoredIfplIds = _(flights)
          .map(toIfplId)
          .without(...trackedIfplIds)
          .without(...frozenIfplIds)
          .without(...capturedIfplIds)
          .value();

        const ignoredFlights = _(flights)
          .filter(f => _.includes(ignoredIfplIds, toIfplId(f)))
          .value();

        if(!_.isEmpty(ignoredIfplIds)) {
          _.each(ignoredFlights, f => lifecycleLogger(
            '[%s] is ignored for now',
            flightToString(f)
          ));
        }

        return;
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
