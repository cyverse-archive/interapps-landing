import React, { Component } from 'react';
import {
    fetchAnalyses,
} from '../actions';

class Ticker extends Component {
    state = {
        timer: null
    };

    constructor(props) {
        super(props);
        this.props = props;
    }

    componentDidMount() {
        let timer = setInterval(this.tickCallback(), 100000);
        this.setState({timer});
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tickCallback() {
        return () => {
            this.props.store.dispatch(fetchAnalyses());
        };
    }

    render() {
        return <div className="ticker"></div>;
    }
}

export default Ticker;
