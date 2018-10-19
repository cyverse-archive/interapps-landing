import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Computer from '@material-ui/icons/Computer';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Assessment from '@material-ui/icons/Assessment';
import Description from '@material-ui/icons/Description';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateRange from '@material-ui/icons/DateRange';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Divider from '@material-ui/core/Divider';

const paperMaxWidth = '400px';
const paperMinWidth = '250px';
const paperHeight = '300px';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginLeft: 7,
  },
  actions: {
    display: 'flex',
  },
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
  avatar: {
    backgroundColor: green[500],
  },
  iconCell: {
    marginTop: "-2px",
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

class RunningAnalysisCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClickAppLink = () => {
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
      plannedEndDate
    } = this.props;

    return (
      <div className={classes.card}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="Running analysis" className={classes.avatar}>
                <Assessment />
              </Avatar>
            }
            title={ellipsize(analysisName, 28)}
            subheader={ellipsize(appName, 26)}
          />

          <Divider light />

          <CardContent>
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

          <CardActions className={classes.action} disableActionSpacing>
            <IconButton className={classes.appLink} onClick={this.handleClickAppLink}>
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

RunningAnalysisCard.propTypes = {
  classes:        PropTypes.object.isRequired,
  analysisName:   PropTypes.string.isRequired,
  appName:        PropTypes.string.isRequired,
  owner:          PropTypes.string.isRequired,
  description:    PropTypes.string,
  startDate:      PropTypes.number.isRequired,
  plannedEndDate: PropTypes.number.isRequired,
  analysisLink:   PropTypes.string.isRequired,
};

export default withStyles(
  styles,
  { withTheme: true }
)(RunningAnalysisCard);