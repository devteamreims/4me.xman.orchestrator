import {UPDATE_POSITIONS} from '../actions/positions';
import _ from 'lodash';
import merge from 'lodash/merge';

const defaultState = {
  lastFetched: null,
  positions: {}
};

export default function(state = defaultState, action) {
  switch(action.type) {
    case UPDATE_POSITIONS:
      return merge({}, state, {
        lastFetched: action.lastFetched,
        positions: action.positions
      });
  }
  return state;
}