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
  const appsURL = `${process.env.APPS}/analyses/${analysisID}/parameters?user=${user}`;
  debug(`fetching analysis parameter info from ${appsURL}`);
  return fetch(appsURL);
}

export async function doRelaunch(user, analysisID) {
  const appsURL = `${process.env.APPS}/analyses/${analysisID}/parameters?user=${user}`;
  const subURL = `${process.env.APPS}/analyses?user=${user}`;

  debug(`relaunching analysis ${analysisID} for user ${user}`);

  return Promise.all([
    getParameters(user, analysisID).then(resp => resp.json()),
    getRelaunchInfo(user, analysisID).then(resp => resp.json())
  ])
  .then(([parameters, relaunchInfo]) => {
    let configmap = {};

    parameters.parameters.forEach(parameter => {
      configmap[parameters.full_param_id] = parameter.param_value.value;
    });

    return {
      name:                 relaunchInfo.name,
      label:                relaunchInfo.label,
      app_id:               relaunchInfo.id,
      debug:                relaunchInfo.debug || false,
      create_output_subdir: relaunchInfo.create_output_subdir || false,
      archive_logs:         relaunchInfo.archive_logs || false,
      output_dir:           relaunchInfo.output_dir,
      notify:               relaunchInfo.notify || true,
      description:          relaunchInfo.description,
      system_id:            relaunchInfo.system_id,
      config:               configmap,
      ['skip-parent-meta']: relaunchInfo['skip-parent-meta'] || false,
      callback:             relaunchInfo.callback || "",
    };
  })
  .then(submission => fetch(subURL, {
    method:  'post',
    body:    JSON.stringify(submission),
    headers: { 'Content-Type': 'application/json' }
  }));
}
