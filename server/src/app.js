import express from 'express';
import { viceAnalyses, getDB } from './db';
import hasValidSubdomain, { extractSubdomain } from './subdomain';
import { endpointConfig, ingressExists } from './ingress';
import { getAppsForUser } from './apps';
import compression from 'compression';
import helmet from 'helmet';
import noCache from 'nocache';
import morgan from 'morgan';
import path from 'path';
import url from 'url';

const fetch = require('node-fetch');
const debug = require('debug')('app');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const dateFunc = require("add-subtract-date");

const app = express();
app.use(compression());
app.use(helmet());
app.use(morgan('combined'));

const db = getDB();
const domainURL = new url.URL(process.env.VICE_DOMAIN);

let sess = {
    store: new pgSession({
      pgPromise: db
    }),
    secret: 'interapps',
    resave: false,
    saveUninitialized: false,
    cookie: {
      domain: domainURL.hostname
    }
};

if (app.get('env') === 'production') {
    app.set('trust proxy', (ip) => {
      debug(`ip: ${ip}`);
      return true;
    }); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));

app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('Unable to handle session')) // handle error
    }
    next(); // otherwise continue
});

let ClientOAuth2 = require('client-oauth2');

let cyverseAuth = new ClientOAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessTokenUri: process.env.ACCESS_TOKEN_URI,
    authorizationUri: process.env.AUTHORIZATION_URI,
    redirectUri: process.env.REDIRECT_URI,
});


let isSessionExpired = (expirationTime) => new Date().getTime() > expirationTime;


app.get('/healthz', (req, res) => res.send("I'm healthy."));

// test session with redis
app.get('/test', function (req, res) {
    if (req.session.accessToken) {
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>token: ' + req.session.accessToken + '</p>');
        res.write('<p>expired:' + isSessionExpired(req.session.expiry) + '</p>');
        res.end();
    } else {
        res.end('No token. Please login!');
    }
});

// OAuth end-points
app.get('/auth/provider', function (req, res) {
    res.redirect(cyverseAuth.code.getUri());
});

app.get('/auth/provider/callback', function (req, res) {
    let username = "";
    cyverseAuth.code.getToken(req.originalUrl)
        .then(function (user) {
            debug(user); //=> { accessToken: '...', tokenType: 'bearer', ... }

            fetch(process.env.PROFILE_URI + user.accessToken)
                .then(res =>
                    res.json()
                )
                .then(json => {
                    username = json.id;

                    const current = new Date();
                    debug("current date ===>" + current.getTime());
                    debug("expiry in ===>" + user.data.expires_in);
                    debug("expiry time ===>" +
                        dateFunc.add(current, user.data.expires_in, "seconds").getTime());

                    req.session.accessToken = user.accessToken;
                    req.session.username = username;
                    req.session.expiry =
                        dateFunc.add(current, user.data.expires_in, "seconds").getTime();

                    // redirect user to app
                    return res.redirect(process.env.SERVER_NAME);
                })
                .catch((e) => {
                    debug("Error getting user profile: " + e);
                    res.send(500).send("");
                });
        })
        .catch((e) => {
            debug("Error getting token: " + e);
            res.status(500).send("");
        });
});

app.get('/logout', function (req, res) {
    req.session.accessToken = null;
    req.session.username = null;
    req.session.expired = true;
    res.redirect(process.env.LOGOUT);
});

const apirouter = express.Router();

// Caching the UI is fine, API responses not yet.
apirouter.use(noCache());

apirouter.get("/url-ready", async (req, res) => {
  const urlToCheck = req.query.url;

  debug(`url-ready; URL: ${urlToCheck}`);

  if (!hasValidSubdomain(urlToCheck)) {
    debug(`url-ready; URL: ${urlToCheck}; hasValidSubdomain: false`);
    throw new Error(`no valid subdomain found in ${urlToCheck}`);
  }

  const subdomain = extractSubdomain(urlToCheck);
  debug(`url-ready; URL: ${urlToCheck}; subdomain: ${subdomain}`);

  let ready = await ingressExists(subdomain);
  let endpoint;

  debug(`url-ready; URL: ${urlToCheck}; ready after ingress check: ${ready}`);

  if (ready) {
    endpoint = await endpointConfig(subdomain).catch(e => {
      debug(`url-ready: URL: ${urlToCheck}; endpoint config error: ${e}`);
      ready = false;
    });
  }

  debug(`url-ready; URL: ${urlToCheck}; ready after fetching endpoint config: ${ready}`);

  if (ready) {
    ready = await fetch(urlToCheck, {
      "redirect": "manual"
    })
    .then(resp => {
      debug(`url-ready; URL: ${urlToCheck}; fetch response: ${resp.status}`);
      if (resp.status >= 200 && resp.status < 400) {
        return true;
      }
      return false;
    })
    .catch(e => false);
  }

  debug(`url-ready; URL: ${urlToCheck}; ready after fetching URL: ${ready}`);

  if (ready) {
    ready = await fetch(`http://${endpoint.IP}:${endpoint.Port}/url-ready`, {
      "redirect": "manual"
    })
    .then(resp => resp.json())
    .then(data => data["ready"])
    .then(data => {
      debug(`url-ready; URL: ${urlToCheck}; fetch endpoint response: ${data}`);
      return data;
    })
    .catch(e => false);
  }

  debug(`url-ready; URL: ${urlToCheck}; ready after fetching endpoint: ${ready}`);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({ready: ready}));
});

apirouter.get("/profile", async (req,res)=>{
    debug("calling get profile for " + req.session.username);
    if(req.session.username) {
        res.send(JSON.stringify({"username": req.session.username}));
    } else {
        res.send(500).send("Unable to fetch user profile from session.");
    }
});

apirouter.get("/analyses", async (req, res) => {
    debug("calling get analyses for " + req.session.username + " with query=" + req.query.status);
    const username = req.session.username + process.env.UUID_DOMAIN;
    const status = req.query.status;
    viceAnalyses(username, status, (data) => {
        if (data && data.length > 0) {
            let analyses = data.map((a) => {
               let urlParts = process.env.VICE_DOMAIN.split("//");
                a.url = urlParts[0] + "//" + a.subdomain +"." + urlParts[1];
                debug("Interactive url==>" + a.url);
                return a;
            });
            res.send(JSON.stringify({"vice_analyses": analyses}));
        } else {
            res.send(JSON.stringify({"vice_analyses": []}));
        }
    });
});

apirouter.get("/apps", async (req, res) => {
    debug("calling get apps for " + req.session.username);
    const username = req.session.username;
    await getAppsForUser(username)
      .then(appsResp => {
          res.status(appsResp.status);
          return appsResp;
      })
      .then(appsResp => appsResp.buffer())
      .then(data => res.send(data));
});


app.use('/api', apirouter);

function authy(whitelist) {
 return (req, res, next) => {
    debug("validating session in authy middleware");
    debug(`accessToken: ${req.session.accessToken}`);
    debug(`session expired: ${isSessionExpired(req.session.expiry)}`);
    debug(`whitelist includes ${req.path}: ${whitelist.includes(req.path)}`);

    if ((req.session.accessToken && !isSessionExpired(req.session.expiry)) || whitelist.includes(req.path)) {
      next();
    } else {
      res.redirect(cyverseAuth.code.getUri());
    }
  };
}

app.use(authy(
  [
    '/auth/provider',
    '/auth/provider/callback',
    '/heathz',
    '/test'
  ]
));

const uiDir = process.env.UI || '../../client-landing/build';
const uiPath = path.join(__dirname, uiDir);
debug(uiPath);
app.use(express.static(uiPath));

export default app;
