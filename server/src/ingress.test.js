const nock = require('nock');

import { endpointConfig, ingressExists, IngressError} from './ingress';

afterEach(nock.cleanAll);

describe('endpointConfig', () => {
  test('endpointConfig with JSON response', async () => {
      const respObj = {
        "IP": "127.0.0.1",
        "Port": 1247
      };

      nock(process.env.INGRESS, {
        reqheaders: {
          'host' : process.env.APP_EXPOSER_HEADER
        }
      })
      .get(`/endpoint/afoo`)
      .reply(200, respObj);

      const config = await endpointConfig('afoo');

      expect(config).toEqual(respObj);
  });

  test('endpointConfig with error', async () => {
    const respObj = {
      "IP": "127.0.0.1",
      "Port": 1247
    };

    const error = 'this is an error';

    nock(process.env.INGRESS, {
      reqheaders: {
        'host' : process.env.APP_EXPOSER_HEADER
      }
    })
    .get(`/endpoint/afoo`)
    .replyWithError(error);

    expect.assertions(1);
    return endpointConfig('afoo').catch(e => expect(e.message).toMatch('this is an error'));
  })
});

describe('ingressExists', () => {
  test('ingressExists returns true', async () => {
    const respObj = {
      "this" : "could be",
      "anything" : "really"
    };

    nock(process.env.INGRESS, {
      reqheaders: {
        'host' : process.env.APP_EXPOSER_HEADER
      }
    })
    .get(`/ingress/afoo`)
    .reply(200, respObj);

    const retval = await ingressExists('afoo');

    expect(retval).toEqual(true);
  });

  test('ingresssExists with error raised from fetch', async () => {
    const respObj = {
      "this" : "could be",
      "anything" : "really"
    };

    nock(process.env.INGRESS, {
      reqheaders: {
        'host' : process.env.APP_EXPOSER_HEADER
      }
    })
    .get(`/ingress/afoo`)
    .replyWithError(respObj);

    const retval = await ingressExists('afoo');

    expect(retval).toEqual(false);
  });

  test('ingresssExists with error raised from fetch', async () => {
    const respObj = {
      "this" : "could be",
      "anything" : "really"
    };

    nock(process.env.INGRESS, {
      reqheaders: {
        'host' : process.env.APP_EXPOSER_HEADER
      }
    })
    .get(`/ingress/afoo`)
    .reply(404, respObj);

    const retval2 = await ingressExists('afoo');

    expect(retval2).toEqual(false);
  });
});
