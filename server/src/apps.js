const fetch = require('node-fetch');
const debug = require('debug')('permissions');


export async function getAppsForUser(user) {
  const appsURL = process.env.APPS + process.env.APPS_INTERACTIVE + user;
  debug(`fetching apps from ${appsURL}`);
  return fetch(appsURL);
}

export async function getRelaunchInfo(user, analysisID) {
  const appsURL =`${process.env.APPS}/analyses/${analysisID}/relaunch-info?user=${user}`;
  debug(`fetching relaunch info from ${appsURL}`);
  return fetch(appsURL);
}

export async function getParameters(user, analysisID) {
  const appsURL =`${process.env.APPS}/analyses/${analysisID}/parameters?user=${user}`;
  debug(`fetching analysis parameter info from ${appsURL}`);
  return fetch(appsURL);
}
