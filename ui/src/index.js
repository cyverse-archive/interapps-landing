import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { setSubdomain, setJob, addUpdate, reducer } from './actions';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

console.log(store.getState())

const unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)

store.dispatch(setSubdomain('test-subdomain'))
store.dispatch(setJob('test-job-uuid'))
store.dispatch(addUpdate({id: "test", status: "Running", message: "test-message", sentOn: 4}))
store.dispatch(addUpdate({id: "test0", status: "Running", message: "test-message2", sentOn: 3}))
store.dispatch(addUpdate({id: "test1", status: "Running", message: "test-message3", sentOn: 2}))
store.dispatch(addUpdate({id: "test2", status: "Running", message: "test-message4", sentOn: 1}))

unsubscribe()

registerServiceWorker();
