import d from 'debug';
const debug = d('4me.reducers.status');
import _ from 'lodash';

import {combineReducers} from 'redux';
import fetchers from './fetchers';

import {
  ESCALATE_FETCHER,
  ESCALATE_POS,
  RECOVER_FETCHER,
  RECOVER_POS,
} from '../../actions/status';

const defaultPositionState = {
  status: 'normal',
  lastUpdated: null,
};

function positions(state = defaultPositionState, action) {
  return state;
}

export default combineReducers({
  fetchers,
  positions,
});
