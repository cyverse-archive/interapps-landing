import request from 'supertest';
import app from './app';
const nock = require('nock');

afterEach(nock.cleanAll);

function ingressExistsTrue() {
  // Make sure ingressExists will return true
  nock(process.env.INGRESS, {
    reqheaders: {
      'host' : process.env.APP_EXPOSER_HEADER
    }
  })
  .get(`/ingress/afoo`)
  .reply(200, {});
}

function ingressExistsFalse() {
  nock(process.env.INGRESS, {
    reqheaders: {
      'host' : process.env.APP_EXPOSER_HEADER
    }
  })
  .get(`/ingress/afoo`)
  .reply(404, {});
}

function endpointConfigTrue(endpoint) {
  // Make sure endpointConfig will return true
  nock(process.env.INGRESS, {
    reqheaders: {
      'host' : process.env.APP_EXPOSER_HEADER
    }
  })
  .get(`/endpoint/afoo`)
  .reply(200, endpoint);
}

function endpointConfigFalse(endpoint) {
  nock(process.env.INGRESS, {
    reqheaders: {
      'host' : process.env.APP_EXPOSER_HEADER
    }
  })
  .get(`/endpoint/afoo`)
  .reply(404, endpoint);
}

function endpointCheckTrue(endpoint) {
  // Make sure the endpoint check returns true
  nock(`http://${endpoint.IP}:${endpoint.Port}`)
    .get('/url-ready')
    .reply(200, {"ready":true});
}

function endpointCheckFalse(endpoint) {
  nock(`http://${endpoint.IP}:${endpoint.Port}`)
    .get('/url-ready')
    .reply(200, {"ready":false});
}

function endpointCheckError(endpoint) {
  nock(`http://${endpoint.IP}:${endpoint.Port}`)
    .get('/url-ready')
    .reply(404, {"ready":false});
}

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

  test('/api/url-ready returns true', (done) => {
    const url = 'http://afoo.cyverse.run:4343';
    const endpoint = {
      "IP": "127.0.0.1",
      "Port": 1247
    };

    ingressExistsTrue();
    endpointConfigTrue(endpoint);

    // Make sure the URL check returns true
    nock(url).get('/').reply(200, {});

    endpointCheckTrue(endpoint);

    return request(app)
      .get("/api/url-ready")
      .query({url: url})
      .expect(200, {"ready":true}, done);
  });

  test('/api/url-ready ingress does not exist', (done) => {
    const url = 'http://afoo.cyverse.run:4343';
    const endpoint = {
      "IP": "127.0.0.1",
      "Port": 1247
    }
    ingressExistsFalse();
    endpointConfigTrue();
    nock(url).get('/').reply(200, {}); // Make sure the URL check returns true
    endpointCheckTrue(endpoint);
    return request(app)
      .get("/api/url-ready")
      .query({url: url})
      .expect(200, {"ready":false}, done);
  });

  test('/api/url-ready endpointConfig false', (done) => {
    const url = 'http://afoo.cyverse.run:4343';
    const endpoint = {
      "IP": "127.0.0.1",
      "Port": 1247
    }
    ingressExistsTrue();
    endpointConfigFalse();
    nock(url).get('/').reply(200, {}); // Make sure the URL check returns true
    endpointCheckTrue(endpoint);
    return request(app)
      .get("/api/url-ready")
      .query({url: url})
      .expect(200, {"ready":false}, done);
  });

  test('/api/url-ready url check error', (done) => {
    const url = 'http://afoo.cyverse.run:4343';
    const endpoint = {
      "IP": "127.0.0.1",
      "Port": 1247
    }
    ingressExistsTrue();
    endpointConfigTrue();
    nock(url).get('/').reply(404, {}); // Make sure the URL check returns true
    endpointCheckTrue(endpoint);
    return request(app)
      .get("/api/url-ready")
      .query({url: url})
      .expect(200, {"ready":false}, done);
  });

  test('/api/url-ready endpoint check false', (done) => {
    const url = 'http://afoo.cyverse.run:4343';
    const endpoint = {
      "IP": "127.0.0.1",
      "Port": 1247
    }
    ingressExistsTrue();
    endpointConfigTrue();
    nock(url).get('/').reply(200, {}); // Make sure the URL check returns true
    endpointCheckFalse(endpoint);
    return request(app)
      .get("/api/url-ready")
      .query({url: url})
      .expect(200, {"ready":false}, done);
  });
});
