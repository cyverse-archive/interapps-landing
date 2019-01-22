import url from 'url';

const debug = require('debug')('subdomain');

// escapeRegExp will escape a string so that it can be safely interpolated into
// a regular expression string as a literal string. Taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// We're calling this here so that it only gets called once, avoiding creating
// and compiling a RegExp object for each request.
//let subdomainRegex = getSubdomainRegex();

// getSubdomainRegex will construct a RegExp object that can be used to tell if
// a subdomain is included in the string it's applied to. Uses the VICE_DOMAIN
// environment variable.
function getSubdomainRegex() {
  const viceURL = new url.URL(process.env.VICE_DOMAIN);
  const viceDomain = escapeRegExp(viceURL.host);
  debug(`getSubdomainRegex: escaped VICE_DOMAIN: ${viceDomain}`);
  return new RegExp(`(a.*\.)?${viceDomain}(:[0-9]+)?`);
}

export function extractSubdomain(urlWithSubdomain) {
  const u = new url.URL(urlWithSubdomain);
  const fields = u.hostname.split(".");

  debug(`hostname split; url: ${urlWithSubdomain}; fields: ${fields}`);

  if (fields.length < 2) {
    throw new Error(`no subdomain found in ${urlWithSubdomain}`);
  }
  if (fields.length === 2) {
    if (fields[0] === 'www') {
      debug(`extractSubdomain; URL: ${urlWithSubdomain}; return ''`);
      return "";
    }
    debug(`extractSubdomain; URL: ${urlWithSubdomain}; return ${field[0]}`);
    return fields[0];
  }
  const retval = fields.slice(0,fields.length-2).join('.');
  debug(`extractSubdomain; URL: ${urlWithSubdomain}; return ${retval}`);
  return retval;
}

// hasValidSubdomain checks to see if the `str` parameter contains a subdomain
// and is part of the configured VICE_DOMAIN.
export default function hasValidSubdomain(str) {
  const fields = getSubdomainRegex().exec(str);
  const isValid = (
    fields !== null &&
    fields.length >= 2 &&
    fields[0] !== undefined &&
    fields[1] !== undefined
  );
  debug(`hasValidSubdomain; input: ${str}; result: ${isValid}`);
  return isValid;
}
