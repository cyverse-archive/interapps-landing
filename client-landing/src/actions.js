import { createActions, handleActions } from 'redux-actions';
import axios from 'axios';
import constants from "./constants";
import url from 'url';

function errorHandler(error, dispatch) {
    console.log('error from server: ', error.message);
    // Normalize the error objects a bit before dumping them into the redux
    // state.
    if (!error.response || !error.response.status) {
      error.status = 500;
    } else {
      error.status = error.response.status;
    }

    // Every error needs to have a message.
    if (!error.message || error.message === "") {
      error.message = "Unknown error";
    }

    // We should probably track the times that the errors are received for
    // support purposes.
    if (!error.dateCreated) {
      error.dateCreated = Date.now();
    }

    // Send the users to the login page if we get a FORBIDDEN error.
    if (error.status === 403) {
        var parser = document.createElement('a');
        parser.href = window.location.href;
        parser.pathname = constants.LOGIN_URL;
        window.location.assign(parser.href);
    }

    // We shouldn't need this in the near future, kept around to avoid
    // breakages.
    dispatch(setHttpCode(error.status));

    // Add the error to the redux store.
    dispatch(addError(error));

    dispatch(setErrorDialogOpen(true));
}

export const StatusRunning = "Running";
export const StatusFailed = "Failed";
export const StatusCompleted = "Completed";

export class Analysis {
    constructor({
                    id,
                    job_name,
                    job_description,
                    result_folder_path,
                    username,
                    start_date,
                    end_date,
                    subdomain,
                    status,
                    planned_end_date,
                    user_id,
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
                    step,
                    url,
                }) {
        this.uuid = id;
        this.name = job_name;
        this.description = job_description;
        this.resultFolderPath = result_folder_path;
        this.subdomain = subdomain;
        this.userID = user_id;
        this.appID = app_id;
        this.appName = app_name;
        this.appDescription = app_description;
        this.appEditedDate = app_edited_date;
        this.toolID = tool_id;
        this.toolName = tool_name;
        this.toolDescription = tool_description;
        this.toolVersion = tool_version;
        this.workingDirectory = working_directory;
        this.entrypoint = entrypoint;
        this.uid = uid;
        this.minCPUCores = min_cpu_cores;
        this.maxCPUCores = max_cpu_cores;
        this.pidsLimit = pids_limit;
        this.skipTmpMount = skip_tmp_mount;
        this.containerPort = container_port;
        this.imageID = image_id;
        this.imageName = image_name;
        this.imageTag = image_tag;
        this.imageURL = image_url;
        this.step = step;
        this.owner = username;
        this.status = status;
        this.startDate = start_date;
        this.endDate = end_date;
        this.plannedEndDate = planned_end_date;
        this.url = url;
    }
}

export class App {
    constructor({
                    id,
                    name,
                    description,
                    integrator_name,
                    rating,
                    app_type,
                    is_public,
                    beta,
                    disabled,
                }) {
        this.uuid = id;
        this.name = name;
        this.description = description;
        this.creator = integrator_name;
        this.rating = rating;
        this.type = app_type;
        this.isPublic = is_public;
        this.isBeta = beta;
        this.isDisabled = disabled;
  }
}

export const ShowRunning = 0;
export const ShowCompleted = 1;
export const ShowFailed = 2;
export const ShowApps = 3;
export const ShowError = 4;
export const ShowData = 5;

const defaultState = {
    mobileOpen: false,
    pageToShow: ShowRunning,
    username: "",
    email: "",
    apps: [],
    analyses: [],
    httpCode: 200,
    loading: false,
    deHost: "",
    drawerOpen: false,
    errorDialogOpen: false,
    errors: [],
    dataResources: {
      requesting: false,
      currentDirectory: "",
      collection: {}, // id is the key, value is an object containing the fields returned.
      resources: [], //  contains the id's of the resources in sorted order.
      sortField: "name",
      sortDirection: "asc",
      selected: {}, // use it like a set. key is the id
      pageSize: 10,
      currentPage: 0,
      zone: "iplant",
      total: 0
    }
}

