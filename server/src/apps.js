const fetch = require('node-fetch');
const debug = require('debug')('permissions');


export async function getAppsForUser(user) {
    const appsURL = process.env.APPS + user;
    debug(`fetching apps from ${appsURL}`);
    return fetch(process.env.APPS + user);
}
