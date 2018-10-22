import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { App } from '../actions';
import AppCard from './AppCard';

class AppCardGrid extends Component {
  render() {
    const {
      classes,
      appIndex,
      appKeys
    } = this.props;

    return (
      <Grid container justify="center" spacing={16}>
        {appKeys.map(key => (
          <Grid item>
            <AppCard
              name={appIndex[key].name}
              toolName={appIndex[key].toolName}
              toolVersion={appIndex[key].toolVersion}
              creator={appIndex[key].creator}
              description={appIndex[key].description}
              link={appIndex[key].link}
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

AppCardGrid.propTypes = {
  classes:  PropTypes.object.isRequired,
  appKeys:  PropTypes.array.isRequired,
  appIndex: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  appIndex: state.apps.index
});

const MappedAppCardGrid = connect(
  mapStateToProps
)(AppCardGrid);

export default MappedAppCardGrid;
