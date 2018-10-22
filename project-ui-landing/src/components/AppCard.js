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
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Computer from '@material-ui/icons/Computer';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import orange from '@material-ui/core/colors/orange';

const ellipsize = (s, limit) => {
  if ([...s].length > limit) {
    return [...s].slice(0, limit-4).join('') + '...';
  }
  return s;
}

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
  appAvatar: {
    backgroundColor: orange[500],
  },
  field: {
    marginBottom: "1em",
  },
  descField: {
    width: "100%",
  },
});

class AppCard extends Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleClickAppLink = () => {
    window.open(this.props.link);
  };

  render() {
    const {
      classes,
      name,
      link,
      creator,
      description,
      toolName,
      toolVersion
    } = this.props;

    let subheader = `${toolName}, ${toolVersion}`;

    return (
      <div className={classes.card}>
        <Card>
          <CardHeader
            avatar={
              <Avatar aria-label="App" className={classes.appAvatar}>
                <Computer />
              </Avatar>
            }
            title={ellipsize(name, 28)}
            subheader={ellipsize(subheader)}
          />

          <Divider light />

          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Creator
            </Typography>
            <Typography className={classes.field} gutterBottom>
              {creator}
            </Typography>
          </CardContent>

          <Divider light />

          <CardActions disableActionSpacing>
            <IconButton onClick={this.handleClickAppLink}>
              <PlayCircleFilled />
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

AppCard.propTypes = {
  classes:     PropTypes.object.isRequired,
  name:        PropTypes.string.isRequired,
  creator:     PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  toolName:    PropTypes.string.isRequired,
  toolVersion: PropTypes.string.isRequired,
  link:        PropTypes.string.isRequired,
};

export default withStyles(
  styles,
  { withTheme: true }
)(AppCard);
