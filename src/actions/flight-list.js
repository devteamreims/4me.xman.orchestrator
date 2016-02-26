import d from 'debug';
const debug = d('4me.flightList.actions');
import _ from 'lodash';
import moment from 'moment';

import {
  stubXmanData,
  stubXmanDataPlusOne,
  stubXmanDataMinusOne
} from '../stubData';

import {
  getSocket,
  sendRemoveFlightsSignal,
  sendUpdateFlightsSignal,
  sendAddFlightsSignal
} from '../socket';

import {combineAllFlightData} from '../utils/flight';

export const SET_INITIAL_FLIGHT_LIST = 'SET_INITIAL_FLIGHT_LIST';
export const ADD_FLIGHTS = 'ADD_FLIGHTS';
export const REMOVE_FLIGHTS = 'REMOVE_FLIGHTS';
export const UPDATE_FLIGHTS = 'UPDATE_FLIGHTS';

export function getInitialFlightList(data) {
  return (dispatch, getState) => {

    if(data === undefined) {
      data = stubXmanData;
    }

    const normalizedData = normalizeXmanData(data);

    debug(normalizedData);
  
    debug('Fetching initial xman data');
    debug('Got %d flights from backend', _.size(normalizedData.entities.flights));

    dispatch(setFlightListAction(normalizedData));
  }
}

function normalizeXmanData(data) {
  /*
  Turn this {
    ...
    flights: [
      {
        flightId: XXX,
        ...,
        advisory: {...}
      },
      ...
    ]
  }
  Into this {
    ...
    flights: {
      'XXX': {...},
      ...
    },
    advisories: {
      'XXX': {...},
      ...
    }}
  */

  const flights = _.cloneDeep(data.flights);

  const extractEntities = (prev, f) => {
    const toMerge = {flights: {}, advisories: {}};

    // Deal with flights
    const flight = _.clone(f);
    const advisory = _.clone(f.advisory);
    const flightId = '' + flight.flightId;

    toMerge.flights[flightId] = _.omit(flight, ['advisory', 'flightId']);
    toMerge.advisories[flightId] = advisory;

    return {
      flights: _.merge({}, prev.flights, toMerge.flights),
      advisories: _.merge({}, prev.advisories, toMerge.advisories)
    };
  };

  const entities = _.reduce(flights, extractEntities, {flights: {}, advisories: {}});

  return _.merge({}, _.omit(data, 'flights'), {entities: entities});
}

