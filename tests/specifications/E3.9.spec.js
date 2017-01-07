import request from 'supertest';

import nock from 'nock';
import xmanData from '../data-mocks/xman';

import fp from 'lodash/fp';
import Promise from 'bluebird';
import moment from 'moment';

describe('E3.9 : raises an error when receiving stale data', () => {
  let parser;
  let positions;

  beforeEach(() => {
    // Get a single xmanFlight
    parser = nock(global.EGLL_PARSER_URL)
      .get(() => true);

    positions = nock(process.env.POSITIONS_URL)
      .get(() => true)
      // Match all queries
      .query(() => true)
      .reply(200, {});
  });

  afterEach(() => {
    // Remove mocks
    jest.resetModules();

    jest.clearAllTimers();

    // Remove unused variables
    parser = null;
    positions = null;
  });

  test('non stale data', () => {
    const data = fp.cloneDeepWith(undefined, xmanData);
    parser.reply(200, data);
    // Use fake timers to prevent app refresh loops
    // jest.useFakeTimers();

    // All flights are tracked
    //const mockGeo = require('../../src/geo/index.js');
    //mockGeo.isInTrackArea = jest.fn().mockReturnValue(false);
    //mockGeo.isInCaptureArea = jest.fn().mockReturnValue(false);
    //mockGeo.isInFreezeArea = jest.fn().mockReturnValue(false);

    // Start app
    const app = require('../../index').default;

    // Revert to real timers to use Promise.delay();
    // jest.useRealTimers();

    return Promise.delay(500) // Let the app initialize
      .then(() => request(app)
        .get('/status')
        .expect(res => {
          expect(res.body.items.fetchers.EGLL.status).toBe('normal');
          expect(res.body.items.fetchers.EGLL.error).toBe(null);
        })
      );
  });

  test('stale data', () => {
    const data = fp.cloneDeepWith(undefined, xmanData);

    Object.assign(data, {messageTime: moment().subtract(2, 'hours').toJSON()});

    parser.reply(200, data);

    // Use fake timers to prevent app refresh loops
    // jest.useFakeTimers();

    // All flights are tracked
    //const mockGeo = require('../../src/geo/index.js');
    //mockGeo.isInTrackArea = jest.fn().mockReturnValue(false);
    //mockGeo.isInCaptureArea = jest.fn().mockReturnValue(false);
    //mockGeo.isInFreezeArea = jest.fn().mockReturnValue(false);

    // Start app
    const app = require('../../index').default;

    // Revert to real timers to use Promise.delay();
    // jest.useRealTimers();

    return Promise.delay(500) // Let the app initialize
      .then(() => request(app)
        .get('/status')
        .expect(res => {
          expect(res.body.items.fetchers.EGLL.status).toBe('warning');
          expect(res.body.items.fetchers.EGLL.error).toMatch(/Stale .* data/i);
        })
      );
  });
});
