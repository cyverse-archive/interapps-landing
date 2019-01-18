import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import AppCard from './AppCard';
import Typography from "@material-ui/core/es/Typography/Typography";


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
      apps,
      deHost
    } = this.props;
      if (!apps || apps.length === 0) {
          return (<Typography variant="body2" color="primary"
                              style={{position: 'relative', top: 300, left: 200}}>
              No apps to display!
          </Typography>);
      } else {
          return (
              <Grid container className={classes.grid} justify="center" spacing={16}>
                  {apps.map(app => (
                      <Grid item>
                          <AppCard
                              uuid={app.uuid}
                              name={app.name}
                              toolVersion={app.toolVersion}
                              creator={app.creator}
                              description={app.description}
                              rating={app.rating}
                              type={app.type}
                              link={deHost + "/de?type=apps&system=de&app-id=" + app.uuid}
                          />
                      </Grid>
                  ))}
              </Grid>
          );
      }
  }
}

AppCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  apps:  PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  apps: state.apps,
  deHost: state.deHost,
});

const MappedAppCardGrid = connect(
  mapStateToProps
)(AppCardGrid);


export default withStyles(
  styles,
  { withTheme: true }
)(MappedAppCardGrid);
