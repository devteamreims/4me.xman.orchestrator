import d from 'debug';
const debug = d('4me.socket');
import _ from 'lodash';

import {clientConnected, clientDisconnected, subscribeToFlights, unsubscribeToFlights} from '../actions/socket';


let mySocket;

// Global socketIo object event handler
export function setupSocketIo(dispatch, socketIo) {
  debug('Initializing socket.io');

  mySocket = socketIo;

  socketIo.on('connect', function(socket) {
    debug('client connected');
    dispatch(clientConnected(socket.id));
    dispatch(subscribeToFlights(socket.id, [12345]));
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
  socket.on('disconnect', () => dispatch(clientDisconnected(socket.id)));
  socket.on('subscribeToFlights', (flights) => {
    dispatch(subscribeToFlights(socket.id, flights));
  });

  socket.on('unsubscribeToFlights', (flights) => {
    dispatch(unsubscribeToFlights(socket.id, flights));
  });
}