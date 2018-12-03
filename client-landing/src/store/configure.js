import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { reducer } from '../actions';
import { createStore, applyMiddleware } from 'redux';

const loggerMiddleware = createLogger();

export const newStore = () => createStore(
  reducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
)

const store = newStore();
export default store;
