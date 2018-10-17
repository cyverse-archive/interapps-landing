import React from 'react';
import { render } from 'react-dom';
import './css/index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';

import { Provider } from 'react-redux';
import store from './store/configure';

render(
  <Provider store={store}>
    <App store={store} />
  </Provider>,
  document.getElementById('root')2
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
