import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { StatusRunning, StatusFailed, StatusCompleted } from '../actions';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Assessment from '@material-ui/icons/Assessment';
import Description from '@material-ui/icons/Description';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  card: {
    width: 300,
  },
  runningAnalysisAvatar: {
    backgroundColor: green[500],
  },
  completedAnalysisAvatar: {
    backgroundColor: blue[500],
  },
  failedAnalysisAvatar: {
    backgroundColor: red[500],
  },
  field: {
    marginBottom: "1em",
  },
  descField: {
    width: "100%",
  },
});

const ellipsize = (s, limit) => {
  if ([...s].length > limit) {
    return [...s].slice(0, limit-4).join('') + '...';
  }
  return s;
}

class AnalysisCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClickAnalysisLink = () => {
    window.open(this.props.analysisLink);
  };

  render() {
    const {
      classes,
      appName,
      analysisName,
      analysisLink,
      owner,
      description,
      startDate,
      plannedEndDate,
      status
    } = this.props;


    let avatarClass;

    switch (status) {
      case StatusRunning:
        avatarClass = classes.runningAnalysisAvatar;
        break;
      case StatusCompleted:
        avatarClass = classes.completedAnalysisAvatar;
        break;
      default:
        avatarClass = classes.failedAnalysisAvatar;
    }

    return (
      <div className={classes.card}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="Running analysis" className={avatarClass}>
                <Assessment />
              </Avatar>
            }
            title={ellipsize(analysisName, 28)}
            subheader={ellipsize(appName, 26)}
          />

          <Divider light />

          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Status
            </Typography>
            <Typography className={classes.field} gutterBottom>
              {status}
            </Typography>

            <Typography color="textSecondary" gutterBottom>
              Submitted By
            </Typography>
            <Typography className={classes.field} gutterBottom>
              {owner}
            </Typography>

            <Typography color="textSecondary" gutterBottom>
              Launch Date
            </Typography>
            <Typography className={classes.field} gutterBottom noWrap>
              {startDate}
            </Typography>

            <Typography color="textSecondary" gutterBottom>
              Scheduled End Date
            </Typography>
            <Typography className={classes.field} gutterBottom noWrap>
              {plannedEndDate}
            </Typography>
          </CardContent>

          <Divider light />

          <CardActions disableActionSpacing>
            <IconButton onClick={this.handleClickAnalysisLink}>
              <OpenInBrowser />
            </IconButton>

            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>

          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Description
              </Typography>
              <Typography className={classes.descField}>
                {description}
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    );
  }
}

AnalysisCard.propTypes = {
  classes:        PropTypes.object.isRequired,
  analysisName:   PropTypes.string.isRequired,
  appName:        PropTypes.string.isRequired,
  owner:          PropTypes.string.isRequired,
  description:    PropTypes.string,
  startDate:      PropTypes.number.isRequired,
  plannedEndDate: PropTypes.number.isRequired,
  analysisLink:   PropTypes.string.isRequired,
  status:         PropTypes.string.isRequired,
};

export default withStyles(
  styles,
  { withTheme: true }
)(AnalysisCard);
