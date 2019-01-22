import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { addAnalyses, Analysis, loggedIn, StatusCompleted } from "../src/actions";
import AnalysisCardGrid from "../src/components/AnalysisCardGrid";
import AppCardGrid from "./AppsCardGrid.stories";


class AnalysisCardGridTest extends Component {
    render() {
        const store = newStore();
        const host = "https://qa.cyverse.org";
        let start = Date.now();
        let end = start + (86400000 * 2);
        let startDate = new Date(start);
        let endDate = new Date(end);
        let nums = [...Array(3).keys()];
        let analyses = nums.map(n => new Analysis({
            id: `${n}`,
            job_name: `test-analysis-name-${n}`,
            app_name: `test-app-name=${n}`,
            job_description: `this is a test of the running analysis card grid ${n}`,
            username: `test-owner-name ${n}`,
            start_date: startDate.toLocaleString(),
            end_date: endDate.toLocaleString(),
            subdomain: "http://localhost",
            status: StatusCompleted,
            result_folder_path: "/iplant/home/sriram",
        }));
        store.dispatch(addAnalyses(analyses));
        store.dispatch(loggedIn({"de_host": host}));
        return (
            <AnalysisCardGrid analyses={analyses} store={store}  deHost={host}/>
        )
    }
}
export default AnalysisCardGridTest;