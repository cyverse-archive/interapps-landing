import express from 'express';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import db, { analysesQuery } from './db';

const sessionName = 'proxy-session';
const sessionKey = 'proxy-session-key';

const app = express();
const port = process.env.PORT || 60000;

const apirouter = express.Router();

apirouter.get("/url-ready", (req, res) => {
  const url_to_check = req.query.url;
  res.send(url_to_check);
});

// escapeRegExp will escape a string so that it can be safely interpolated into
// a regular expression string as a literal string. Taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
const subdomainRegex = getSubdomainRegex();

// hasValidSubdomain checks to see if the `str` parameter contains a subdomain
// and is part of the configured VICE_DOMAIN.
function hasValidSubdomain(str) {
  const fields = subdomainRegex.exec(str);
  return fields[0] !== undefined && fields[1] !== undefined;
}

apirouter.get("/analyses",(req, res) => {
    const username = req.query.user;
    db.any(analysesQuery, [username]).then(data => {
      res.send(JSON.stringify({"vice_analyses" : data}));
    });
});

apirouter.get("/url-ready", (req, res) => {
  const requrl = new URL(req.query.url);
  const reqhost = requrl.hostname;
});

app.use(cookieParser(crypto.randomBytes(256).toString('hex')));
app.use('/api', apirouter);

app.get('/healthz', (req, res) => res.send("I'm healthy."));
app.get('/', (req, res) => res.send("Hello, World!"));

app.listen(port, () => console.log(`example app listening on port ${port}!`));