export function updateFlightList(data) {
  return (dispatch, getState) => {

    // Check wether this is a first update or not
    const firstRun = getState().flightList.lastFetched === null;
  
    if(firstRun) {
      return setFlightListAction(data);
    }

    // Process data for updating, this is our main refresh point
    // We diff the existing flightList with the provided flightList
    // Unknown flights are added, removed flights are trashed, other flights are updated

    const trackedFlightCount = _.size(getState().flightList.flights);
    const updatedFlightCount = _.size(data.flights);

    debug('Backend was updated %s', moment(data.lastFetched).fromNow());
    debug(
      'Currently tracking %d flights, got %d flights from backend',
      trackedFlightCount,
      updatedFlightCount
    );

    const oldFlights = getState().flightList.flights;
    const newFlights = data.flights;

    // Slightly different syntax here, since we have a different data format
    // newFlights hasn't been normalized yet
    const toFlightIds = f => f.flightId;
    const newFlightIds = _.map(newFlights, toFlightIds);
    const oldFlightIds = _.keys(oldFlights);



    const addedFlightIds = _(newFlights)
      .map(toFlightIds)
      .without(...oldFlightIds)
      .value();

    const removedFlightIds = _(oldFlights)
      .keys()
      .without(...newFlightIds)
      .value();

    const commonFlightIds = _.intersection(oldFlightIds, newFlightIds);
    
    // Helper function to find oldFlight by id
    const oldFlightById = (flightId) => _.find(oldFlights, (f, key) => key === flightId);

    const isOldFlight = (f) => _.includes(oldFlightIds, f.flightId);

    const updatedFlightIds = _(newFlights)
      // Find common flights
      .filter(isOldFlight)
      // Reject if lastUpdated has not changed
      .reject((f) => {
        const lastUpdated = f.lastUpdated;
        const cachedLastUpdated = _.get(oldFlightById(f.flightId), 'lastUpdated', -1);
        return lastUpdated === cachedLastUpdated;
      })
      .map(toFlightIds)
      .value();

    debug(`Adding %d flights, removing %d flights, updating %d/%d flights`,
      addedFlightIds.length,
      removedFlightIds.length,
      updatedFlightIds.length,
      commonFlightIds.length
    );

    debug('IDs :');
    debug('Added: %s', addedFlightIds.join(','));
    debug('Updated: %s', updatedFlightIds.join(','));
    debug('Removed: %s', removedFlightIds.join(','));


    const isFlightAdded = (f) => _.includes(addedFlightIds, f.flightId);
    const isFlightUpdated = (f) => _.includes(updatedFlightIds, f.flightId);
    const isFlightRemoved = (f) => _.includes(removedFlightIds, f.flightId);

    const normalizeFilteredFlightsBy = (filter) => normalizeXmanData(_.merge({}, _.omit(data, 'flights'), {flights: _.filter(data.flights, filter)}));

    const normalizedAddedFlights = normalizeFilteredFlightsBy(isFlightAdded);
    const normalizedUpdatedFlights = normalizeFilteredFlightsBy(isFlightUpdated);

    const flightsAreAdded = !_.isEmpty(addedFlightIds);
    const flightsAreUpdated = !_.isEmpty(updatedFlightIds);
    const flightsAreRemoved = !_.isEmpty(removedFlightIds);

    const socket = getSocket();

    if(flightsAreAdded) {
      // Send update to socket
      dispatch(addFlightsAction(normalizedAddedFlights));

      sendAddFlightsSignal(getState(), socket, addedFlightIds);
    }

    if(flightsAreUpdated) {
      // Send update to socket
      dispatch(updateFlightsAction(normalizedUpdatedFlights));
      sendUpdateFlightsSignal(getState(), socket, updatedFlightIds);
    }

    if(flightsAreRemoved) {
      // Send update to socket
      dispatch(removeFlightsAction({
        lastFetched: data.lastFetched,
        flightIds: removedFlightIds
      }));

      sendRemoveFlightsSignal(getState(), socket, removedFlightIds);

    }


  }
}


export function firstStep() {
  debug('Dispatching flightList first step');
  return getInitialFlightList(_.cloneDeep(stubXmanData));
}

export function secondStep() {
  debug('Dispatching flightList second step');
  const data = stubXmanDataMinusOne();
  return updateFlightList(data);
}

export function thirdStep() {
  debug('Dispatching flightList third step');
  const data = stubXmanDataPlusOne(stubXmanDataMinusOne());
  return updateFlightList(data);
}

function setFlightListAction(data) {
  return {
    type: SET_INITIAL_FLIGHT_LIST,
    lastUpdated: Date.now(),
    lastFetched: data.lastFetched,
    entities: data.entities
  };
}

function addFlightsAction(data) {
  return {
    type: ADD_FLIGHTS,
    lastUpdated: Date.now(),
    lastFetched: data.lastFetched,
    entities: data.entities
  };
}

function removeFlightsAction(data) {
  return {
    type: REMOVE_FLIGHTS,
    lastUpdated: Date.now(),
    lastFetched: data.lastFetched,
    flightIds: data.flightIds
  };
}

function updateFlightsAction(data) {
  return {
    type: UPDATE_FLIGHTS,
    lastUpdated: Date.now(),
    lastFetched: data.lastFetched,
    entities: data.entities
  };
}