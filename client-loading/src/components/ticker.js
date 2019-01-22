import React, { Component } from 'react';
import { checkURLReady } from '../actions';
import { connect } from 'react-redux';

// Adapted from https://medium.com/@machadogj/timers-in-react-with-redux-apps-9a5a722162e8

class TickerElement extends Component {
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
    clearInterval(this.state.timer);
  }

  tickCallback() {
    return () => {
      this.props.store.dispatch(checkURLReady());
    }
  }

  render() {
    if (this.props.isReady) {
      clearInterval(this.state.timer);
    }
    return <div className="ticker"></div>;
  }
}

const mapStateToProps = state => ({
  isReady: state.ready
});

const Ticker = connect(
  mapStateToProps
)(TickerElement);

export default Ticker;
