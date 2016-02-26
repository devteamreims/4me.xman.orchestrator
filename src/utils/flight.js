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
  return (flight, flightId) => Object.assign({}, flight, {
    advisory: state.advisories[flightId] || {},
    currentStatus: state.currentStatuses[flightId] || {},
    position: state.positions.positions[flightId] || defaultPosition
  });
}

export function combineFlightData(state, flightId) {
  const flight = _.get(state.flightList.flights, flightId);

  if(flight === undefined) {
    return {};
  }

  return Object.assign({}, flight, {
    advisory: state.advisories[flightId] || {},
    currentStatus: state.currentStatuses[flightId] || {},
    position: state.positions.positions[flightId] || defaultPosition
  });
}