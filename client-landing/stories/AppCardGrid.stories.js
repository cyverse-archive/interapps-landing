import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { addApps, App } from "../src/actions";
import AppCardGrid from "../src/components/AppCardGrid";

class AppCardGridTest extends Component {
    render() {
        const store = newStore();
        let nums = [...Array(3).keys()];
        let apps = nums.map(n => new App({
            id: `${n}`,
            name: `test-app-name-${n}`,
            description: `Test app description ${n}`,
            creator: `test-creator-${n}`,
        }));
        store.dispatch(addApps(apps));

        return (
            <AppCardGrid apps={apps} store={store}/>
        );
    }
}

export default AppCardGridTest;