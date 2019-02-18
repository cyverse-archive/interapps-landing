import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { storiesOf } from "@storybook/react";
import { setDataResources, setCurrentDirectory } from '../src/actions';

import DataBrowser from '../src/components/DataBrowser';

storiesOf('DataBrowser', module)
  .add('basic test', () => {
    const store = newStore();
    store.dispatch(setCurrentDirectory("/iplant/home"))
    return (
      <DataBrowser store={store} />
    );
  })
  .add('one dir', () => {
    const store = newStore();
    store.dispatch(setCurrentDirectory("/iplant/home/ipcdev/analyses"));
    store.dispatch(setDataResources([{
      "infoType": null,
      "path": "/iplant/home/ipcdev/analyses/DE_Word_Count_analysis1-2015-07-14-19-46-37.7",
      "permission": "own",
      "name": "DE_Word_Count_analysis1-2015-07-14-19-46-37.7",
      "type" : "folder",
      "size": 0,
      "badName": false,
      "dateModified": 1436903247000,
      "id": "27bf3012-2a61-11e5-803b-3c4a92e4a804",
      "dateCreated": 1436903247000
    }]));
    return (
      <DataBrowser store={store} />
    );
  })
  .add('100 dirs', () => {
    const store = newStore();
    store.dispatch(setCurrentDirectory("/iplant/home/ipcdev/analyses/test/more/dirs/omg/this/is/too/many/do/not/add/more/one/two/three/four/five/six/seven/eight/nine/ten/eleven"));
    let items = [...Array(100).keys()].map(
      i => (
        {
          "infoType": null,
          "path": `/iplant/home/ipcdev/analyses/test-${i}`,
          "permission": "own",
          "name": `test-${i}`,
          "type" : "file",
          "size": 0,
          "badName": false,
          "dateModified": Date.now(),
          "id": `test-${i}`,
          "dateCreated": Date.now(),
        }
      )
    );
    store.dispatch(setDataResources(items));
    return (
      <DataBrowser store={store} />
    );
  });
