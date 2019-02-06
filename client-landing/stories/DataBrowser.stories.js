import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { storiesOf } from "@storybook/react";
import { addDataResource, setCurrentDirectory } from '../src/actions';

import DataBrowser from '../src/components/DataBrowser';

storiesOf('DataBrowser', module)
  .add('basic test', () => {
    const store = newStore();
    return (
      <DataBrowser store={store} />
    );
  })
  .add('one dir', () => {
    const store = newStore();
    store.dispatch(setCurrentDirectory("/iplant/home/ipcdev/analyses"));
    store.dispatch(addDataResource({
      "infoType": null,
      "path": "/iplant/home/ipcdev/analyses/DE_Word_Count_analysis1-2015-07-14-19-46-37.7",
      "permission": "own",
      "name": "DE_Word_Count_analysis1-2015-07-14-19-46-37.7",
      "size": 0,
      "badName": false,
      "dateModified": 1436903247000,
      "id": "27bf3012-2a61-11e5-803b-3c4a92e4a804",
      "dateCreated": 1436903247000
    }));
    return (
      <DataBrowser store={store} />
    );
  })
  .add('100 dirs', () => {
    const store = newStore();
    store.dispatch(setCurrentDirectory("/iplant/home/ipcdev/analyses"));
    [...Array(100).keys()].forEach((i) => store.dispatch(addDataResource({
        "infoType": null,
        "path": `/iplant/home/ipcdev/analyses/test-${i}`,
        "permission": "own",
        "name": `test-${i}`,
        "size": 0,
        "badName": false,
        "dateModified": Date.now(),
        "id": "27bf3012-2a61-11e5-803b-3c4a92e4a804",
        "dateCreated": Date.now(),
      }))
    );
    return (
      <DataBrowser store={store} />
    );
  });
