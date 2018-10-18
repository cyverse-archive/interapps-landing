import { createActions, handleActions } from 'redux-actions';

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
export const ShowFinished = 1;
export const ShowApps = 2;

const defaultState = {
  mobileOpen: false,
  pageToShow: ShowRunning,
  username: "",
  email: "",
  apps : {
    index: {},
    appsList: [] // Only store UUIDs.
  },
  analyses : {
    index: {},
    "running" : {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 0,
      items:[], // Only store UUIDs.
    },
    "finished" : {
      isFetching: false,
      didInvalidate: false,
      lastUpdated: 0,
      items:[] // Only store UUIDs.
    }
  }
};

export const { toggleMobileOpen, setPageToShow } = createActions({
  TOGGLE_MOBILE_OPEN: () => {},
  SET_PAGE_TO_SHOW: (pageToShow = ShowRunning) => pageToShow,
});

export const reducer = handleActions(
  {
    TOGGLE_MOBILE_OPEN: (state, {payload: mobileOpen}) => ({ ...state, mobileOpen: !state.mobileOpen}),
    SET_PAGE_TO_SHOW: (state, {payload: pageToShow}) => ({ ...state, pageToShow: pageToShow}),
  },
  defaultState
);
