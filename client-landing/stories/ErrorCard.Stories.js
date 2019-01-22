import React, { Component } from "react";
import ErrorCard from "../src/components/ErrorCard";


class ErrorCardTest extends Component {
    render() {
        return <ErrorCard httpCode="500"/>
    }
}

export default ErrorCardTest;