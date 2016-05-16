import _ from 'lodash';
import d from 'debug';
const debug = d('4me.reducers.status.fetchers');

import {
  ESCALATE_FETCHER,
  RECOVER_FETCHER,
  SET_FETCHER_STATUS,
} from '../../actions/status';

const defaultFetcher = {
  status: 'normal',
  lastUpdated: Date.now(),
  error: null,
  forceOff: false,
  forceMcs: false,
};

const defaultFetchersState = {
  'EGLL': _.cloneDeep(defaultFetcher),
};

export default function fetchers(state = defaultFetchersState, action) {
  switch(action.type) {
    case ESCALATE_FETCHER:
    case RECOVER_FETCHER:
    case SET_FETCHER_STATUS:
      const {fetcher} = action;

      if(!fetcher || !_.has(state, fetcher)) {
        debug(`${fetcher} is not a valid fetcher !`);
        return state; // This should never happen
      }

      const newState = {};
      newState[fetcher] = singleFetcherReducer(state[fetcher], action);

      return Object.assign({}, state, newState);
  }

  return state;
}

function singleFetcherReducer(state, action) {
  switch(action.type) {
    case ESCALATE_FETCHER:
      const {
        error,
        level = 'critical',
      } = action;
      return Object.assign({}, state, {
        status: level,
        lastUpdated: Date.now(),
        error,
      });
    case RECOVER_FETCHER:
      return Object.assign({}, _.cloneDeep(defaultFetcher), _.pick(state, ['forceOff', 'forceMcs']));
    case SET_FETCHER_STATUS:
      const status = _.get(action, 'status', {});
      return Object.assign({}, state, {
        lastUpdated: Date.now(),
        ...status,
      });
  }

  return state;
}
