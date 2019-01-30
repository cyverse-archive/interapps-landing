import React from "react";
import { setErrorDialogOpen } from '../src/actions';
import { newStore } from '../src/store/configure';
import { storiesOf } from "@storybook/react";
import ErrorDialog from '../src/components/ErrorDialog';

storiesOf('errors/ErrorDialog', module)
  .add('open dialog', () => {
    const store = newStore();
    store.dispatch(setErrorDialogOpen(true));
    return (
      <ErrorDialog store={store} />
    );
  });
