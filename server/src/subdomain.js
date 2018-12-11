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
  const viceURL = new URL(process.env.VICE_DOMAIN);
  const viceDomain = escapeRegExp(viceURL.host);
  return new RegExp(`(a.*\.)?${viceDomain}(:[0-9]+)?`);
}

export function extractSubdomain(urlWithSubdomain) {
  const u = new URL(urlWithSubdomain);
  const fields = u.hostname.split(".");
  if (fields.length < 2) {
    throw new Error(`no subdomain found in ${urlWithSubdomain}`);
  }
  if (fields.length === 2) {
    if (fields[0] === 'www') {
      return "";
    }
    return fields[0];
  }
  return fields.slice(0,fields.length-2).join('.');
}

// hasValidSubdomain checks to see if the `str` parameter contains a subdomain
// and is part of the configured VICE_DOMAIN.
export default function hasValidSubdomain(str) {
  const fields = getSubdomainRegex().exec(str);
  return fields !== null &&
         fields.length >= 2 &&
         fields[0] !== undefined &&
         fields[1] !== undefined;
}
