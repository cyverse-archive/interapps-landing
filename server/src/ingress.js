const fetch = require('node-fetch');

const ingressURL = process.env.INGRESS;
const appExposerHeader = process.env.APP_EXPOSER_HEADER;

// Fetches K8s Endpoint information about the subdomain from the app-exposer
// service, returns a promise with the response body parsed as JSON.
export async function endpointConfig(subdomain) {
  console.log(ingressURL)
  let endpointAPI = new URL(ingressURL);
  endpointAPI.pathname = `/endpoint/${subdomain}`;

  const reqOptions = {
    headers: {
      "Host" : appExposerHeader
    }
  };
  return fetch(endpointAPI.toString(), reqOptions)
    .then(response => response.json());
}

// Returns true if an ingress exists for the subdomain passed in.
export async function ingressExists(subdomain) {
  const ingressAPI = new URL(`/ingress/${subdomain}`, ingressURL);
  const reqOptions = {
    headers: {
      "Host" : appExposerHeader
    }
  };
  return await fetch(ingressAPI.toString(), reqOptions)
    .then(response => response.json())
    .then(obj => resolve(true))
    .catch(e => resolve(false));
}
