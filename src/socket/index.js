import d from 'debug';
const debug = d('4me.socket');
import _ from 'lodash';

import {
  clientConnected,
  clientDisconnected,
  setSubscriptionFilter
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

  socket.on('disconnect', () => dispatch(clientDisconnected(socket.id)));
}

export function sendAddFlightsSignal(state, socket, flightIds) {
  debug('Emitting add_flights');
  debug(flightIds);

  socket.emit('add_flights', flightIds);
}

export function sendUpdateFlightsSignal(state, socket, flightIds) {
  debug('Emitting update_flights');
  debug(flightIds);

  socket.emit('update_flights', flightIds);
}

export function sendRemoveFlightsSignal(state, socket, flightIds) {
  debug('Emitting remove_flights');
  debug(flightIds);

  socket.emit('remove_flights', flightIds);
}