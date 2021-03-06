import _ from 'lodash';
import d from 'debug';
const debug = d('4me.selectors.flight');

import {
  flightToString,
} from '../utils/flight';

const defaultPosition = {
  when: Date.now(),
  vertical: {
    plannedFlightLevel: 0,
    currentFlightLevel: 0
  },
  horizontal: {
    lat: 0,
    long: 0
  }
};

const toIfplId = flight => flight.ifplId;
const isCaptured = flight => flight.captured;
const isTracked = flight => flight.tracked;
const isFrozen = flight => flight.frozen;

export const getFlights = (state) => state.flightList.flights;
export const getFlightByIfplId = (state, ifplId) => _.get(getFlights(state), ifplId);

export const getFlightsWithData = (state) => {
  return _(getFlights(state))
    .map(combineSingleFlight(state))
    .value();
};

export const getTrackedFlightsWithData = (state) => {
  return _(getFlightsWithData(state))
    .filter(isTracked)
    .value();
};

export const getTrackedIfplIds = state => {
  return _(getFlights(state))
    .filter(isTracked)
    .map(toIfplId)
    .value();
};

export const getCapturedIfplIds = state => {
  return _(getFlights(state))
    .filter(isCaptured)
    .map(toIfplId)
    .value();
};

export const getFrozenIfplIds = state => {
  return _(getFlights(state))
    .filter(isFrozen)
    .map(toIfplId)
    .value();
};

export const getIgnoredIfplIds = (state) => {
  return _(getFlights(state))
    .reject(isCaptured)
    .reject(isTracked)
    .reject(isFrozen)
    .map(toIfplId)
    .value();
};

export const isFlightCaptured = (state, ifplId) => {
  return _.get(getFlightByIfplId(state, ifplId), 'captured', false);
};

import {
  isForcedMcs,
  isForcedOff,
} from './fetchers';

export const getFlightByIfplIdWithData = (state, ifplId) => combineSingleFlight(state)(getFlightByIfplId(state, ifplId), ifplId);

function prepareAdvisory(state, flight, advisory) {
  if(_.isEmpty(advisory)) {
    return advisory || {};
  }

  const destination = _.toUpper(_.get(flight, 'destination'));

  if(isForcedMcs(state, destination) && !isForcedOff(state, destination)) {
    return Object.assign({}, advisory, {minimumCleanSpeed: true});
  }

  if(!flight.captured || isForcedOff(state, destination)) {
    if('machReduction' in advisory) {
      return Object.assign({}, advisory, {machReduction: 0});
    } else if('speed' in advisory) {
      return Object.assign({}, advisory, {speed: 0});
    }
  }

  return advisory;
}

import {
  getAdvisoryByIfplId,
} from './advisory';

function combineSingleFlight(state) {
  return (flight, ifplId) => {
    // If the flight is not captured yet, override the advisory
    const advisory = prepareAdvisory(state, flight, getAdvisoryByIfplId(state, ifplId));

    return Object.assign({}, flight, {
      ifplId,
      advisory,
      currentStatus: state.currentStatuses[ifplId] || {},
      position: state.positions.positions[ifplId] || defaultPosition
    });
  };
}


// Position filters

export function isFlightInFilter(filter) {
  return (flight) => {
    const sectors = _.get(filter, 'sectors');
    if(_.isEmpty(sectors)) {
      // Filter is empty, all flights are included !
      return true;
    }

    const verticalFilter = _.get(filter, 'verticalFilter', false);

    const inArea = _.some(sectors, (sector) => isInSectorArea(sector, flight));
    const inVerticalLimits = !verticalFilter || _.some(sectors, (sector) => isInSectorVerticalArea(sector, flight));

    return inArea && inVerticalLimits;
  }
}

export const getFlightsInFilterWithData = (state, filter) => _.filter(getTrackedFlightsWithData(state), isFlightInFilter(filter));

export const getSortedFlightsInFilterWithData = (state, filter) => _.sortBy(getFlightsInFilterWithData(state, filter), f => f.advisory.targetTime);

import {
  isInSectorArea as checkArea,
  isInSector as checkAreaAndVertical,
} from '../geo';

function isInSectorArea(sector, flight) {
  const {lat, long} = _.get(flight, 'position.horizontal', {lat: 0, long: 0});

  if(lat === 0 || long === 0) {
    return false;
  }

  return checkArea(sector, flight.destination, {lat, long});

}

function isInSectorVerticalArea(sector, flight) {
  const {lat, long} = _.get(flight, 'position.horizontal', {lat: 0, long: 0});
  const flightLevel = _.get(flight, 'position.vertical.currentFlightLevel', 0);

  if(!flightLevel) {
    return true;
  }

  const destination = _.get(flight, 'destination');

  return checkAreaAndVertical(sector, destination, {lat, long, flightLevel});
}
