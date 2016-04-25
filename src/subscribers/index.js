import _ from 'lodash';
import d from 'debug';
const debug = d('4me.subscribers.index');

export function getSubscribers(store) {
  return {
    statusChangeHandler: statusChangeHandler(store),
  };
}


import {
  getPrettyStatus,
} from '../selectors/status';

import {
  getSocket,
  broadcastStatusUpdate,
} from '../socket';

function statusChangeHandler(store) {
  let previousValue;
  return () => {
    const newValue = getPrettyStatus(store.getState());

    // First run
    if(!previousValue) {
      previousValue = newValue;
    }


    if(previousValue === newValue) {
      return;
    }

    debug('Status updated, emitting socket update !');
    const socket = getSocket();
    broadcastStatusUpdate(socket, newValue);

    previousValue = newValue;
    return;
  }
}
