import d from 'debug';
const debug = d('4me.reducers.currentStatuses');

import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SET_CURRENT_STATUS,
  SET_CURRENT_STATUSES
} from '../actions/current-statuses';

const defaultState = {};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case SET_CURRENT_STATUS:
      let obj = {};
      obj[action.flightId] = action.status;
      return merge({}, state, obj);
    case SET_CURRENT_STATUSES:
      return merge({}, action.data);
  }

  return state;
}