import d from 'debug';
const debug = d('4me.actions.currentStatuses');

import _ from 'lodash';
import merge from 'lodash/merge';
import moment from 'moment';

import {
  getSocket,
  broadcastFlightUpdate
} from '../socket';

import {
  getFlightByIfplIdWithData,
} from '../selectors/flight';

import {
  logFlight,
} from '../logger';

export const SET_CURRENT_STATUS = 'SET_CURRENT_STATUS';
export const SET_CURRENT_STATUSES = 'SET_CURRENT_STATUSES';
export const PRUNE_OLD_STATUSES = 'PRUNE_OLD_STATUSES';

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

// Time in ms
// 12 hours
const MAX_AGE = 60*60*12*1000;
export function pruneOldStatuses(maxAge = MAX_AGE) {
  return (dispatch, getState) => {
    debug('Pruning actions older than %s', moment(Date.now() - maxAge).fromNow(true));
    return dispatch({
      type: PRUNE_OLD_STATUSES,
      maxAge,
    });
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
      .then(r => {
        logFlight(getState, ifplId, {xmanAction: true});
        return r;
      })
      .then(emitToSocket)
      .catch((err) => debug(err));
  }
}

import levelup from 'level';
import LeveLPromise from 'level-promise';

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
