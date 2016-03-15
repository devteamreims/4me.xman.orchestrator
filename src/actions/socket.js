import d from 'debug';
const debug = d('4me.socket.actions');
import _ from 'lodash';
import merge from 'lodash/merge';


// Socket clients management (connect/disconnect)
export const SOCKET_INITIALIZED = 'SOCKET_INITIALIZED';
export const SOCKET_CLIENT_CONNECTED = 'SOCKET_CLIENT_CONNECTED';
export const SOCKET_CLIENT_DISCONNECTED = 'SOCKET_CLIENT_DISCONNECTED';

import {setupSocketIo} from '../socket';

import {
  getFlightByIfplId,
  getFlightByIfplIdWithData,
} from '../selectors/flight';

import {
  commitCurrentStatus
} from './current-statuses';

export function initializeSocket(socketIo) {
  return (dispatch, getState) => {
    setupSocketIo(dispatch, socketIo);
    dispatch(socketInitialized());
  }
}

function socketInitialized() {
  return {
    type: SOCKET_INITIALIZED
  }
}

export function clientConnected(clientId) {
  return {
    type: SOCKET_CLIENT_CONNECTED,
    clientId: clientId
  };
}

export function clientDisconnected(clientId) {
  return {
    type: SOCKET_CLIENT_DISCONNECTED,
    clientId: clientId
  };
}


// Socket clients subscriptions
export const SOCKET_SET_SUBSCRIPTION_FILTER = 'SOCKET_SET_SUBSCRIPTION_FILTER';

function setSubscriptionFilterAction(clientId, filter) {
  const defaultSubscription = {
    sectors: [],
    verticalFilter: false
  };

  const {sectors, verticalFilter} = merge(defaultSubscription, filter);

  return {
    type: SOCKET_SET_SUBSCRIPTION_FILTER,
    clientId,
    sectors,
    verticalFilter
  };
}

export function setXmanAction(data) {
  // Expect data to be like this :
  /*
  {
    ifplId: XXX,
    xmanAction: {
      speed: XXX,
      machReduction: XXX,
      minimumCleanSpeed: true/false
    },
    who: {
      sectors: [],
      cwp: {
        id: 123,
        name: 'P123'
      }
    }
  }
  */
  return (dispatch, getState) => {

    const ifplId = _.get(data, 'ifplId', -1);
    const flight = getFlightByIfplId(getState(), ifplId);

    if(_.isEmpty(flight)) {
      debug(`Got an xman action for an untracked flight ! ${data.ifplId}`);
      return Promise.reject();
    }

    // Build our currentStatus object
    const when = Date.now();
    const who = {
      sectors: _.get(data, 'who.sectors', []),
      cwp: {
        id: _.get(data, 'who.cwp.id', -1),
        name: _.get(data, 'who.cwp.name', 'Unknown')
      }
    };

    const xmanAction = _.get(data, 'xmanAction', {});


    const {currentStatus} = getFlightByIfplIdWithData(getState(), ifplId);
    const currentMachReduction = _.get(currentStatus, 'machReduction', null);
    const currentSpeed = _.get(currentStatus, 'speed', null);
    const currentMcs = _.get(currentStatus, 'minimumCleanSpeed', null);

    let {machReduction, speed, minimumCleanSpeed} = xmanAction;

    if(minimumCleanSpeed === undefined) {
      minimumCleanSpeed = currentMcs;
    }

    if(machReduction === undefined) {
      machReduction = currentMachReduction;
    }

    if(speed === undefined) {
      speed = currentSpeed;
    }


    const status = {
      when,
      who,
      machReduction,
      speed,
      minimumCleanSpeed
    };

    return dispatch(commitCurrentStatus(ifplId, status));
  };
}

export function setSubscriptionFilter(clientId, filter) {
  return (dispatch, getState) => {
    const clientFilter = (c) => c.id === clientId;

    // Check if socket exists
    const state = getState().socket;
    const oldClient = _.find(state.clients, clientFilter);

    if(_.isEmpty(oldClient)) {
      debug(`Tried to set subscription filter on an unknown socket ${clientId}`);
      return;
    }

    if(!_.isArray(filter.sectors)) {
      debug(`Trying to set sector subscription on clientId ${clientId} with invalid data : ${sectors}`);
      return;
    }

    dispatch(setSubscriptionFilterAction(clientId, filter));
  };
}
