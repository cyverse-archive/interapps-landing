const nock = require('nock');

import { endpointConfig, ingressExists} from './ingress';

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
});
