import url from 'url';

const fetch = require('node-fetch');
const debug = require('debug')('ingress');

export class IngressError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, IngressError);
  }
}

// Fetches K8s Endpoint information about the subdomain from the app-exposer
// service, returns a promise with the response body parsed as JSON.
export async function endpointConfig(subdomain) {
  let endpointAPI = new url.URL(process.env.INGRESS);
  endpointAPI.pathname = `/endpoint/${subdomain}`;

  const reqOptions = {
    headers: {
      "Host" : process.env.APP_EXPOSER_HEADER
    }
  };
  debug(`fetching endpoint config from ${endpointAPI.toString()} for ${subdomain}`);
  return fetch(endpointAPI.toString(), reqOptions)
    .then(response => response.json())
    .then(response => {
      debug(`response from ${endpointAPI.toString()} for ${subdomain}: ${response.text()}`);
    });
}

// Returns true if an ingress exists for the subdomain passed in.
export async function ingressExists(subdomain) {
  const ingressAPI = new url.URL(`/ingress/${subdomain}`, process.env.INGRESS);
  const reqOptions = {
    headers: {
      "Host" : process.env.APP_EXPOSER_HEADER
    }
  };
  debug(`ingress check; subdomain: ${subdomain}; api ${ingressAPI.toString()}`)
  return fetch(ingressAPI.toString(), reqOptions)
    .then(response => {
      if (response.ok) {
        return true;
      }
      return false;
    })
    .then(response => {
      debug(`ingress check; subdomain: ${subdomain}; api: ${ingressAPI.toString()}; response: ${response}`);
    })
    .catch(e => {return false;});
}
