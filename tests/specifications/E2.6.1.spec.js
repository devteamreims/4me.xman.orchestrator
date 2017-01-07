import request from 'supertest';

import nock from 'nock';
import xmanData, {getXmanFlight} from '../data-mocks/xman';
import positionsData from '../data-mocks/positions';

import fp from 'lodash/fp';
import Promise from 'bluebird';

describe('E2.6.1 : will produce logs for a number of xman operations', () => {


  let parser;
  let positions;
  let xmanFlight;

  beforeEach(() => {
    // Get a single xmanFlight
    xmanFlight = getXmanFlight();

    const data = Object.assign({}, xmanData, {flights: [xmanFlight]});

    parser = nock(global.EGLL_PARSER_URL)
      .get(() => true)
      .reply(200, data);

    positions = nock(global.POSITIONS_URL)
      .get(() => true)
      // Match all queries
      .query(() => true)
      .reply(200, {});
  });

  afterEach(() => {
    // Remove mocks
    jest.resetModules();

    // Remove unused variables
    parser = null;
    positions = null;
    xmanFlight = null;
  });


  test('added flight', () => {
    // Use fake timers to prevent app refresh loops
    jest.useFakeTimers();

    // All flights are tracked
    //const mockGeo = require('../../src/geo/index.js');
    //mockGeo.isInTrackArea = jest.fn().mockReturnValue(false);
    //mockGeo.isInCaptureArea = jest.fn().mockReturnValue(false);
    //mockGeo.isInFreezeArea = jest.fn().mockReturnValue(false);

    // Start app
    const app = require('../../index').default;

    // Revert to real timers to use Promise.delay();
    jest.useRealTimers();

    return Promise.delay(500) // Let the app initialize
      .then(() => {
        const logRecord = fp.pipe(
          fp.get('LOG_STREAM.records'),
          fp.last
        )(global);

        expect(logRecord.flight.ifplId).toBe(xmanFlight.ifplId);
        expect(logRecord.payload.added).toBe(true);
      });

  });
});
