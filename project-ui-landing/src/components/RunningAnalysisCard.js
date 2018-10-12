import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Description from '@material-ui/icons/Description';
import Computer from '@material-ui/icons/Computer';
import Assessment from '@material-ui/icons/Assessment';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: '400px',
    minHeight: '150px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '400',
    marginBottom: '15px',
  },
  pos: {
    marginBottom: 12,
  },
  fieldIcon: {
    float: 'left',
    position: 'relative',
    marginRight: '10px',
    top: '-3px',
  },
  appLink: {
    float: 'right',
  },
  cardActions: {
    display: 'inline-block',
    width: '100%',
  },
  descriptionBlock: {
    display: 'inline-block',
    width: '100%',
  },
  owner: {
    marginLeft: '34px',
    marginTop: '5px',
  },
};

class RunningAnalysisCard extends Component {
  render() {
    const { classes } = this.props;
    const { analysisName, analysisLink, owner, description } = this.props;
    const { appName } = this.props;

    console.log(classes);

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} variant="h3" gutterBottom>
            <Assessment className={classes.fieldIcon} />

            {analysisName}
          </Typography>

          <Typography className={classes.title} variant="h3" gutterBottom>
            <Computer className={classes.fieldIcon} />

            {appName}

            <Typography color="textSecondary" className={classes.owner} gutterBottom>
              Added by {owner}
            </Typography>
          </Typography>

          <Typography>
            <Description className={classes.fieldIcon} />
            {description}
          </Typography>
        </CardContent>

        <CardActions className={classes.cardActions}>
          <IconButton className={classes.appLink}>
            <OpenInBrowser />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

RunningAnalysisCard.propTypes = {
  classes:      PropTypes.object.isRequired,
  analysisName: PropTypes.string.isRequired,
  appName:      PropTypes.string.isRequired,
  owner:        PropTypes.string.isRequired,
  description:  PropTypes.string,
  analysisLink: PropTypes.string.isRequired,
};

export default withStyles(styles)(RunningAnalysisCard);
