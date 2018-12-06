import express from 'express';

import { viceAnalyses } from './db';
import hasValidSubdomain from './subdomain';


const sessionName = 'proxy-session';
const sessionKey = 'proxy-session-key';
const app = express();
const port = process.env.PORT || 60000;
const apirouter = express.Router();

apirouter.get("/url-ready", (req, res) => {
  const url_to_check = req.query.url;
  res.send(url_to_check);
});

apirouter.get("/analyses",(req, res) => {
    const username = req.query.user;
    viceAnalyses(username, (data) => {
      res.send(JSON.stringify({"vice_analyses" : data}));
    })
});

app.use('/api', apirouter);

app.get('/healthz', (req, res) => res.send("I'm healthy."));
app.get('/', (req, res) => res.send("Hello, World!"));

app.listen(port, () => console.log(`example app listening on port ${port}!`));
