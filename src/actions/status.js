import d from 'debug';
const debug = d('4me.actions.status');

export const ESCALATE_FETCHER = 'status/ESCALATE_FETCHER';
export const ESCALATE_POS = 'status/ESCALATE_POS';
export const RECOVER_FETCHER = 'status/RECOVER_FETCHER';
export const RECOVER_POS = 'status/RECOVER_POS';

export const SET_FETCHER_STATUS = 'status/SET_FETCHER_STATUS';

import {
  getPrettyStatus,
} from '../selectors/status';

export function escalateFetcher(fetcher, error) {
  return (dispatch, getState) => {
    // Dispatch action
    dispatch({
      type: ESCALATE_FETCHER,
      fetcher,
      error,
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

export function setFetcherStatus(fetcher, status) {
  return (dispatch, getState) => {
    // TODO : Some check if fetcher exists
    dispatch({
      type: SET_FETCHER_STATUS,
      fetcher,
      status,
    });
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
