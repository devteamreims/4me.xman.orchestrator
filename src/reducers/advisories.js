import d from 'debug';
const debug = d('4me.reducers.advisories');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SET_INITIAL_FLIGHT_LIST,
  ADD_FLIGHTS,
  REMOVE_FLIGHTS,
  UPDATE_FLIGHTS
} from '../actions/flight-list';

const defaultState = {};

export default function(state = defaultState, action) {
  // We must react to SET_FLIGHT_LIST, this is our main entry point in the app,
  // Pull all advisories from SET_FLIGHT_LIST
  // Return a brand new state, clear of previous advisories
  switch(action.type) {
    case SET_INITIAL_FLIGHT_LIST:
      return merge({}, action.entities.advisories);
    case REMOVE_FLIGHTS:
      return _.omit(state, action.ifplIds);
    case ADD_FLIGHTS:
    case UPDATE_FLIGHTS:
      return merge({}, state, action.entities.advisories);
  }
  return state;
}
