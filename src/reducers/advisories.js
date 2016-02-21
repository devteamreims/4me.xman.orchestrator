import d from 'debug';
const debug = d('4me.reducers.advisories');
import _ from 'lodash';
import merge from 'lodash/merge';

import {SET_FLIGHT_LIST} from '../actions/flight-list';

const defaultState = {};

export default function(state = defaultState, action) {
  // We must react to SET_FLIGHT_LIST is our main entry point in the app,
  // Pull all advisories from SET_FLIGHT_LIST
  switch(action.type) {
    case SET_FLIGHT_LIST:
      return merge({}, state, action.data.entities.advisories)
  }
  return state;
}