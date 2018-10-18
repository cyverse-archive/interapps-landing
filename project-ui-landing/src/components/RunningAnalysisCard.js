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
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateRange from '@material-ui/icons/DateRange';
import ArrowDownward from '@material-ui/icons/ArrowDownward';

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
    alert("link clicked");
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

          <CardContent>
            <Grid container className={classes.root} spacing={12}>
              <Grid item xs={1}>
                <AccountCircle className={classes.iconCell}/>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={10}>
                <Typography noWrap>{owner}</Typography>
              </Grid>

              <Grid item xs={2}>
                <DateRange className={classes.iconCell} />
              </Grid>
              <Grid item xs={10}>
                <Typography noWrap>{startDate}</Typography>
              </Grid>
              <Grid item xs={5} />
              <Grid item xs={7}>
                <ArrowDownward />
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={10}>
                <Typography noWrap>{plannedEndDate}</Typography>
              </Grid>
            </Grid>
          </CardContent>

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
              <Typography>
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
