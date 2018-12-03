import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ShowRunning,
  ShowCompleted,
  ShowFailed,
  ShowApps,
  StatusRunning,
  StatusFailed,
  StatusCompleted
} from '../actions';

import { withStyles } from '@material-ui/core/styles';

import LandingAppBar from './LandingAppBar';
import LandingResponsiveDrawer from './LandingResponsiveDrawer';
import AnalysisCardGrid from './AnalysisCardGrid';
import AppCardGrid from './AppCardGrid';

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
})

class LandingMain extends Component {
  render() {
    const {
      pageToShow,
      analyses,
      apps
    } = this.props;

    let mainContent;

    switch (pageToShow) {
      case ShowRunning:
        mainContent = (
          <AnalysisCardGrid analysisKeys={analyses[StatusRunning]} />
        );
        break;
      case ShowCompleted:
        mainContent = (
          <AnalysisCardGrid analysisKeys={analyses[StatusCompleted]} />
        )
        break;
      case ShowFailed:
        mainContent = (
          <AnalysisCardGrid analysisKeys={analyses[StatusFailed]} />
        );
        break;
      case ShowApps:
        mainContent = (
          <AppCardGrid appKeys={Object.keys(apps.index)} />
        );
        break;
      default:
        console.log('unknown value for pageToShow');
    }

    return (
      <div>
        <LandingAppBar />
        <LandingResponsiveDrawer>
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
});

const MappedLandingMain = connect(
  mapStateToProps
)(LandingMain);

export default withStyles(
  styles,
  { withTheme: true }
)(MappedLandingMain);
