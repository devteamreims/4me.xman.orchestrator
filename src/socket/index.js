import d from 'debug';
const debug = d('4me.socket');
import _ from 'lodash';

import {
  clientConnected,
  clientDisconnected,
  setSubscriptionFilter,
  setXmanAction
} from '../actions/socket';

import {
  getFlightsWithData
} from '../selectors/flight';


let mySocket;

// Global socketIo object event handler
export function setupSocketIo(dispatch, socketIo) {
  debug('Initializing socket.io');

  mySocket = socketIo;

  socketIo.on('connect', function(socket) {
    debug('client connected');
    dispatch(clientConnected(socket.id));
    attachHandlerToSocket(dispatch, socket);
  });

  return mySocket;
}


export function getSocket() {
  return mySocket;
}

// Per client socket event handler
export function attachHandlerToSocket(dispatch, socket) {
  debug('Attaching socket handlers to client with id : %s', socket.id);
  
  socket.on('set_subscription_filter', (data) => {
    debug('set_subscription_filter');
    dispatch(setSubscriptionFilter(socket.id, data));
  });

  socket.on('set_action', (data) => {
    debug('socket: set_action');
    debug(data);

    dispatch(setXmanAction(data));
  });

  socket.on('disconnect', () => dispatch(clientDisconnected(socket.id)));
}

import {
  getClients
} from '../selectors/socket-clients';

import {
  getFlightByFlightIdWithData,
  isFlightInFilter
} from '../selectors/flight';

const socketsToNotify = (state, flightId) => {
  const clients = getClients(state);
  const clientToFilter = (client) => ({sectors: client.sectors, verticalFilter: client.verticalFilter});

  const flight = getFlightByFlightIdWithData(state, flightId);

  const shouldNotify = (client) => isFlightInFilter(clientToFilter(client))(flight);

  return _(clients)
    .filter(shouldNotify)
    .map(c => c.id)
    .value();
}

export function sendAddFlightsSignal(state, mainSocket, flightIds) {
  debug('Emitting add_flights');
  const clients = getClients(state);

  _.each(flightIds, (flightId) => {
    const flight = getFlightByFlightIdWithData(state, flightId);
    const socketIds = socketsToNotify(state, flightId);

    debug(`Flight with id ${flightId}, notifying clientIds :`);
    debug(socketIds);
    
    _.each(socketIds, (clientId) => mainSocket.to(clientId).emit('add_flights', [flight]));
  });

}

export function sendUpdateFlightsSignal(state, mainSocket, flightIds) {
  debug('Emitting update_flights');
  const clients = getClients(state);

  _.each(flightIds, (flightId) => {
    const flight = getFlightByFlightIdWithData(state, flightId);
    const socketIds = socketsToNotify(state, flightId);

    debug(`Flight with id ${flightId}, notifying sockets :`);
    debug(socketIds);

    _.each(socketIds, (clientId) => mainSocket.to(clientId).emit('update_flights', [flight]));
  });
}

export function sendRemoveFlightsSignal(state, mainSocket, flightIds) {
  debug('Emitting remove_flights');
  const clients = getClients(state);

  _.each(flightIds, (flightId) => {
    const socketIds = socketsToNotify(state, flightId);

    debug(`Flight with id ${flightId}, notifying sockets :`);
    debug(socketIds);

    _.each(socketIds, (clientId) => mainSocket.to(clientId).emit('remove_flights', [flightId]));
  });
}