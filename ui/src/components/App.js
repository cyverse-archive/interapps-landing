import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

import logo from '../images/logo.png';
import spinner from '../images/loading_spinner.gif';
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

        <img src={spinner} className="spinner" alt="Loading spinner for a job still running" />

        <div class="refresh">
          <Button variant="contained" color="primary" onClick={this.handleClick} style={{justifyContent: 'center'}} fullWidth="true">
            Refresh
          </Button>
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
