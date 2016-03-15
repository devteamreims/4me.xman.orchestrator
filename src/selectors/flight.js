import _ from 'lodash';
import d from 'debug';
const debug = d('4me.selectors.flight');



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

export const getFlights = (state) => state.flightList.flights;
export const getFlightByIfplId = (state, ifplId) => _.get(getFlights(state), ifplId);

export const getFlightsWithData = (state) => _.map(getFlights(state), combineSingleFlight(state));
export const getFlightByIfplIdWithData = (state, ifplId) => combineSingleFlight(state)(getFlightByIfplId(state, ifplId), ifplId);


import {
  getMachReductionFromAdvisory,
} from './advisory';

function combineSingleFlight(state) {
  return (flight, ifplId) => Object.assign({}, flight, {
    ifplId,
    advisory: {
      ...state.advisories[ifplId],
      machReduction: getMachReductionFromAdvisory(state.advisories[ifplId]),
    },
    currentStatus: state.currentStatuses[ifplId] || {},
    position: state.positions.positions[ifplId] || defaultPosition
  });
}


// Position filters

export function isFlightInFilter(filter) {
  //debug('Creating filter with these inputs :');
  //debug(filter);

  return (flight) => {
    const sectors = _.get(filter, 'sectors');
    if(_.isEmpty(sectors)) {
      // Filter is empty, all flights are included !
      return true;
    }

    const verticalFilter = _.get(filter, 'verticalFilter', false);

    debug(`Checking if ${flight.ifplId} is in ${sectors.join(',')}`);
    debug(`${flight.destination}`);

    const inArea = _.some(sectors, (sector) => isInSectorArea(sector, flight));

    const inVerticalLimits = !verticalFilter || _.some(sectors, (sector) => isInSectorVerticalArea(sector, flight));


    //debug(`Flight ${flight.ifplId} : inArea : %s, inVerticalLimits : %s`, inArea, inVerticalLimits);

    return inArea && inVerticalLimits;
  }
}

export const getFlightsInFilterWithData = (state, filter) => _.filter(getFlightsWithData(state), isFlightInFilter(filter));

export const getSortedFlightsInFilterWithData = (state, filter) => _.sortBy(getFlightsInFilterWithData(state, filter), f => f.advisory.targetTime);

import {
  isInSector,
  isInVerticalSector,
} from '../../coords.js';

function isInSectorArea(sector, flight) {
  const {lat, long} = _.get(flight, 'position.horizontal', {lat: 0, long: 0});



  if(lat === 0 || long === 0) {
    return false;
  }

  return isInSector(sector, flight.destination, [lat, long]);

  return true;
}

function isInSectorVerticalArea(sector, flight) {

  debug(`Checking if ${flight.ifplId} is in ${sector} vertical limits`);

  const currentFlightLevel = _.get(flight, 'position.vertical.currentFlightLevel', 0);
  const destination = _.get(flight, 'destination');

  debug(`Flight is going to ${destination}, current FL is ${currentFlightLevel}`);

  return isInVerticalSector(sector, destination, currentFlightLevel);
}
