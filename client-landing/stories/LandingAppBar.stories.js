import React, { Component } from "react";
import LandingAppBar from "../src/components/LandingAppBar";
import { newStore } from "../src/store/configure";

class LandingAppBarTest extends Component {
    render() {
        const store = newStore();
        return(
            <LandingAppBar store={store}/>
        ) ;
    }
}
export default LandingAppBarTest;