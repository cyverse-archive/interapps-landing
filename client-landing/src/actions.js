import { createActions, handleActions } from 'redux-actions';

import axios from 'axios';

export const StatusRunning = "Running";
export const StatusFailed = "Failed";
export const StatusCompleted = "Completed";

export class Analysis {
  constructor({
    id,
    job_name,
    job_description,
    result_folder_path,
    status,
    subdomain,
    start_date,
    end_date,
    planned_end_date,
    user_id,
    username,
    app_id,
    app_name,
    app_description,
    app_edited_date,
    tool_id,
    tool_name,
    tool_description,
    tool_version,
    working_directory,
    entrypoint,
    uid,
    min_cpu_cores,
    max_cpu_cores,
    pids_limit,
    skip_tmp_mount,
    container_port,
    image_id,
    image_name,
    image_tag,
    image_url,
    step
  }) {
    this.uuid = id
    this.name = job_name
    this.description = job_description
    this.resultFolderPath = result_folder_path
    this.subdomain = subdomain
    this.userID = user_id
    this.appID = app_id
    this.appName = app_name
    this.appDescription = app_description
    this.appEditedDate = app_edited_date
    this.toolID = tool_id
    this.toolName = tool_name
    this.toolDescription = tool_description
    this.toolVersion = tool_version
    this.workingDirectory = working_directory
    this.entrypoint = entrypoint
    this.uid = uid
    this.minCPUCores = min_cpu_cores
    this.maxCPUCores = max_cpu_cores
    this.pidsLimit = pids_limit
    this.skipTmpMount = skip_tmp_mount
    this.containerPort = container_port
    this.imageID = image_id
    this.imageName = image_name
    this.imageTag = image_tag
    this.imageURL = image_url
    this.step = step
    this.owner = username
    this.status = status
    this.startDate = start_date
    this.endDate = end_date
    this.plannedEndDate = planned_end_date
  }
}

export class App {
  constructor(
    uuid,
    name,
    toolName,
    toolVersion,
    description,
    creator,
    link
  ) {
    this.uuid = uuid
    this.name = name
    this.toolName = toolName
    this.toolVersion = toolVersion
    this.description = description
    this.creator = creator
    this.link = link
  }
}

export const ShowRunning = 0;
export const ShowCompleted = 1;
export const ShowFailed = 2;
export const ShowApps = 3;

const defaultState = {
  mobileOpen: false,
  pageToShow: ShowRunning,
  username: "",
  email: "",
  apps : {
    index: {},
  },
  analyses : {
    index: {},
    [StatusRunning]: [],
    [StatusCompleted]: [],
    [StatusFailed]: []
  }
};

export const {
  toggleMobileOpen,
  setPageToShow,
  addApp,
  addAnalysis,
  toggleFetchingApps,
  toggleFetchingAnalyses
} = createActions({
  TOGGLE_MOBILE_OPEN: () => {},
  SET_PAGE_TO_SHOW:   (pageToShow = ShowRunning) => pageToShow,
  ADD_APP:            (app) => app,
  ADD_ANALYSIS:       (analysis) => analysis
});

export const fetchAnalyses = () => {
  return dispatch => {
    return axios.get(`/api/analyses`, {withCredentials: true}).then(
      response => response.data.vice_analyses.forEach(i => dispatch(addAnalysis(i)))
    ).catch(function(error) {
      console.log('error from server: ', error.message);
    });
  };
};

export const reducer = handleActions(
  {
    TOGGLE_MOBILE_OPEN: (state, {payload: mobileOpen}) => ({ ...state, mobileOpen: !state.mobileOpen}),
    SET_PAGE_TO_SHOW:   (state, {payload: pageToShow}) => ({ ...state, pageToShow: pageToShow}),
    ADD_APP:            (state, {payload: app}) => ({ ...state, apps: {index: { ...state.apps.index, [app.uuid]: app}}}),
    ADD_ANALYSIS:       (state, {payload: analysis}) => {
      return {
        ...state,
        analyses: {
          ...state.analyses,
          index: {
            ...state.analyses.index,
            [analysis.uuid]: analysis
          },
          [analysis.status]: [ ...state.analyses[analysis.status], analysis.uuid ]
        }
      };
    },
  },
  defaultState
);
