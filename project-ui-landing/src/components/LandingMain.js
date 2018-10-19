import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Analysis,
  toggleMobileOpen,
  setPageToShow,
  ShowRunning,
  ShowCompleted,
  ShowFailed,
  ShowApps
} from '../actions';

import { withStyles } from '@material-ui/core/styles';

import LandingAppBar from './LandingAppBar';
import LandingResponsiveDrawer from './LandingResponsiveDrawer';
import AnalysisCardGrid from './AnalysisCardGrid';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  // appBar: {
  //   zIndex: theme.zIndex.drawer + 1,
  // },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0, // So the Typography noWrap works
  },
  //toolbar: theme.mixins.toolbar,
})

class LandingMain extends Component {
  render() {
    const {
      pageToShow,
      classes,
      runningAnalyses,
      finishedAnalyses,
      appsList
    } = this.props;

    let mainContent;

    switch (pageToShow) {
      case ShowRunning:
        mainContent = (
          <AnalysisCardGrid analyses={runningAnalyses} />
        );
        break;
      case ShowCompleted:
        break;
      case ShowFailed:
        break;
      case ShowApps:
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
  classes:          PropTypes.object.isRequired,
  runningAnalyses:  PropTypes.arrayOf(Analysis).isRequired,
  finishedAnalyses: PropTypes.arrayOf(Analysis).isRequired,
  appsList:         PropTypes.arrayOf(Analysis).isRequired,
};

const mapStateToProps = state => ({
  pageToShow: state.pageToShow,
});

const MappedLandingMain = connect(
  mapStateToProps
)(LandingMain);

export default withStyles(
  styles,
  { withTheme: true }
)(MappedLandingMain);
