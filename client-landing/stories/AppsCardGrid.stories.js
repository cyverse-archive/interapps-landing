import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { addApps, App, loggedIn } from "../src/actions";
import AppsCardGrid from "../src/components/AppsCardGrid";

class AppCardGridTest extends Component {
    render() {
        const store = newStore();
        const host = "https://localhost";
        let nums = [...Array(3).keys()];
        let apps = nums.map(n => new App({
            id: `${n}`,
            name: `test-app-name-${n}`,
            description: `Test app description ${n}`,
            creator: `test-creator-${n}`,
            app_type:'DE',
            rating:{"average": 3.5, "total": 3}
        }));
        store.dispatch(addApps(apps));
        store.dispatch(loggedIn({"de_host": host}));
        return (
            <AppsCardGrid apps={apps} store={store} deHost={host}/>
        );
    }
}

export default AppCardGridTest;