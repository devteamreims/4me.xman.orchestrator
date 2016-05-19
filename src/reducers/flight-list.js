import d from 'debug';
const debug = d('4me.reducers.flightList');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  ADD_FLIGHTS,
  REMOVE_FLIGHTS,
  UPDATE_FLIGHTS,
} from '../actions/flight-list';

import {
  CAPTURE_FLIGHTS,
  FREEZE_FLIGHTS,
  TRACK_FLIGHTS,
  IGNORE_FLIGHTS,
} from '../actions/positions';

const defaultState = {
  lastFetched: null,
  lastUpdated: null,
  flights: {}
};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case REMOVE_FLIGHTS:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched || Date.now(),
        flights: _.omit(state.flights, action.ifplIds),
      };
    case ADD_FLIGHTS:
    case UPDATE_FLIGHTS:
      return {
        lastUpdated: Date.now(),
        lastFetched: action.lastFetched || Date.now(),
        flights: merge({}, state.flights, action.entities.flights),
      };
    // TODO Refactor this stuff
    // A captured flight should be tracked automatically
    // A frozen flight should be captured
    case CAPTURE_FLIGHTS:
    {
      const {ifplIds} = action;

      if(_.isEmpty(ifplIds)) {
        return state;
      }

      const flights = _.mapValues(state.flights, (f, ifplId) => {
        if(_.includes(ifplIds, ifplId)) {
          return Object.assign({}, f, {captureTime: Date.now(), captured: true});
        }
        return f;
      });

      return Object.assign({}, state, {flights});
    }
    case FREEZE_FLIGHTS:
    {
      const {ifplIds} = action;

      if(_.isEmpty(ifplIds)) {
        return state;
      }

      const flights = _.mapValues(state.flights, (f, ifplId) => {
        if(_.includes(ifplIds, ifplId)) {
          return Object.assign({}, f, {freezeTime: Date.now(), frozen: true});
        }
        return f;
      });

      return Object.assign({}, state, {flights});
    }
    case TRACK_FLIGHTS:
    {
      const {ifplIds} = action;

      if(_.isEmpty(ifplIds)) {
        return state;
      }

      const flights = _.mapValues(state.flights, (f, ifplId) => {
        if(_.includes(ifplIds, ifplId)) {
          return Object.assign({}, f, {trackTime: Date.now(), tracked: true});
        }
        return f;
      });

      return Object.assign({}, state, {flights});

    }
    case IGNORE_FLIGHTS:
    {
      const {ifplIds} = action;

      if(_.isEmpty(ifplIds)) {
        return state;
      }

      const flights = _.mapValues(state.flights, (f, ifplId) => {
        if(_.includes(ifplIds, ifplId)) {
          return Object.assign({}, f, {tracked: false});
        }
        return f;
      });

      return Object.assign({}, state, {flights});
    }
  }

  return state;
}
