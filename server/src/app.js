import express from 'express';
import { viceAnalyses } from './db';
import hasValidSubdomain, { extractSubdomain } from './subdomain';
import { endpointConfig, ingressExists } from './ingress';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';


const fetch = require('node-fetch');
const debug = require('debug')('app');


var session = require('express-session');
var RedisStore = require('connect-redis')(session);

const app = express();
app.use(compression());
app.use(helmet());
app.use(morgan('combined'));

let sess = {
    store: new RedisStore({host: process.env.REDIS_HOST, port: process.env.REDIS_PORT}),
    secret: 'interapps',
    resave: false,
    saveUninitialized: false,
};

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));

app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('Unable to handle session')) // handle error
    }
    next() // otherwise continue
});


const apirouter = express.Router();


var ClientOAuth2 = require('client-oauth2');

var cyverseAuth = new ClientOAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessTokenUri: process.env.ACCESS_TOKEN_URI,
    authorizationUri: process.env.AUTHORIZATION_URI,
    redirectUri: process.env.REDIRECT_URI,
});


apirouter.get('/auth/provider', function (req, res) {
    var uri = cyverseAuth.code.getUri();
    debug("cyverse auth---->" + cyverseAuth.code.getUri());
    res.redirect(uri);
});

apirouter.get('/auth/provider/callback', function (req, res) {
    let username = "";
    cyverseAuth.code.getToken(req.originalUrl)
        .then(function (user) {
            console.log(user); //=> { accessToken: '...', tokenType: 'bearer', ... }
            fetch(process.env.PROFILE_URI + user.accessToken)
                .then(res =>
                    res.json()
                )
                .then(json => {
                    console.log("user=>" + json.id);
                    username = json.id;
                    // We should store the token into a database.
                    return res.redirect(process.env.SERVER_NAME + "/?user=" + username);
                });
        })
});

apirouter.get('/logout', function (req, res) {
    debug("cyverse auth logout---->" + process.env.LOGOUT);
    res.redirect(process.env.LOGOUT);
});

// test session with redis
apirouter.get('/test', function (req, res, next) {
    if (req.session.views) {
        req.session.views++;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
});

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

apirouter.get("/analyses", async (req, res) => {
  const username = req.query.user;
  viceAnalyses(username, (data) => {
    res.send(JSON.stringify({"vice_analyses" : data}));
  })
});


app.use('/api', apirouter);
app.get('/healthz', (req, res) => res.send("I'm healthy."));

const uiDir = process.env.UI || '../../client-landing/build';
const uiPath = path.join(__dirname, uiDir);
console.log(uiPath);
app.use(express.static(uiPath));

export default app;
