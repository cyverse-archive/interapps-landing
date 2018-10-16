import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Computer from '@material-ui/icons/Computer';
import Assessment from '@material-ui/icons/Assessment';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

// Adapted from examples at https://material-ui.com/demos/lists/#nested-list

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 6,
  },
});

class AnalysesList extends Component {
  state = {
    open: true,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { classes } = this.props;
    const { handleClickRunning, handleClickFinished, handleClickApps } = this.props;

    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem button onClick={this.handleClick}>
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText inset primary="Analyses" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={handleClickRunning}>
                <ListItemText inset primary="Running" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={handleClickFinished}>
                <ListItemText inset primary="Finished" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleClickApps}>
            <ListItemIcon>
              <Computer />
            </ListItemIcon>
            <ListItemText inset primary="Apps" />
          </ListItem>
        </List>

      </div>
    );
  };
}

AnalysesList.propTypes = {
  classes:             PropTypes.object.isRequired,
  handleClickRunning:  PropTypes.func,
  handleClickFinished: PropTypes.func,
  handleClickApps:     PropTypes.func,
};

export default withStyles(styles)(AnalysesList);
