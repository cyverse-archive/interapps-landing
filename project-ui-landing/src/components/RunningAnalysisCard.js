import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Forward from '@material-ui/icons/Forward';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: '400px',
    minHeight: '150px',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  analysisHeader: {
      display: 'inline-block',
      width: '100%',
      color: 'primary',
  },
  analysisName: {
    textAlign: 'left',
    float: 'left',
  },
  appName: {
    textAlign: 'right',
    float: 'right',
  },
  appLink: {
    float: 'right',
  },
  cardActions: {
    display: 'inline-block',
    width: '100%',
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
            <div className={classes.analysisHeader}>
              <div className={classes.analysisName}>
                {analysisName}
              </div>
              <div className={classes.appName}>
                {appName}
              </div>
            </div>
          </Typography>
          <Typography className={classes.title}>

          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Added by {owner}
          </Typography>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <IconButton className={classes.appLink}>
            <Forward />
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
