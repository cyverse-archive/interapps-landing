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

    console.log(analyses);
    return (
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
              {analyses.map(value => (
                <Grid key={value.uuid} item>
                  <RunningAnalysisCard
                    appName={value.appName}
                    analysisName={value.name}
                    description={value.description}
                    analysisLink={value.link}
                    owner={value.owner}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
    );
  };
}

RunningAnalysisCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  analyses: PropTypes.arrayOf(Analysis).isRequired,
};

export default withStyles(styles)(RunningAnalysisCardGrid);
