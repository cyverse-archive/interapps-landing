import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    loggedIn,
    ShowApps,
    ShowCompleted,
    ShowError,
    ShowFailed,
    ShowRunning,
    StatusCompleted,
    StatusFailed,
    StatusRunning
} from '../actions';

import { withStyles } from '@material-ui/core/styles';

import LandingAppBar from './LandingAppBar';
import LandingResponsiveDrawer from './LandingResponsiveDrawer';
import AnalysisCardGrid from './AnalysisCardGrid';
import AppCardGrid from './AppCardGrid';
import ErrorCard from './ErrorCard';
import queryString from "query-string";

import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
});

class LandingMain extends Component {

  render() {
    const {
      pageToShow,
      analyses,
      apps,
      handleLogin,
      httpCode,
      loading,
    } = this.props;

    const username = queryString.parse(window.location.search);
    handleLogin(username.user);
    console.log("parsed user name is " + username.user);

    let mainContent;

    switch (pageToShow) {
      case ShowRunning:
        mainContent = (
          <AnalysisCardGrid/>
        );
        break;
      case ShowCompleted:
        mainContent = (
          <AnalysisCardGrid/>
        );
        break;
      case ShowFailed:
        mainContent = (
          <AnalysisCardGrid/>
        );
        break;
      case ShowApps:
        mainContent = (
          <AppCardGrid/>
        );
        break;
      case ShowError:
          mainContent = (
              <ErrorCard httpCode={httpCode}/>
          );
          break;
      default:
        console.log('unknown value for pageToShow');
    }

    return (
      <div>
        <LandingAppBar />
        <LandingResponsiveDrawer>
            {loading &&
            <CircularProgress color="primary" style={{position: 'relative', top: 300, left: 200}}/>
            }
          {mainContent}
        </LandingResponsiveDrawer>
      </div>
    )
  }
}

LandingMain.propTypes = {
  classes:  PropTypes.object.isRequired,
  analyses: PropTypes.object.isRequired,
  apps:     PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  pageToShow: state.pageToShow,
  analyses:   state.analyses,
  apps:       state.apps,
  httpCode:   state.httpCode,
  loading:    state.loading,
});


const mapDispatchToProps = dispatch => ({
    handleLogin: (username) => dispatch(loggedIn(username)),
});

const MappedLandingMain = connect(
    mapStateToProps,
    mapDispatchToProps
)(LandingMain);

export default withStyles(
  styles,
  { withTheme: true }
)(MappedLandingMain);
