import d from 'debug';
const debug = d('4me.flightList.actions');
import _ from 'lodash';
import moment from 'moment';

import rp from 'request-promise';

const request = rp;

import {
  stubXmanData,
  stubXmanDataPlusOne,
  stubXmanDataMinusOne
} from '../stubData';

import {combineAllFlightData} from '../utils/flight';

export const SET_INITIAL_FLIGHT_LIST = 'SET_INITIAL_FLIGHT_LIST';
export const ADD_FLIGHTS = 'ADD_FLIGHTS';
export const REMOVE_FLIGHTS = 'REMOVE_FLIGHTS';
export const UPDATE_FLIGHTS = 'UPDATE_FLIGHTS';


import {
  isFirstRun,
  getFlights,
} from '../selectors/flight-list';

export function updateFlights() {
  return (dispatch, getState) => {
    const url = process.env.EGLL_PARSER_URL;

    return request(url)
      .then(rawData => JSON.parse(rawData))
      .then(rawData => {
        debug('Got data from backend');
        return dispatch(updateFlightList(rawData));
      });
  };
}

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
        ifplId: XXX,
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
    const ifplId = flight.ifplId;

    toMerge.flights[ifplId] = _.omit(flight, ['advisory']);
    toMerge.advisories[ifplId] = advisory;

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
    /*
    if(isFirstRun(getState())) {
      return setFlightListAction(data);
    }
    */

    // Process data for updating, this is our main refresh point
    // We diff the existing flightList with the provided flightList
    // Unknown flights are added, removed flights are trashed, other flights are updated

    const trackedFlightCount = _.size(getFlights(getState()));
    const updatedFlightCount = _.size(data.flights);

    debug('Backend was updated %s', moment(data.lastFetched).fromNow());
    debug(
      'Currently tracking %d flights, got %d flights from backend',
      trackedFlightCount,
      updatedFlightCount
    );

    const oldFlights = getFlights(getState());
    const newFlights = data.flights;

    // Slightly different syntax here, since we have a different data format
    // newFlights hasn't been normalized yet
    const toIfplId = f => f.ifplId;
    const newIfplIds = _.map(newFlights, toIfplId);
    const oldIfplIds = _.keys(oldFlights);



    const addedIfplIds = _(newFlights)
      .map(toIfplId)
      .without(...oldIfplIds)
      .value();

    const removedIfplIds = _(oldFlights)
      .keys()
      .without(...newIfplIds)
      .value();

    const commonIfplIds = _.intersection(newIfplIds, oldIfplIds);

    // Helper function to find oldFlight by id
    const oldFlightById = (ifplId) => _.find(oldFlights, (f, key) => key === ifplId);

    const isOldFlight = (f) => _.includes(oldIfplIds, toIfplId(f));

    const updatedIfplIds = _(newFlights)
      // Find common flights
      .filter(isOldFlight)
      // Reject if lastUpdated has not changed
      .reject((f) => {
        const lastUpdated = f.lastUpdated;
        const cachedLastUpdated = _.get(oldFlightById(f.ifplId), 'lastUpdated', -1);
        return lastUpdated === cachedLastUpdated;
      })
      .map(toIfplId)
      .value();

    debug(`Adding %d flights, removing %d flights, updating %d/%d flights`,
      addedIfplIds.length,
      removedIfplIds.length,
      updatedIfplIds.length,
      commonIfplIds.length
    );

    debug('IDs :');
    debug('Added: %s', addedIfplIds.join(','));
    debug('Updated: %s', updatedIfplIds.join(','));
    debug('Removed: %s', removedIfplIds.join(','));


    const isFlightAdded = (f) => _.includes(addedIfplIds, toIfplId(f));
    const isFlightUpdated = (f) => _.includes(updatedIfplIds, toIfplId(f));
    const isFlightRemoved = (f) => _.includes(removedIfplIds, toIfplId(f));

    const normalizeFilteredFlightsBy = (filter) => normalizeXmanData(_.merge({}, _.omit(data, 'flights'), {flights: _.filter(data.flights, filter)}));

    const normalizedAddedFlights = normalizeFilteredFlightsBy(isFlightAdded);
    const normalizedUpdatedFlights = normalizeFilteredFlightsBy(isFlightUpdated);

    const flightsAreAdded = !_.isEmpty(addedIfplIds);
    const flightsAreUpdated = !_.isEmpty(updatedIfplIds);
    const flightsAreRemoved = !_.isEmpty(removedIfplIds);


    if(flightsAreAdded) {
      // Update our internal tree
      dispatch(addFlightsAction(normalizedAddedFlights));
    }

    if(flightsAreUpdated) {
      // Update our internal tree
      dispatch(updateFlightsAction(normalizedUpdatedFlights));
    }

    if(flightsAreRemoved) {
      // Update internal tree
      dispatch(removeFlightsAction({
        lastFetched: data.lastFetched,
        ifplIds: removedIfplIds
      }));
    }

    return {
      normalizedAddedFlights,
      normalizedUpdatedFlights,
    };
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
    ifplIds: data.ifplIds
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
