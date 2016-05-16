import d from 'debug';
const debug = d('4me.actions.status');
import _ from 'lodash';

export const ESCALATE_FETCHER = 'status/ESCALATE_FETCHER';
export const ESCALATE_POS = 'status/ESCALATE_POS';
export const RECOVER_FETCHER = 'status/RECOVER_FETCHER';
export const RECOVER_POS = 'status/RECOVER_POS';

export const SET_FETCHER_STATUS = 'status/SET_FETCHER_STATUS';


export function escalateFetcher(fetcher, error, level = 'error') {
  return (dispatch, getState) => {
    // Dispatch action
    dispatch({
      type: ESCALATE_FETCHER,
      fetcher,
      error,
      level,
    });
  }
}

export function escalatePositions(error) {
  return (dispatch, getState) => {
    // Dispatch action to store
    dispatch({
      type: ESCALATE_POS,
      error,
    });
  }
}

import {
  sendNotifications,
} from './positions';

import {
  isForcedOff,
  isForcedMcs,
} from '../selectors/fetchers';

import {
  getSingleFetcher,
} from '../selectors/status';

export function setFetcherStatus(fetcher, status) {
  return (dispatch, getState) => {
    try {
      getSingleFetcher(getState(), fetcher);
    } catch(err) {
      debug(`actions/status/setFetcherStatus: ${fetcher} is not a valid fetcher !`);
      return;
    }


    const before = {
      forceMcs: isForcedMcs(getState(), fetcher),
      forceOff: isForcedOff(getState(), fetcher),
    };

    dispatch({
      type: SET_FETCHER_STATUS,
      fetcher,
      status,
    });

    const after = {
      forceMcs: isForcedMcs(getState(), fetcher),
      forceOff: isForcedOff(getState(), fetcher),
    };

    // If forceMcs / forceOff has been changed, force clients list refresh
    if(!_.isEqual(before, after)) {
      debug('forceOff / forceMcs changed, trigger flight list update !');
      sendNotifications(getState);
    }
  }
}


export function recoverFetcher(fetcher) {
  return {
    type: RECOVER_FETCHER,
    fetcher,
  };
}

export function recoverPositions() {
  return {
    type: RECOVER_POS,
  };
}
