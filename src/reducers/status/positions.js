import _ from 'lodash';
import d from 'debug';
const debug = d('4me.reducers.status.fetchers');

import {
  ESCALATE_POS,
  RECOVER_POS,
} from '../../actions/status';

const defaultState = {
  status: 'error',
  lastUpdated: Date.now(),
  error: null,
};

export default function positions(state = defaultState, action) {
  switch(action.type) {
    case ESCALATE_POS:
      const {error} = action;
      return Object.assign({}, state, {
        status: 'error',
        lastUpdated: Date.now(),
        error,
      });
    case RECOVER_POS:
      return Object.assign({}, state, {
        status: 'normal',
        lastUpdated: Date.now(),
      });
  }

  return state;
}
