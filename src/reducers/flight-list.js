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
        flights: merge({}, action.entities.flights)
      };
    case REMOVE_FLIGHTS:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched || Date.now(),
        flights: _.omit(state.flights, action.flightIds)
      };
    case ADD_FLIGHTS:
    case UPDATE_FLIGHTS:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched || Date.now(),
        flights: merge({}, state.flights, action.entities.flights)
      };
  }

  return state;
}