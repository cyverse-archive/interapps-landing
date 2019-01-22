import React, { Component } from "react";
import AppsCard from "../src/components/AppsCard";

class AppCardTest extends Component {
    render() {
        return (
            <AppsCard
                uuid="1"
                name="App Name App NameApp NameApp NameApp NameApp NameApp Name"
                creator="Creator Name"
                appLink="http://localhost"
                description="Test description for an app card."
                toolName="Tool Name"
                toolVersion="0.0.1"
                type="DE"
                rating={{"average": 3.5, "total": 3}}
                link="https://qa.cyverse.org/de/?type=apps&app-id=676846d4-854a-11e4-980d-7f0fcca75dbb&system-id=de"
           />
        );
    }
}

export default AppCardTest;