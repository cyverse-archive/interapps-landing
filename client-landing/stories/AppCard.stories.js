import React, { Component } from "react";
import AppCard from "../src/components/AppCard";

class AppCardTest extends Component {
    render() {
        return (
            <AppCard
                uuid="1"
                name="App Name App NameApp NameApp NameApp NameApp NameApp Name"
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