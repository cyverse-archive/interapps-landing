import React, { Component } from "react";
import AnalysisCard from "../src/components/AnalysisCard";
import { StatusCompleted } from "../src/actions";

class AnalysisCardTest extends Component {
    render() {
        let start = Date.now();
        let end = start + (86400000 * 2);
        let startDate = new Date(start);
        let endDate = new Date(end);
        return (
              <AnalysisCard
                  appName="App Name"
                  analysisName="Analysis Name Analysis Name Analysis Name Analysis Name"
                  description="This is a test description of a running analysis."
                  analysisLink="http://localhost"
                  startDate={startDate.toLocaleString()}
                  plannedEndDate={endDate.toLocaleString()}
                  owner="Owner Name"
                  status={StatusCompleted}
                  analysisLink="https://qa.cyverse.org/de/?type=data&folder=/iplant/home/sriram/analyses"
                  timeLimitCB={()=>{}}
              />
        );
    }
}

export default AnalysisCardTest;
