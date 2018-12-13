interapps-landing
=================

A web application hosting the loading and landing pages for the Visual Interactive Computing Environment (VICE) feature of the Discovery Environment.

## Development

### Prerequisites

You will need the following installed to work on the UI along with the API:

* npm - Version 6.4.1 or later should be installed.
* kubectl - Version 1.11 or later Needs to be installed and configured to hit a deployed Discovery Environment namespace.

### Configuration

The server project uses dotenv to configure set of environment variables. The full list of environment variables is:

* PORT - The port number the server will listen on for requests.
* DB - The connection string for the DE database
* VICE_DOMAIN - The public-facing base URL for VICE, used for extracting subdomain information.
* APP_EXPOSER_HEADER - The HTTP Host header value for accessing the app-exposer service API.
* INGRESS - The URL to the Kubernetes Ingress.
* UI - The relative path to the built UI that the server should serve up on `/`. It's relative to the index.js file in the `server/src/index.js` file.
* DEBUG - Optional, can contain a comma-separated list of modules in src for which to enable debug logging. Can also be set to `*`.

A sample `.env` file is provided at `server/.env.example`. All `.env` files should be blocked from being checked in by the `.gitignore`, but make sure you don't accidentally check in a file with sensitive info.

The `.env` file for the server project should be located in the `server/` subdirectory.

### Initializing

You should start off by running `npm install` in the top-level directory. Then do one of the following:

* Run `build.sh` from the top-level directory. It will go through each project directory and run `npm install` followed by `npm run build`.

* Go into each of the projects and manually run `npm install`.

### Building

Each of the projects (`client-landing`, `client-loading`, `server`) can be built individually by running `npm run build` while inside their corresponding project directories.

You can build everything at once by running the `build.sh` script from the top-level directory.

The result will be a `build` directory created in each of the project directories. Directories named `build` are ignored by Git.

### Cleaning

The top-level package.json has `clean` and `clean-all` scripts defined. The `clean` script will clear out each project's `build` directory, while the `clean-all` script will clear out the `build` and `node_modules` directories.

You can run them with:
* `npm run clean`
* `npm run clean-all`

### Running everything during development

You can fire up everything (minus storybook instances) by executing `npm start` from the top-level directory. This should open up a couple of browser tabs with the landing and loading pages.

Each of the UI projects is configured to reverse proxy requests to the server instance that gets started up. Make sure you have your `.env` file created at `server/.env`.

You can also just fire up the dev version of the landing page with `npm run landing` in the top-level directory. Similarly, you can fire up the loading page with `npm run loading` in the same location.

The code for the server and the UIs should auto-reload if a change is detected in their respective source files. That should only occur during development and not in the container created for deployment.

### Storybook

The `client-landing` and `client-loading` projects both have storybook support. You can start up storybook by running `npm run storybook` from their respective project directories.

## Endpoints:

`GET /healthz` - Always returns a 200 status for now. Meant for use with Kubernetes liveness/readiness probes.

`GET /` - Returns a 404 page/loading page for a running VICE app.

`GET /api/url-ready?url=https://asdfgh.cyverse.run` - Returns a JSON encoded object containing the result of checking whether the given URL returns a 200 series status code when hit with an HTTP client and whether the subdomain is configured as an Ingress in the Kubernetes cluster. The URL passed in must have a subdomain of the configured VICE domain. If the `url` query parameter is missing then a 400 will be returned.

The JSON returned in the response should look like the following:

```json
{
  "ready" : true
}
```
