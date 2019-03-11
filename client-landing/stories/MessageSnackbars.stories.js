import React from "react";
import MessageSnackbars from "../src/components/MessageSnackbars";
import { newStore } from '../src/store/configure';
import { storiesOf } from "@storybook/react";
import { pushMessage } from '../src/actions';

storiesOf('snackbars/MessageSnackbars', module)
  .add('no message', () => {
    const store = newStore();
    return (
      <MessageSnackbars store={store} />
    );
  })
  .add('one message', () => {
    const store = newStore();
    store.dispatch(pushMessage("Test Message One"));
    return (
      <MessageSnackbars store={store} />
    );
  })
  .add('two messages', () => {
    const store = newStore();
    store.dispatch(pushMessage("Test Message One"));
    store.dispatch(pushMessage("Test Message Two"));
    return (
      <MessageSnackbars store={store} />
    );
  });
