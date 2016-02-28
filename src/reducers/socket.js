import d from 'debug';
const debug = d('4me.socket.reducers');
import _ from 'lodash';
import merge from 'lodash/merge';

import {
  SOCKET_INITIALIZED,
  SOCKET_CLIENT_CONNECTED,
  SOCKET_CLIENT_DISCONNECTED,
  SOCKET_SET_SUBSCRIPTION_FILTER,
} from '../actions/socket';


const defaultState = {
  initialized: false,
  clients: []
};

export default function reducer(state = defaultState, action) {
  switch(action.type) {
    case SOCKET_INITIALIZED:
      return merge({}, state, {initialized: true});
    case SOCKET_CLIENT_CONNECTED:
      return merge({}, state, {
        clients: [
          {
            id: action.clientId,
            sectors: [],
            verticalFilter: false
          },
          ...state.clients
        ]
      });
    case SOCKET_CLIENT_DISCONNECTED:
      return Object.assign({}, state, {
        clients: _.filter(state.clients, (c) => c.id !== action.clientId)
      });
    case SOCKET_SET_SUBSCRIPTION_FILTER:
      return reduceSubscriptionFilter(state, action);
  }
  return state;
}

function reduceSubscriptionFilter(state, action) {
  const clientFilter = (c) => c.id === action.clientId;

  const oldClient = _.find(state.clients, clientFilter);

  if(_.isEmpty(oldClient)) {
    return state;
  }

  const otherClients = _.reject(state.clients, clientFilter);

  const {sectors, verticalFilter} = action;

  let newClient = merge({}, oldClient, {
    sectors,
    verticalFilter
  });

  const newState = merge({}, state, {
    clients: [
      newClient,
      ...otherClients
    ]
  });

  debug(newState);

  return newState;
}