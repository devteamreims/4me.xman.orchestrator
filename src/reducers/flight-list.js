import d from 'debug';
const debug = d('4me.reducers.flightList');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SET_INITIAL_FLIGHT_LIST,
  ADD_FLIGHTS,
  REMOVE_FLIGHTS,
  UPDATE_FLIGHTS
} from '../actions/flight-list';

import {
  CAPTURE_FLIGHTS,
} from '../actions/positions';

const defaultState = {
  lastFetched: null,
  lastUpdated: null,
  flights: {}
};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    // In this case, create a brand new state
    case SET_INITIAL_FLIGHT_LIST:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched,
        flights: merge({}, action.entities.flights),
      };
    case REMOVE_FLIGHTS:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched || Date.now(),
        flights: _.omit(state.flights, action.ifplIds),
      };
    case ADD_FLIGHTS:
    case UPDATE_FLIGHTS:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched || Date.now(),
        flights: merge({}, state.flights, action.entities.flights),
      };
    case CAPTURE_FLIGHTS:
      const {ifplIds} = action;
      if(_.isEmpty(ifplIds)) {
        return state;
      }
      const flights = _.mapValues(state.flights, (f, ifplId) => {
        if(_.includes(ifplIds, ifplId)) {
          return _.defaults({}, {captured: true}, f, {captureTime: Date.now()});
        }
        return f;
      });
      return Object.assign({}, state, {flights});
  }

  return state;
}
