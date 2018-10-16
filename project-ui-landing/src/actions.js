import { createActions, handleActions } from 'redux-actions';

export class Analysis {
  constructor(
    uuid,
    name,
    appName,
    description,
    owner,
    toolName = "",
    status = "",
    startDate = "",
    link = "",
    endDate = "",
    plannedEndDate = ""
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

const defaultState = {
  username: "",
  email: "",
  apps : {
    index: {
      // "uuid" : {
      //   appName: "",
      //   toolName: "",
      //   appVersion: "",
      //   toolVersion: "",
      //   description: "",
      //   creator: "",
      //   permissions: [""]
      // }
    },
    appsList: [] // Only store UUIDs.
  },
  analyses : {
    index: {
      // Example of what should be stored in the index
      // "uuid" : {
      //   appID: "",
      //   appName: "",
      //   toolName: "",
      //   appVersion: "",
      //   toolVersion: "",
      //   description: "",
      //   owner: "",
      //   permissions: [""],
      //   inputs : {
      //     files: [""],
      //     folders: [""]
      //   },
      //   status: "",
      //   startDate: "",
      //   endDate: "",
      //   plannedEndDate: 0,
      // }
    },
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
