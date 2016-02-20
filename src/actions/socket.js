import d from 'debug';
const debug = d('4me.socket.actions');
import _ from 'lodash';

export const ATTACH_SOCKET_IO = 'ATTACH_SOCKET_IO';
export const SOCKET_CLIENT_CONNECTED = 'SOCKET_CLIENT_CONNECTED';
export const SOCKET_CLIENT_DISCONNECTED = 'SOCKET_CLIENT_DISCONNECTED';
export const SOCKET_SUBSCRIBE_TO_FLIGHTS = 'SOCKET_SUBSCRIBE_TO_FLIGHTS';
export const SOCKET_UNSUBSCRIBE_TO_FLIGHTS = 'SOCKET_UNSUBSCRIBE_TO_FLIGHTS';

import {attachHandlerToSocketIo} from '../socket';

export function attachSocketIo(socketIo) {
  return (dispatch, getState) => {
    // First dispatch the action to attach socketIo
    dispatch(attachSocketIoAction(socketIo));

    // Attach socketIo stuff to our socket
    attachHandlerToSocketIo(dispatch, socketIo);
  };
}

function attachSocketIoAction(socketIo) {
  return {
      type: ATTACH_SOCKET_IO,
      socketIo: socketIo
  };
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

function sanitizeFlightIds(globalFlightList, flightIds) {
  let currentFlightIds = _.map(globalFlightList, (f) => f.id);
  let sanitizedFlightIds = _.intersection(flightIds, [12345, ...currentFlightIds]);
  return sanitizedFlightIds;
}

export function subscribeToFlights(clientId, flightIds) {
  return (dispatch, getState) => {
    debug('Called subscribeToFlights');

    // Sanitize flightIds
    let sanitizedFlightIds = sanitizeFlightIds(getState().flights, flightIds);
    
    if(!_.isEmpty(sanitizedFlightIds)) {
      debug('Calling dispatch !');
      dispatch({
        type: SOCKET_SUBSCRIBE_TO_FLIGHTS,
        clientId: clientId,
        flightIds: flightIds
      });
    }
  }
}

export function unsubscribeToFlights(clientId, flightIds) {
  return (dispatch, getState) => {
    // Sanitize flightIds
    const sanitizedFlightIds = sanitizeFlightIds(getState().flights, flightIds);
    if(!_.isEmpty(sanitizeFlightIds)) {
      dispatch({
        type: SOCKET_UNSUBSCRIBE_TO_FLIGHTS,
        clientId: clientId,
        flightIds: flightIds
      });
    }
  }
}