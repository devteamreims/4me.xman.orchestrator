import d from 'debug';
const debug = d('4me.socket.actions');
import _ from 'lodash';
import merge from 'lodash/merge';


// Socket clients management (connect/disconnect)
export const SOCKET_INITIALIZED = 'SOCKET_INITIALIZED';
export const SOCKET_CLIENT_CONNECTED = 'SOCKET_CLIENT_CONNECTED';
export const SOCKET_CLIENT_DISCONNECTED = 'SOCKET_CLIENT_DISCONNECTED';

import {setupSocketIo} from '../socket';

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