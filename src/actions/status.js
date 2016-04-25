import d from 'debug';
const debug = d('4me.actions.status');

export const ESCALATE_FETCHER = 'status/ESCALATE_FETCHER';
export const ESCALATE_POS = 'status/ESCALATE_POS';
export const RECOVER_FETCHER = 'status/RECOVER_FETCHER';
export const RECOVER_POS = 'status/RECOVER_POS';

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
