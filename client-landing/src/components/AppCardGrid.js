import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import AppCard from './AppCard';


const styles = theme => ({
  grid: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 1,
  },
});

class AppCardGrid extends Component {
  render() {
    const {
      classes,
      appIndex,
      apps
    } = this.props;

    return (
      <Grid container className={classes.grid} justify="center" spacing={16}>
        {apps.map(app => (
          <Grid item>
            <AppCard
                uuid={app.uuid}
                name={app.name}
                toolName={app.toolName}
                toolVersion={app.toolVersion}
                creator={app.creator}
                description={app.description}
                link={app.link}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

AppCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  apps:  PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  apps: state.apps
});

const MappedAppCardGrid = connect(
  mapStateToProps
)(AppCardGrid);


export default withStyles(
  styles,
  { withTheme: true }
)(MappedAppCardGrid);
