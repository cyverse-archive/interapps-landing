import request from 'supertest';
import app from './app';
const nock = require('nock');

afterEach(nock.cleanAll);

describe('test the handlers', () => {
  test('/healthz succeeds', (done) => {
    return request(app)
      .get('/healthz')
      .expect(200, done);
  });

  test('/ succeeds', (done) => {
    return request(app)
      .get('/')
      .expect(200, 'Hello, World!', done);
  });

  test('/api/url-ready', (done) => {
    const url = 'http://afoo.cyverse.run:4343';

    const endpoint = {
      "IP": "127.0.0.1",
      "Port": 1247
    };

    // Make sure ingressExists will return true
    nock(process.env.INGRESS, {
      reqheaders: {
        'host' : process.env.APP_EXPOSER_HEADER
      }
    })
    .get(`/ingress/afoo`)
    .reply(200, {});

    // Make sure endpointConfig will return true
    nock(process.env.INGRESS, {
      reqheaders: {
        'host' : process.env.APP_EXPOSER_HEADER
      }
    })
    .get(`/endpoint/afoo`)
    .reply(200, endpoint);

    // Make sure the URL check returns true
    nock(url).get('/').reply(200, {});

    // Make sure the endpoint check returns true
    nock(`http://${endpoint.IP}:${endpoint.Port}`)
      .get('/url-ready')
      .reply(200, {"ready":true});

    return request(app)
      .get("/api/url-ready")
      .query({url: url})
      .expect(200, {"ready":true}, done);
  });
});
