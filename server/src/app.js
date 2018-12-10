import express from 'express';
import { viceAnalyses } from './db';
import hasValidSubdomain, { extractSubdomain } from './subdomain';
import { ingressExists, endpointConfig } from './ingress';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
const fetch = require('node-fetch');

const app = express();
app.use(compression());
app.use(helmet());
app.use(morgan('combined'));

const apirouter = express.Router();

apirouter.get("/url-ready", async (req, res) => {
  const urlToCheck = req.query.url;

  if (!hasValidSubdomain(urlToCheck)) {
    throw new Error(`no valid subdomain found in ${urlToCheck}`);
  }

  const subdomain = extractSubdomain(urlToCheck);

  let ready = await ingressExists(subdomain);
  let endpoint;

  if (ready) {
    endpoint = await endpointConfig(subdomain).catch(e => {
      ready = false;
    });
  }

  if (ready) {
    ready = await fetch(urlToCheck, {
      "redirect": "manual"
    })
    .then(resp => {
      if (resp.ok) {
        return true;
      }
      return false;
    }).catch(e => false);
  }

  if (ready) {
    ready = await fetch(`http://${endpoint.IP}:${endpoint.Port}/url-ready`, {
      "redirect": "manual"
    })
    .then(resp => resp.json())
    .then(data => data["ready"])
    .catch(e => false);
  }

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
