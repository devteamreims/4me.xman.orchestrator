import _ from 'lodash';
import d from 'debug';
const debug = d('4me.selectors.status');

import {
  getFetchers as getConfigFetchers,
} from '../../config/fetchers';

import {createSelector} from 'reselect';

export const getRaw = (state) => _.get(state, 'status');


const getPositions = state => _.get(getRaw(state), 'positions');
const getFetchers = state => _.get(getRaw(state), 'fetchers');


export const getPositionsStatus = state => _.get(getPositions(state), 'status');

const getSingleFetcher = (state, fetcher) => {
  if(!_.hasIn(getConfigFetchers(), fetcher)) {
    throw new Error(`${fetcher} is not a known fetcher !`);
  }

  return _.get(getFetchers(state), fetcher);
};

export const getFetchersStatus = (state, fetcher) => {
  // Fetcher is defined, return single fetcher status
  if(fetcher !== undefined) {
    return _.get(getSingleFetcher(state, fetcher), 'status');
  }



  // Fetcher is undefined, reduce fetchers status
  const knownFetchers = _.keys(getConfigFetchers());

  const fetcherStatuses = _.map(knownFetchers, f => getFetchersStatus(state, f));

  if(_.some(fetcherStatuses, s => s === 'critical')) {
    return 'critical';
  }

  return 'normal';
};


export const isEverythingOk = (state) => getFetchersStatus(state) === 'normal' && getPositionsStatus(state) === 'normal';

export const getPrettyStatus = createSelector(
  getPositions,
  getFetchers,
  isEverythingOk,
  (positions, fetchers, globalOK) => {
    return {
      status: globalOK ? 'normal' : 'critical',
      items: {
        positions,
        fetchers,
      },
    };
  });
