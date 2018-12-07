import request from 'supertest';
import app from './app';

describe('test the handlers', () => {
  test('/healthz succeeds', (done) => {
    return request(app)
      .get('/healthz')
      .expect(200, done);
  });

  test('/ succeeds', (done) => {
    return request(app)
      .get('/')
      .expect(200, done);
  });
});
