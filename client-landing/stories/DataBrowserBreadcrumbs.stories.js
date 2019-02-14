import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { storiesOf } from "@storybook/react";
import { setCurrentDirectory } from '../src/actions';

import DataBrowserBreadcrumbs from '../src/components/DataBrowserBreadcrumbs';

storiesOf('DataBrowserBreadcrumbs', module)
  .add('basic test', () => {
    const store = newStore();
    store.dispatch(setCurrentDirectory("/foo/bar/baz"));

    return (
      <DataBrowserBreadcrumbs store={store} />
    );
  });