export const {
    toggleDrawerOpen,
    setPageToShow,
    addApps,
    addAnalyses,
    loggedIn,
    setHttpCode,
    toggleLoading,
    toggleMobileOpen,
    setErrorDialogOpen,
    addError,
    rmError,
    clearErrors,
    setCurrentDirectory,
    addDataResource,
    setDataResources,
    clearResources,
    rmDataResource,
    setPageSize,
    setCurrentPage,
    setSortField,
    setSortDirection,
    setTotal,
    setZone,
    toggleRequestingDataResources,
} = createActions({
    TOGGLE_DRAWER_OPEN: () => {
    },
    SET_PAGE_TO_SHOW: (pageToShow = ShowRunning) => pageToShow,
    ADD_APPS: (apps) => apps,
    ADD_ANALYSES: (analyses) => analyses,
    LOGGED_IN: (username) => username,
    SET_HTTP_CODE: (httpCode) => httpCode,
    TOGGLE_LOADING: () => {
    },
    TOGGLE_MOBILE_OPEN: (mobileOpen) => mobileOpen,
    SET_ERROR_DIALOG_OPEN: (errorDialogOpen) => errorDialogOpen,
    ADD_ERROR: (error) => error,
    RM_ERROR: (dateCreated) => dateCreated,
    CLEAR_ERRORS: () => {},
    SET_CURRENT_DIRECTORY: (dir) => dir,
    ADD_DATA_RESOURCE: (resource) => resource,
    SET_DATA_RESOURCES: (resources) => resources,
    CLEAR_RESOURCES: () => {},
    SET_PAGE_SIZE: (size) => size,
    SET_CURRENT_PAGE: (page) => page,
    SET_SORT_FIELD: (field) => field,
    SET_SORT_DIRECTION: (direction) => direction,
    SET_TOTAL: (total) => total,
    SET_ZONE: (zone) => zone,
    TOGGLE_REQUESTING_DATA_RESOURCES: () => {},
});

export const fetchAnalyses = (status) => {
  return dispatch => {
      dispatch(toggleLoading());
      return axios.get(`/api/analyses?status=` + status, {withCredentials: true}).then(
        response => {
            const results = response.data.vice_analyses.map(i => (new Analysis(i)));
            dispatch(addAnalyses(results));
            dispatch(setHttpCode(200));
            dispatch(toggleLoading());
        }
    ).catch(function(error) {
          errorHandler(error, dispatch);
    });
  };
};

export const fetchDataResources = (path, offset=0, limit=500, sortField="", sortDir="", zone="iplant") => {
  return dispatch => {
    dispatch(toggleRequestingDataResources());
    dispatch(toggleLoading());

    let p = new URLSearchParams();
    p.set('offset', offset);
    p.set('limit', limit);
    p.set('sortField', sortField);
    p.set('sortDir', sortDir);

    const pathPrefix = `/${zone}`;
    if (path.startsWith(pathPrefix)) {
      path = path.slice(pathPrefix.length);
    }

    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    p.set('path', path);

    return axios.get(`/api/data?${p.toString()}`, {withCredentials: true})
      .then(resp => {
          dispatch(setCurrentDirectory(resp.data.path));
          dispatch(setTotal(resp.data.total));
          //dispatch(clearResources());
          dispatch(setDataResources(resp.data.resources));
          dispatch(toggleRequestingDataResources());
          dispatch(toggleLoading());
      })
      .catch(e => {
        errorHandler(e, dispatch);
        dispatch(toggleRequestingDataResources());
        dispatch(toggleLoading());
      });
  }
}

