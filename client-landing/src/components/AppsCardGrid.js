import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import AppCard from './AppsCard';
import Typography from "@material-ui/core/es/Typography/Typography";


const styles = theme => ({
  grid: {
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 1,
  },
});

class AppsCardGrid extends Component {
  render() {
    const {
      classes,
      apps,
      deHost
    } = this.props;
      if (!apps || apps.length === 0) {
          return (<Typography variant="body2" color="primary"
                              style={{position: 'absolute', top: '50%', left: '50%'}}>
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
                              isPublic={app.isPublic}
                              isBeta={app.isBeta}
                              isDisabled={app.isDisabled}
                          />
                      </Grid>
                  ))}
              </Grid>
          );
      }
  }
}

AppsCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  apps:  PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  apps: state.apps,
  deHost: state.deHost,
});

const MappedAppCardGrid = connect(
  mapStateToProps
)(AppsCardGrid);


export default withStyles(
  styles,
  { withTheme: true }
)(MappedAppCardGrid);
