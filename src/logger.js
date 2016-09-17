import d from 'debug';

import bunyan from 'bunyan';

export const opsLog = bunyan.createLogger({
  name: 'xman-ops',
  streams: [
    {
      level: process.env.NODE_ENV === 'test' ? bunyan.FATAL + 1 : 'info',
      stream: process.stdout,
    }
  ],
});

const debug = {
  lifecycle: d('4me.lifecycle'),
  flight: d('4me.flight'),
};

export function lifecycleLogger(...args) {
  return debug['lifecycle'](...args);
}

import {
  getFlightByIfplIdWithData,
} from './selectors/flight';

export function logFlight(getState, ifplId, payload) {
  const flight = getFlightByIfplIdWithData(getState(), ifplId);

  return opsLog.info({
    flight,
    ifplId,
    payload,
  });

}
