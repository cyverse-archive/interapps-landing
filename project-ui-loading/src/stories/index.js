import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import LoadingFeedbackArea from '../components/loadingFeedback';
import StatusUpdatesContainer from '../components/statusUpdates';
import { Provider } from 'react-redux';
import { newStore } from '../store/configure';
import "typeface-roboto";


storiesOf('StatusUpdatesContainer', module)
  .addDecorator(getStory => {
    const store = newStore();

    return (
      <Provider store={store}>
        <div>
          {getStory()}
        </div>
      </Provider>
    );
  })
  .add('default', () => {
    return (
      <StatusUpdatesContainer />
    );
  })

storiesOf('LoadingFeedbackArea', module)
  .addDecorator(getStory => {
    const store = newStore();

    return (
      <Provider store={store}>
        <div>
          {getStory()}
        </div>
      </Provider>
    );
  })
  .add('default', () => {
    return (
      <LoadingFeedbackArea />
    );
  })
