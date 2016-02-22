import {combineReducers} from 'redux';

import socketReducer from './socket';
import flightListReducer from './flight-list';
import advisoryReducer from './advisories';
import positionsReducer from './positions';
import currentStatusesReducer from './current-statuses';

export default combineReducers({
  socket: socketReducer,
  flightList: flightListReducer,
  advisories: advisoryReducer,
  positions: positionsReducer,
  currentStatuses: currentStatusesReducer
});