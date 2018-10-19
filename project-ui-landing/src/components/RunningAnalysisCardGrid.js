import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Analysis } from '../actions';
import RunningAnalysisCard from './RunningAnalysisCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class RunningAnalysisCardGrid extends Component {
  render() {
    const { classes, analyses } = this.props;

    return (
      <Grid container justify="center" spacing={16}>
        {analyses.map(value => (
          <Grid item>
            <RunningAnalysisCard
              appName={value.appName}
              analysisName={value.name}
              description={value.description}
              analysisLink={value.link}
              owner={value.owner}
              startDate={value.startDate}
              plannedEndDate={value.plannedEndDate}
              status={value.status}
            />
          </Grid>
        ))}
      </Grid>
    );
  };
}

RunningAnalysisCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  analyses: PropTypes.arrayOf(Analysis).isRequired,
};

export default withStyles(styles)(RunningAnalysisCardGrid);
