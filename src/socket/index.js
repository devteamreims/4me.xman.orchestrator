import d from 'debug';
const debug = d('4me.socket');
import _ from 'lodash';

import {
  clientConnected,
  clientDisconnected,
  setSubscriptionFilter,
  setXmanAction
} from '../actions/socket';

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

export function sendFlightListUpdate(mainSocket, clientId, flights) {
  mainSocket.to(clientId).emit('update_flights', flights);
}

export function broadcastFlightUpdate(mainSocket, flight) {
  mainSocket.emit('update_flight', flight);
}

export function broadcastStatusUpdate(mainSocket, status) {
  mainSocket.emit('update_status', status);
}
