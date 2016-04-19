import _ from 'lodash';

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

export function combineAllFlightData(state) {
  return _.map(state.flightList.flights, combineSingleFlight(state))
}

function combineSingleFlight(state) {
  return (flight, ifplId) => Object.assign({}, flight, {
    ifplId,
    advisory: state.advisories[ifplId] || {},
    currentStatus: state.currentStatuses[ifplId] || {},
    position: state.positions.positions[ifplId] || defaultPosition
  });
}

export function combineFlightData(state, ifplId) {
  const flight = _.get(state.flightList.flights, ifplId);

  if(flight === undefined) {
    return {};
  }

  return Object.assign({}, flight, {
    ifplId,
    advisory: state.advisories[ifplId] || {},
    currentStatus: state.currentStatuses[ifplId] || {},
    position: state.positions.positions[ifplId] || defaultPosition
  });
}

export function flightToString(flight) {
  return `${flight.arcid}/${flight.ifplId}`;
}
