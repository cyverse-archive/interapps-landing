// Entrypoint into the server-side VICE UI code.
//
// Check the ../.env.example file to see what configuration settings need to be
// set.
import app from './app';
import http from 'http';
import https from 'https';
import fs from 'fs';

const port = process.env.PORT || 60000;
const keyPath = process.env.TLS_KEY_PATH || '/etc/ssl/tls.key';
const certPath = process.env.TLS_CERT_PATH || '/etc/ssl/tls.crt';

if (app.get('env') === 'production') {
  const sslOpts = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(sslOpts, app).listen(port, () => console.log(`vice ui listening on port ${port}!`));
} else {
  http.createServer(app).listen(port, () => console.log(`vice ui listening on port ${port}!`));
}
