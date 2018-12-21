import React, { Component } from 'react';
import '../css/App.css';
import LandingMain from './LandingMain';
import Ticker from './Ticker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const palette = {
  orange:      '#f19e1f', // 241, 158, 31
  lightGreen:  '#97af3c', // 151, 175, 60
  darkGreen:   '#5c8727', // 92, 135, 39
  lightGray:   '#e2e2e2', // 226, 226, 226
  gray:        '#a5a4a4', // 165, 164, 164
  darkGray:    '#525a68', // 82, 90, 104
  lightBlue:   '#99d9ea', // 153, 217, 234
  blue:        '#0971ab', // 9, 113, 171
  darkBlue:    '#004471', // 0, 68, 113
  darkestBlue: '#142248', // 20, 34, 72
  white:       '#ffffff',
  red:         '#e60424', //'#8a3324',
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: palette.blue,
    },
    secondary: {
      main: palette.lightBlue,
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
