import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { addApp, App } from "../src/actions";
import AppCardGrid from "../src/components/AppCardGrid";

class AppCardGridTest extends Component {
    render() {
        const store = newStore();
        let nums = [...Array(3).keys()];
        let analyses = nums.map(n => new App(
            `${n}`,
            `test-app-name-${n}`,
            `test-tool-name=${n}`,
            `0.0.${n}`,
            `this is a test of the app card grid ${n}`,
            `test-creator-name ${n}`,
            "http://localhost"
        )).forEach(a => store.dispatch(addApp(a)));

        return (
            <AppCardGrid appKeys={[...Array(3).keys()]} store={store}/>
        );
    }
}

export default AppCardGridTest;