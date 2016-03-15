import d from 'debug';
const debug = d('4me.actions.currentStatuses');

import _ from 'lodash';
import merge from 'lodash/merge';

import {
  getSocket,
  broadcastFlightUpdate
} from '../socket';

import {
  getFlightByIfplIdWithData,
} from '../selectors/flight';

export const SET_CURRENT_STATUS = 'SET_CURRENT_STATUS';
export const SET_CURRENT_STATUSES = 'SET_CURRENT_STATUSES';

function setCurrentStatusAction(ifplId, status) {
  return {
    type: SET_CURRENT_STATUS,
    ifplId,
    status
  };
}

function setCurrentStatuses(data) {
  return {
    type: SET_CURRENT_STATUSES,
    data: data
  };
}

export function loadFromDb() {
  return (dispatch, getState) => {
    // Load stuff from db, filter out untracked flights, update redux

  }
}

export function commitCurrentStatus(ifplId, status) {
  return (dispatch, getState) => {
    // Sanitize data
    const flight = getState().flightList.flights[ifplId];
    if(_.isEmpty(flight)) {
      const msg = `Trying to update status on an unknown flight : ${ifplId}`;
      debug(msg);
      return Promise.reject(msg);
    }

    // Save to db
    const dbSave = () => saveToDb(getState().currentStatuses);



    // Dispatch action
    const dispatchAction = () => Promise.resolve(dispatch(setCurrentStatusAction(ifplId, status)));

    // Send to socket
    const socket = getSocket();
    const emitToSocket = () => broadcastFlightUpdate(socket, getFlightByIfplIdWithData(getState(), ifplId));

    return dispatchAction()
      .then(dbSave)
      .then(emitToSocket)
      .catch((err) => debug(err));
  }
}

function saveToDb(stuffToSave) {
  debug('Calling promise');
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      debug('Resolving saveToDb');
      return resolve(stuffToSave)
    }, 100);
  });

  return p;
}
