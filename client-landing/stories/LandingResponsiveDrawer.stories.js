import React, { Component } from "react";
import LandingResponsiveDrawer from "../src/components/LandingResponsiveDrawer";
import { newStore } from "../src/store/configure";
import Provider from "react-redux/es/components/Provider";

class LandingResponsiveDrawerTest extends Component {
    render() {
        const store = newStore();
        return (
            <Provider store={store}>
                <LandingResponsiveDrawer/>
            </Provider>
        );
    }
}

export default LandingResponsiveDrawerTest;