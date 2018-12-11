import React, { Component } from "react";
import AppCard from "../src/components/AppCard";

class AppCardTest extends Component {
    render() {
        return (
            <AppCard
                name="App Name"
                creator="Creator Name"
                appLink="http://localhost"
                description="Test description for an app card."
                toolName="Tool Name"
                toolVersion="0.0.1"
            />
        );
    }
}

export default AppCardTest;