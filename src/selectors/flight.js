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
export const getFlightByFlightId = (state, flightId) => _.get(getFlights(state), flightId);

export const getFlightsWithData = (state) => _.map(getFlights(state), combineSingleFlight(state));
export const getFlightByFlightIdWithData = (state, flightId) => combineSingleFlight(state)(getFlightByFlightId(state, flightId), flightId);

function combineSingleFlight(state) {
  return (flight, flightId) => Object.assign({}, flight, {
    flightId,
    advisory: state.advisories[flightId] || {},
    currentStatus: state.currentStatuses[flightId] || {},
    position: state.positions.positions[flightId] || defaultPosition
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

    const inArea = _.some(sectors, (sector) => isInSectorArea(sector, flight));

    const inVerticalLimits = !verticalFilter || _.some(sectors, (sector) => isInSectorVerticalArea(sector, flight));


    //debug(`Flight ${flight.flightId} : inArea : %s, inVerticalLimits : %s`, inArea, inVerticalLimits);

    return inArea && inVerticalLimits;
  }
}

export const getFlightsInFilterWithData = (state, filter) => _.filter(getFlightsWithData(state), isFlightInFilter(filter));

function isInSectorArea(sector, flight) {
  const flights = ['BAW82', 'MSR777', 'AFR1015', 'EZY1002'];

  if(_.includes(flights, flight.arcid) && sector[1] === 'R') {
    return true;
  }
  return false;
}

function isInSectorVerticalArea(sector, flight) {
  const verticalLimits = [345, 365];

  const currentFlightLevel = _.get(flight, 'position.vertical.currentFlightLevel', 0);

  return _.inRange(currentFlightLevel, ...verticalLimits);
}