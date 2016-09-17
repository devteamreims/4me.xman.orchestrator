import request from 'supertest';

describe('E2.8 : integrates in 4ME framework', () => {
  test('has a /status route', () => {
    jest.useFakeTimers();

    const app = require('../../index').default;

    return request(app)
      .get('/status')
      .expect(res => {
        expect(res.body.version).toBe(process.env.npm_package_version);
        expect(res.body.status).toBeDefined();
      });
  });
});
