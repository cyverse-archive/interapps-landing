interapps-landing
=================

A web application hosting the loading and landing pages for the Visual Interactive Computing Environment (VICE) feature of the Discovery Environment.

## Development

You will need the following installed to work on the UI along with the API:

* npm - Version 6.4.1 or later should be installed.
* kubectl - Version 1.11 or later Needs to be installed and configured to hit a deployed Discovery Environment namespace.
* Go - Version 1.10 or above needs to be installed.

There are two npm projects, the top-level overarching project and the UI-specific project in the ui directory. To fire up the API alongside the UI, run `npm start` from the top-level directory.

To fire up just the UI, run `npm start` from the `ui` directory.

## Endpoints:

`GET /healthz` - Always returns a 200 status for now. Meant for use with Kubernetes liveness/readiness probes.

`GET /` - Returns a 404 page/loading page for a running VICE app.

`GET /api/jobs/status-updates?url=https://asdfgh.cyverse.run` - Returns a JSON encoded listing of job status updates for the job associated with the URL that is passed in as a query parameter. If the `url` query parameter is missing then a 400 will be returned.

 The JSON returned in the response should look like the following:

```json
{
  "job_status_updates" : [
    {
      "id": "339ace8a-32aa-4869-bc13-604c8d87586b",
      "message": "Running tool container gims.cyverse.org:5000/jupyter-lab:beta with arguments: ",
      "sent_on": 1536954304926,
      "status": "Running"
    }
  ]
}
```

`GET /api/url-ready?url=https://asdfgh.cyverse.run` - Returns a JSON encoded object containing the result of checking whether the given URL returns a 200 series status code when hit with an HTTP client and whether the subdomain is configured as an Ingress in the Kubernetes cluster. The URL passed in must have a subdomain of the configured VICE domain. If the `url` query parameter is missing then a 400 will be returned.

The JSON returned in the response should look like the following:

```json
{
  "ready" : true
}
```
