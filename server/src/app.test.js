import request from 'supertest';
import app from './app';

describe('test the handler for the /healthz path', () => {
  test('urlReadyHandler succeeds', (done) => {
    return request(app)
      .get('/healthz')
      .expect(200, done);
  });
});
