
const fetch = require('node-fetch');
const debug = require('debug')('permissions');



export async function getAppsForUser(user) {
    debug ("fetching apps for user " + user);
    return fetch(process.env.APPS + user)
        .then(response =>
            response.json()
        )
        .then(json => {
            debug("Apps ==>" + json);
            return json;
            }
        )
        .catch(e => {
            debug("Error when fetching apps!");
            return [];
        });
}