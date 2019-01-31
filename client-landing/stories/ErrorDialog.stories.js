import React from "react";
import { setErrorDialogOpen, addError } from '../src/actions';
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
  })
  .add('with 1 error', () => {
    const store = newStore();
    store.dispatch(setErrorDialogOpen(true));
    store.dispatch(addError({
      message: "test error",
      status: 500,
      dateCreated: Date.now(),
    }));
    return (
      <ErrorDialog store={store} />
    );
  })
  .add('with 3 errors', () => {
    const store = newStore();
    store.dispatch(setErrorDialogOpen(true));
    store.dispatch(addError({
      message: "test error 1",
      status: 500,
      dateCreated: Date.now(),
    }));
    store.dispatch(addError({
      message: "test error 2",
      status: 500,
      dateCreated: Date.now(),
    }));
    store.dispatch(addError({
      message: "test error 3",
      status: 500,
      dateCreated: Date.now(),
    }));
    return (
      <ErrorDialog store={store} />
    );
  });
