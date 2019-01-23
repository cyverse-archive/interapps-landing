import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import LandingMain from "../src/components/LandingMain";
import { addAnalyses, addApp, Analysis, App } from "../src/actions";
import { Provider } from "react-redux";

class LandingMainTest extends Component {
    render() {
        const store = newStore();
        let start = Date.now();
        let end = start + (86400000 * 2);
        let startDate = new Date(start);
        let endDate = new Date(end);
        let nums = [...Array(30).keys()];

        let running = nums.map(n => new Analysis({
            id: `${n}`,
            job_name: `test-analysis-name-${n}`,
            app_name: `test-app-name=${n}`,
            job_description: `this is a test of the running analysis card grid ${n}`,
            username: `test-owner-name ${n}`,
            start_date: startDate.toLocaleString(),
            end_date: endDate.toLocaleString(),
            subdomain: "http://localhost",
            status: "Running",
        }));


        let failed = nums.map(n => new Analysis({
                id: `${30 + n}`,
                job_name: `test-analysis-name-${30 + n}`,
                app_name: `test-app-name=${30 + n}`,
                job_description: `this is a test of the running analysis card grid ${30 + n}`,
                username: `test-owner-name ${30 + n}`,
                start_date: startDate.toLocaleString(),
                end_date: endDate.toLocaleString(),
                subdomain: "http://localhost",
                status: "Failed",
            }))
        ;

        let completed = nums.map(n => new Analysis({
            id: `${60 + n}`,
            job_name: `test-analysis-name-${60 + n}`,
            app_name: `test-app-name=${30 + n}`,
            job_description: `this is a test of the running analysis card grid ${60 + n}`,
            username: `test-owner-name ${60 + n}`,
            start_date: startDate.toLocaleString(),
            end_date: endDate.toLocaleString(),
            subdomain: "http://localhost",
            status: "Failed",
        }));

     //   [...running, ...failed, ...completed].forEach(a => store.dispatch(addAnalysis(a)));
        store.dispatch(addAnalyses([...running, ...failed, ...completed]));

        let appnums = new Array(30);
        let apps = appnums.map(n => new App(
            `${n}`,
            `test-app-name-${n}`,
            `test-tool-name=${n}`,
            `0.0.${n}`,
            `this is a test of the app card grid ${n}`,
            `test-creator-name ${n}`,
            "http://localhost"
          )).forEach(a => store.dispatch(addApp(a)));
        return (
            <Provider store={store}>
                <LandingMain/>
            </Provider>
        );
    }
}

export default LandingMainTest;
