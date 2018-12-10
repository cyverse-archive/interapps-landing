import React, { Component } from "react";
import { newStore } from "../src/store/configure";
import { addAnalysis, Analysis } from "../src/actions";
import AnalysisCardGrid from "../src/components/AnalysisCardGrid";


class AnalysisCardGridTest extends Component {
    render() {
        const store = newStore();
        
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
            status: "Running",
        })).forEach(a => store.dispatch(addAnalysis(a)));

        return (
            <AnalysisCardGrid analysisKeys={[...Array(3).keys()]} store={store}/>
        )
    }
}
export default AnalysisCardGridTest;