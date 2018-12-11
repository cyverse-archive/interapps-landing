const fetch = require('node-fetch');

export class IngressError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, IngressError);
  }
}

// Fetches K8s Endpoint information about the subdomain from the app-exposer
// service, returns a promise with the response body parsed as JSON.
export async function endpointConfig(subdomain) {
  let endpointAPI = new URL(process.env.INGRESS);
  endpointAPI.pathname = `/endpoint/${subdomain}`;

  const reqOptions = {
    headers: {
      "Host" : process.env.APP_EXPOSER_HEADER
    }
  };
  return fetch(endpointAPI.toString(), reqOptions)
    .then(response => response.json());
}

// Returns true if an ingress exists for the subdomain passed in.
export async function ingressExists(subdomain) {
  const ingressAPI = new URL(`/ingress/${subdomain}`, process.env.INGRESS);
  const reqOptions = {
    headers: {
      "Host" : process.env.APP_EXPOSER_HEADER
    }
  };
  return fetch(ingressAPI.toString(), reqOptions)
    .then(response => {
      if (response.ok) {
        return true;
      }
      return false;
    })
    .catch(e => {return false;});
}
