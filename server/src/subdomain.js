// escapeRegExp will escape a string so that it can be safely interpolated into
// a regular expression string as a literal string. Taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// getSubdomainRegex will construct a RegExp object that can be used to tell if
// a subdomain is included in the string it's applied to. Uses the VICE_DOMAIN
// environment variable.
function getSubdomainRegex() {
  const viceDomain = escapeRegExp(process.env.VICE_DOMAIN);
  return new RegExp(`(a.*\.)?${viceDomain}(:[0-9]+)?/g`);
}

// We're calling this here so that it only gets called once, avoiding creating
// and compiling a RegExp object for each request.
export const subdomainRegex = getSubdomainRegex();

// hasValidSubdomain checks to see if the `str` parameter contains a subdomain
// and is part of the configured VICE_DOMAIN.
export default function hasValidSubdomain(str) {
  const fields = subdomainRegex.exec(str);
  return fields[0] !== undefined && fields[1] !== undefined;
}
