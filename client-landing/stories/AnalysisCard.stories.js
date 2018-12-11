import React, { Component } from "react";
import AnalysisCard from "../src/components/AnalysisCard";

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
                  status="Running"
              />
        );
    }
}

export default AnalysisCardTest;