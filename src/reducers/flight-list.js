import d from 'debug';
const debug = d('4me.reducers.flightList');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SET_FLIGHT_LIST,
  ASSOCIATE_FLIGHTS_WITH_POSITIONS
} from '../actions/flight-list';

export default function reducer(state, action) {
  if(state === undefined) {
    return {
      lastFetched: null,
      lastUpdated: null,
      flights: {}
    };
  }

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