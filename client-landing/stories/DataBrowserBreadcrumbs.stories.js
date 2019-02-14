import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { storiesOf } from "@storybook/react";
import { setCurrentDirectory } from '../src/actions';

import DataBrowserBreadcrumbs from '../src/components/DataBrowserBreadcrumbs';

storiesOf('DataBrowserBreadcrumbs', module)
  .add('basic test', () => {
    return (
      <DataBrowserBreadcrumbs currentDirectory={"/foo/bar/baz"} />
    );
  })
  .add('longer path', () => {
    return (
      <DataBrowserBreadcrumbs currentDirectory={"/foo/bar/baz/blippy/one/two/three/four/five/six/seven/eight/nine/ten/eleven"} />
    );
  });
