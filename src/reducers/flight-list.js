import d from 'debug';
const debug = d('4me.reducers.flightList');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SET_FLIGHT_LIST
} from '../actions/flight-list';

const defaultState = {
  lastFetched: null,
  lastUpdated: null,
  flights: {}
};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case SET_FLIGHT_LIST:
      return merge({}, state, {
        lastUpdated: Date.now(),
        lastFetched: action.data.result.lastUpdated,
        flights: action.data.entities.flights
      });
  }

  return state;
}