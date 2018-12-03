import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { newStore } from '../store/configure';

// modified version of code from https://medium.com/ingenious/storybook-meets-redux-6ab09a5be346

const store = newStore();

export default function Provider({ story }) {
  return (
    <ReduxProvider store={store}>
      {story}
    </ReduxProvider>
  );
};
