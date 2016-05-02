import d from 'debug';
const debug = d('4me.reducers.advisories');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  ADD_FLIGHTS,
  REMOVE_FLIGHTS,
  UPDATE_FLIGHTS
} from '../actions/flight-list';

const defaultState = {};

export default function(state = defaultState, action) {
  switch(action.type) {
    case REMOVE_FLIGHTS:
      return _.omit(state, action.ifplIds);
    case ADD_FLIGHTS:
    case UPDATE_FLIGHTS:
      return merge({}, state, action.entities.advisories);
  }
  return state;
}