export const fetchApps = () => {
    return dispatch => {
        dispatch(toggleLoading());
        return axios.get(`/api/apps`, {withCredentials: true}).then(
            response => {
                const results = response.data.apps.map(i => (new App(i)));
                dispatch(addApps(results));
                dispatch(setHttpCode(200));
                dispatch(toggleLoading());
            }
        ).catch(function (error) {
            errorHandler(error, dispatch);
        });
    };
};

export const fetchProfile = () => {
    return dispatch => {
        dispatch(toggleLoading());
        return axios.get("/api/profile", {withCredentials: true}).then(
            response => {
                dispatch(loggedIn(response.data));
                dispatch(setHttpCode(200));
                dispatch(toggleLoading());
            }
        ).catch(function (error) {
            errorHandler(error, dispatch);
        });
    }
};

export const reducer = handleActions(
    {
        TOGGLE_DRAWER_OPEN: (state) => ({...state, drawerOpen: !state.drawerOpen}),
        SET_PAGE_TO_SHOW: (state, {payload: pageToShow}) => ({...state, pageToShow: pageToShow}),
        ADD_APPS: (state, {payload: apps}) => {
            return {...state, apps: apps};
        },
        ADD_ANALYSES: (state, {payload: analyses}) => {
            return {
                ...state,
                analyses: analyses,
            };
        },
        LOGGED_IN: (state, {payload: data}) => {
            return {
                ...state,
                username: data.username,
                deHost:data.de_host,
            }
        },
        SET_HTTP_CODE: (state, {payload: httpCode}) => {
            return {
                ...state,
                httpCode: httpCode,
            }
        },
        TOGGLE_LOADING: (state) => ({...state, loading: !state.loading}),
        TOGGLE_MOBILE_OPEN: (state ,{payload: mobileOpen}) => ({...state, mobileOpen: mobileOpen}),
        SET_ERROR_DIALOG_OPEN: (state, {payload: dialogOpen}) => ({...state, errorDialogOpen: dialogOpen}),
        ADD_ERROR: (state, {payload: error}) => {
          let copy = [...state.errors];
          copy.unshift(error);
          return {...state, errors: copy};
        },
        RM_ERROR: (state, {payload: index}) => {
          let newstate = [...state.errors];
          newstate.splice(index, 1);
          return {...state, errors: newstate};
        },
        CLEAR_ERRORS: (state) => ({...state, errors: []}),
        SET_CURRENT_DIRECTORY: (state, {payload: currentDirectory}) => (
          {
            ...state,
            dataResources: {
              ...state.dataResources,
              currentDirectory: currentDirectory,
            }
          }
        ),
        ADD_DATA_RESOURCE: (state, {payload: resource}) => {
          let copy = [...state.dataResources.resources];
          copy.unshift(resource);

          return {
            ...state,
            dataResources: {
              ...state.dataResources,
              resources: copy,
            }
          };
        },
        SET_DATA_RESOURCES: (state, {payload: resources}) => {
          return {
            ...state,
            dataResources: {
              ...state.dataResources,
              resources: resources,
            }
          };
        },
        CLEAR_RESOURCES: (state) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            resources: []
          }
        }),
        SET_PAGE_SIZE: (state, {payload: size}) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            pageSize: size
          }
        }),
        SET_CURRENT_PAGE: (state, {payload: currentPage}) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            currentPage: currentPage
          }
        }),
        SET_SORT_FIELD: (state, {payload: sortField}) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            sortField: sortField
          }
        }),
        SET_SORT_DIRECTION: (state, {payload: sortDirection}) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            sortDirection: sortDirection
          }
        }),
        SET_TOTAL: (state, {payload: total}) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            total: total
          }
        }),
        SET_ZONE: (state, {payload: zone}) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            zone: zone
          }
        }),
        TOGGLE_REQUESTING_DATA_RESOURCES: (state) => ({
          ...state,
          dataResources: {
            ...state.dataResources,
            requesting: !state.dataResources.requesting
          }
        })
  },
  defaultState
);
