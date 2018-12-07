// Entrypoint into the server-side VICE UI code.
//
// Check the ../.env.example file to see what configuration settings need to be
// set.
import app from './app';
const port = process.env.PORT || 60000;
app.listen(port, () => console.log(`example app listening on port ${port}!`));
