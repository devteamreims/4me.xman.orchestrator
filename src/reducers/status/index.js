import d from 'debug';
const debug = d('4me.reducers.status');
import _ from 'lodash';

import {combineReducers} from 'redux';
import fetchers from './fetchers';
import positions from './positions';

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

export default combineReducers({
  fetchers,
  positions,
});
