import React, { Component } from 'react';

import LoadingFeedbackArea from './loadingFeedback';
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

        <LoadingFeedbackArea />

        <Ticker store={this.props.store} />
      </div>
    );
  }

  handleClick() {
    window.location.reload(true);
  }

  componentDidMount(){
    // Set a title on the page
    document.title = "CyVerse VICE Apps";
  }
}

export default App;
