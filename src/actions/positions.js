import d from 'debug';
const debug = d('4me.positions.actions');
import _ from 'lodash';
import merge from 'lodash/merge';

import {ASSOCIATE_FLIGHTS_WITH_POSITIONS} from './flight-list';

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
    
    const fetchPromise = new Promise((fulfill) => setTimeout(() => fulfill(stubPositionData), 3000));

    fetchPromise
    // Format our data
    .then(formatPositionData)
    .then((data) => {
      // First one will populate positions subtree :
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
  _.each(rawData, p => {
    ret[p.flightId] = p;
    delete ret[p.flightId].flightId;
  });

  return ret;
}