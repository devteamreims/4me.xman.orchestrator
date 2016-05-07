import _ from 'lodash';

import {
  getSingleFetcher,
} from './status';


export const isForcedOff = (state, destination) => {
  const fetcher = getSingleFetcher(state, destination);
  return _.get(fetcher, 'forceOff', false);
};

export const isForcedMcs = (state, destination) => {
  const fetcher = getSingleFetcher(state, destination);
  return _.get(fetcher, 'forceMcs', false);
};
