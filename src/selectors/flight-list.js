import _ from 'lodash';

const getRaw = (state) => _.get(state, 'flightList');

export const isFirstRun = (state) => _.get(getRaw(state), 'lastFetched') === null;

export const getFlights = (state) => _.get(getRaw(state), 'flights', {});
