import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

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

        <h1 class="welcome">Welcome!</h1>

        <img src={loadingRocket} className="loading" alt="Loading rocket for an in-progress job" />

        <div class="analysisMessage">Please wait while we prepare to launch your Analysis.</div>

        <div class="loading-dots">
          <div class="loading-dots--dot"></div>
          <div class="loading-dots--dot"></div>
          <div class="loading-dots--dot"></div>
        </div>

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
