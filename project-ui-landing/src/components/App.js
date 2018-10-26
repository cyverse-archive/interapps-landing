import React, { Component } from 'react';
import '../css/App.css';
import LandingMain from './LandingMain';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0871AB',
    },
    secondary: {
      main: '#ffa900',
    },
  },
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <LandingMain />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
