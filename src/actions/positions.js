import d from 'debug';
const debug = d('4me.positions.actions');
import _ from 'lodash';
import merge from 'lodash/merge';

import {stubPositionData} from '../stubData';


export const UPDATE_POSITIONS = 'UPDATE_POSITIONS';

export function updatePositionsAction(positions) {
  return {
    type: UPDATE_POSITIONS,
    positions: positions,
    lastFetched: Date.now()
  };
}

export function fetchPositions() {
  return (dispatch, getState) => {
    const flightIds = _.keys(getState().flightList.flights);
    debug('Fetching positions for flights with IDs : [%s]', flightIds.join(','));
    
    const fetchPromise = new Promise((fulfill) => setTimeout(() => fulfill(stubPositionData), 5000));

    fetchPromise
    // Format our data
    .then(formatPositionData)
    .then((data) => {
      dispatch(updatePositionsAction(data));
    });
  }
}

function formatPositionData(rawData) {
  /*
   * Turn this : [{flightId: XXXX, ...}]
   * into this : {'flightId' : {...}}
   */

  let ret = {};
  _.each(_.cloneDeep(rawData), p => {
    ret[p.flightId] = p;
    delete ret[p.flightId].flightId;
  });

  return ret;
}