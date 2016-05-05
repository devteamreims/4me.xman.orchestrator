
import _ from 'lodash';
import merge from 'lodash/merge';


import {UPDATE_POSITIONS} from '../actions/positions';

import {
  REMOVE_FLIGHTS,
} from '../actions/flight-list';
const defaultState = {
  lastFetched: null,
  positions: {}
};

export default function(state = defaultState, action) {
  switch(action.type) {
    case REMOVE_FLIGHTS:
      return Object.assign({}, state, {
        positions: _.omit(state.positions, action.ifplIds),
      })
    case UPDATE_POSITIONS:
      return merge({}, state, {
        lastFetched: action.lastFetched,
        positions: action.positions
      });
  }
  return state;
}
