import React, { Component } from "react";
import NavList from "../src/components/NavList";
import { newStore } from "../src/store/configure";

class NavListTest extends Component {
    render() {
        const store = newStore();
        return (
            <NavList store={store}/>
        );
    }
}

export default NavListTest;