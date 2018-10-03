import React, { Component } from 'react';
//import Button from '@material-ui/core/Button';

import StatusUpdatesContainer from './statusUpdates';
import Ticker from './ticker';
import logo from '../images/logo.png';
import loadingRocket from '../images/loading.png';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    return (
      <div className="app">
        <header>
          <img src={logo} className="app-logo" alt="logo" />
        </header>

        <h1 className="welcome">Welcome!</h1>

        <img src={loadingRocket} className="loading" alt="Loading rocket for an in-progress job" />

        <div className="analysisMessage">Please wait while we launch your application.</div>

        <div className="loading-dots">
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
        </div>


        <div className="statusUpdates">
          <StatusUpdatesContainer />
        </div>
        <Ticker store={this.props.store} />
      </div>
    );
  }

  handleClick() {
    window.location.reload(true);
  }

  componentDidMount(){
    // Set a title on the page
    document.title = "Sugar and VICE are very nice";
  }
}

export default App;
