import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Analysis } from '../actions';
import AnalysisCard from './AnalysisCard';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class AnalysisCardGrid extends Component {
  render() {
    const { classes, analyses } = this.props;

    return (
      <Grid container justify="center" spacing={16}>
        {analyses.map(value => (
          <Grid item>
            <AnalysisCard
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

AnalysisCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  analyses: PropTypes.arrayOf(Analysis).isRequired,
};

export default withStyles(styles)(AnalysisCardGrid);
