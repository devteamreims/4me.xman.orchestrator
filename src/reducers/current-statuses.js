import d from 'debug';
const debug = d('4me.reducers.currentStatuses');

import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SET_CURRENT_STATUS,
  SET_CURRENT_STATUSES,
  PRUNE_OLD_STATUSES,
} from '../actions/current-statuses';

const defaultState = {};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case SET_CURRENT_STATUS:
      let obj = {};
      obj[action.ifplId] = action.status;
      return Object.assign({}, state, obj);
    case SET_CURRENT_STATUSES:
      return Object.assign({}, action.data);
    case PRUNE_OLD_STATUSES:
      const { maxAge } = action;
      return _.omitBy(state, status => {
        const { when } = status;
        const age = Date.now() - when;
        return age > maxAge;
      });
  }

  return state;
}
