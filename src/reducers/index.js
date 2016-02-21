import {combineReducers} from 'redux';

import socketReducer from './socket';
import flightListReducer from './flight-list';
import advisoryReducer from './advisories';
import positionsReducer from './positions';

export default combineReducers({
  socket: socketReducer,
  flightList: flightListReducer,
  advisories: advisoryReducer,
  positions: positionsReducer
});