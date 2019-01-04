
const fetch = require('node-fetch');
const debug = require('debug')('permissions');



export async function getAppsForUser(user) {
    debug ("fetching app permissions for user " + user);
    return fetch(process.env.PERMISSIONS +  user + "/app?lookup=true")
        .then(response =>
            response.json()
        )
        .then(json => {
            const app_ids = json.permissions.map((perm)=> perm.resource.name);
            return app_ids;
            }
        )
        .catch(e => {
            debug("Error when fetching app permissions!");
            return [];
        });
}