import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LandingAppBar from './LandingAppBar';
import LandingResponsiveDrawer from './LandingResponsiveDrawer';
import RunningAnalysisCardGrid from './RunningAnalysisCardGrid';
import { Analysis } from '../actions';

const ShowRunning = 0;
const ShowFinished = 1;
const ShowApps = 2;

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
  state = {
    pageToShow: 0,
  };

  // need to close over 'this', otherwise it gets re-bound farther down the stack.
  handleClickApps = () => ( () => this.setState({pageToShow: ShowApps}) );

  handleClickRunning = () => ( () => this.setState({pageToShow: ShowRunning}) );

  handleClickFinished = () => ( () => this.setState({pageToShow: ShowFinished}) );

  render() {
    const { classes, runningAnalyses, finishedAnalyses, appsList } = this.props;

    let mainContent;

    switch (this.state.pageToShow) {
      case ShowRunning:
        mainContent = (
          <RunningAnalysisCardGrid analyses={runningAnalyses} />
        );
        break;
      case ShowFinished:
        break;
      case ShowApps:
        break;
      default:
        console.log('unknown value for pageToShow');
    }

    return (
      <div>
        <LandingAppBar />
        <LandingResponsiveDrawer
          handleClickFinished={this.handleClickFinished()}
          handleClickRunning={this.handleClickRunning()}
          handleClickApps={this.handleClickApps()}
        >
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

export default withStyles(styles, { withTheme: true })(LandingMain);
