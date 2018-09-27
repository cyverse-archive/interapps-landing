import { createActions, handleActions } from 'redux-actions';

const defaultState = {
  subdomain: '', // The VICE subdomain we're working with.
  job: '',       // The job UUID from the database.

  // entities contains the objects retrieved from the server stored in a map
  // for easy reference in other objects.
  entities : {

    // updates contains the job status updates returned by the server. An
    // individual status update looks like the following:
    // {
    //   status: '',  one of Running, Completed, Failed, Submitted, Canceled
    //   message: '', the actual message from the job
    //   sentOn: ''   the date the message was sent, as milliseconds since the epoch
    // }
    updates: {},
  }
}

export const { addUpdate, setSubdomain, setJob } = createActions({
  ADD_UPDATE:    (update = {})    => update,
  SET_SUBDOMAIN: (subdomain = '') => subdomain,
  SET_JOB:       (job = '')       => job
});

export const reducer = handleActions(
  {
    ADD_UPDATE: (state, action) => {
      return Object.assign({}, state, {
        entities: Object.assign({}, state.entities, {
          updates: Object.assign({}, state.entities.updates, {
            [Object.keys(state.entities.updates).length + 1]: action.payload
          })
        })
      })
    },
    SET_SUBDOMAIN: (state, action) => {
      return Object.assign({}, state, {
        subdomain: action.payload
      })
    },
    SET_JOB: (state, action) => {
      return Object.assign({}, state, {
        job: action.payload
      })
    }
  },
  defaultState
)
