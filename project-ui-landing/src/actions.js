import { createActions, handleActions } from 'redux-actions';

export const StatusRunning = "Running";
export const StatusFailed = "Failed";
export const StatusCompleted = "Completed";

export class Analysis {
  constructor(
    uuid,
    name,
    appName,
    description,
    owner,
    startDate = "",
    plannedEndDate = "",
    link = "",
    status = "",
    endDate = "",
    toolName = ""
  ) {
    this.uuid = uuid
    this.name = name
    this.appName = appName
    this.toolName = toolName
    this.description = description
    this.owner = owner
    this.status = status
    this.startDate = startDate
    this.link = link
    this.endDate = endDate
    this.plannedEndDate = plannedEndDate
  }
}

export class App {
  constructor(
    uuid,
    name,
    toolName,
    toolVersion,
    description,
    creator
  ) {
    this.uuid = uuid
    this.name = name
    this.toolName = toolName
    this.toolVersion = toolVersion
    this.description = description
    this.creator = creator
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

export const { toggleMobileOpen, setPageToShow, addApp, addAnalysis } = createActions({
  TOGGLE_MOBILE_OPEN: () => {},
  SET_PAGE_TO_SHOW:   (pageToShow = ShowRunning) => pageToShow,
  ADD_APP:            (app) => app,
  ADD_ANALYSIS:       (analysis) => analysis
});

export const reducer = handleActions(
  {
    TOGGLE_MOBILE_OPEN: (state, {payload: mobileOpen}) => ({ ...state, mobileOpen: !state.mobileOpen}),
    SET_PAGE_TO_SHOW:   (state, {payload: pageToShow}) => ({ ...state, pageToShow: pageToShow}),
    ADD_APP:            (state, {payload: app}) => ({ ...state, apps: {index: { ...state.apps.index, [app.uuid]: app}}}),
    ADD_ANALYSIS:       (state, {payload: analysis}) => {
      let status = analysis.status;
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
