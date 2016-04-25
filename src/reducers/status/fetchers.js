import _ from 'lodash';
import d from 'debug';
const debug = d('4me.reducers.status.fetchers');

import {
  ESCALATE_FETCHER,
  RECOVER_FETCHER,
} from '../../actions/status';

const defaultFetcher = {
  status: 'normal',
  lastUpdated: Date.now(),
  error: null,
};

const defaultFetchersState = {
  'EGLL': _.cloneDeep(defaultFetcher),
};

export default function fetchers(state = defaultFetchersState, action) {
  switch(action.type) {
    case ESCALATE_FETCHER:
    case RECOVER_FETCHER:
      const {fetcher} = action;
      if(!fetcher || !_.has(state, fetcher)) {
        debug(`${fetcher} is not a valid fetcher !`);
        return state; // This should never happen
      }
      const newState = {};
      newState[fetcher] = singleFetcherReducer(state[fetcher], action);

      debug(newState);
      return Object.assign({}, state, newState);
  }

  return state;
}

function singleFetcherReducer(state, action) {
  switch(action.type) {
    case ESCALATE_FETCHER:
      const {error} = action;
      return Object.assign({}, state, {
        status: 'error',
        lastUpdated: Date.now(),
        error,
      });
    case RECOVER_FETCHER:
      return _.cloneDeep(defaultFetcher);
  }

  return state;
}
