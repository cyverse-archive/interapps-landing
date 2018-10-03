import React, { Component } from 'react';
import { checkURLReady, fetchUpdates } from '../actions';

// Adapted from https://medium.com/@machadogj/timers-in-react-with-redux-apps-9a5a722162e8

export default class Ticker extends Component {
  state = {
    timer: null
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  componentDidMount() {
    let timer = setInterval(this.tickCallback(), 10000);
    this.setState({timer});
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  tickCallback() {
    return () => {
      this.props.store.dispatch(checkURLReady());
      this.props.store.dispatch(fetchUpdates());
    }
  }

  render() {
    return <div className="ticker"></div>
  }

}
