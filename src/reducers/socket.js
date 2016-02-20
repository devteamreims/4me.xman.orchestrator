import d from 'debug';
const debug = d('reducers.socket');
import _ from 'lodash';

import {
  ATTACH_SOCKET_IO,
  SOCKET_CLIENT_CONNECTED,
  SOCKET_CLIENT_DISCONNECTED,
  SOCKET_SUBSCRIBE_TO_FLIGHTS,
  SOCKET_UNSUBSCRIBE_TO_FLIGHTS
} from '../actions/socket';

function reducer(state = {socketIo: null, clients: []}, action) {
  switch(action.type) {
    case ATTACH_SOCKET_IO:
      return Object.assign({}, state, {socketIo: action.socketIo});
    case SOCKET_CLIENT_CONNECTED:
      return Object.assign({}, state, {
        clients: [
          {
            id: action.clientId,
            subscribedFlights: []
          },
          ...state.clients
        ]
      });
    case SOCKET_CLIENT_DISCONNECTED:
      return Object.assign({}, state, {
        clients: _.filter(state.clients, (c) => c.id !== action.clientId)
      });
    case SOCKET_SUBSCRIBE_TO_FLIGHTS:
    case SOCKET_UNSUBSCRIBE_TO_FLIGHTS:
      debug('POUET ?');
      return reduceSubscribtion(state, action);
  }
  return state;
}

function reduceSubscribtion(state, action) {
  debug('nested reducer called !');
  let oldClient = _.find(state.clients, (c) => c.id === action.clientId);
  if(_.isEmpty(oldClient)) {
    return state;
  }
  let currentFlights = oldClient.subscribedFlights;
  let newFlights = [];

  let otherClients = _.without(state.clients, oldClient);
  if(action.type === SOCKET_SUBSCRIBE_TO_FLIGHTS) {
    newFlights = _.uniq([
      ...action.flightIds,
      ...currentFlights]);
  } else if(action.type === SOCKET_UNSUBSCRIBE_TO_FLIGHTS) {
    newFlights = _.without(currentFlights, ...action.flightIds);
  }

  let newClient = Object.assign({}, oldClient, {subscribedFlights: newFlights});
  const newState = Object.assign({}, state, {
    clients: [
      newClient,
      ...otherClients
    ]
  });

  debug(newState);
  return newState;
}

export default reducer;