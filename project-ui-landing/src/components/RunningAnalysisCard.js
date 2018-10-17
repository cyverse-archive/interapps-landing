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
import RunningAnalysisDialog from './RunningAnalysisDialog';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const paperWidth = '400px';
const paperHeight = '300px';

const styles = {
  descriptionText: {
    height: '7em',
  },
  card: {
    width: paperWidth,
    height: paperHeight,
  },
  dialogPaper: {
    minWidth: paperWidth,
    minHeight: paperHeight,
  },
  title: {
    fontSize: '20px',
    fontWeight: '400',
  },
  fieldIcon: {
    position: 'relative',
    top: '-3px',
  },
  appLink: {
    top: '-5px',
  },
  owner: {
    marginTop: '5px',
  },
};

const ellipsize = (s, limit) => [...s].slice(0, limit-4).join('') + '...';

class RunningAnalysisCard extends Component {
  state = {
    dialogOpen: false
  };

  handleClickMoreInfo = () => {
    this.setState({dialogOpen: true});
  };

  handleCloseDialog = () => {
    this.setState({dialogOpen: false});
  };

  handleClickAppLink = () => {
    alert("link clicked");
  };

  render() {
    const { classes } = this.props;
    const { analysisName, analysisLink, owner, description } = this.props;
    const { appName } = this.props;

    let displayDescription = "";
    if ([...description].length > 280) {
      displayDescription = ellipsize(description, 280);
    } else {
      displayDescription = description;
    }

    let displayAnalysisName = "";
    if ([...analysisName].length > 32) {
      displayAnalysisName = ellipsize(analysisName, 32);
    } else {
      displayAnalysisName = analysisName;
    }

    let displayAppName = "";
    if ([...appName].length > 30) {
      displayAppName = ellipsize(appName, 30);
    } else {
      displayAppName = appName;
    }

    let displayOwner = "";
    if ([...owner].length > 34) {
      displayOwner = ellipsize(owner, 34);
    } else {
      displayOwner = owner;
    }

    return (
      <div>
        <RunningAnalysisDialog
          handleClose={this.handleCloseDialog}
          handleClickLink={this.handleClickAppLink}
          open={this.state.dialogOpen}
          analysisName={analysisName}
          appName={appName}
          owner={owner}
          description={description}
          analysisLink={analysisLink}
          classes={classes}
        />

        <Card className={classes.card}>
          <Grid container className={classes.root} spacing={8}>
            <Grid item xs={12}>
              <CardContent>
                <Grid container className={classes.cardContentGrid} spacing={8}>
                  <Grid item xs={1}>
                    <Assessment className={classes.fieldIcon} />
                  </Grid>

                  <Grid item xs={11}>
                    <Typography className={classes.title} variant="h3" gutterBottom>
                      {displayAnalysisName}
                    </Typography>
                  </Grid>

                  <Grid item xs={1}>
                    <Computer className={classes.fieldIcon} />
                  </Grid>

                  <Grid item xs={11}>
                    <Typography className={classes.title} variant="h3" gutterBottom>
                      {displayAppName}

                      <Typography color="textSecondary" className={classes.owner} gutterBottom>
                        Added by {displayOwner}
                      </Typography>
                    </Typography>
                  </Grid>

                  <Grid item xs={1}>
                    <Description className={classes.descriptionIcon} />
                  </Grid>

                  <Grid item xs={11}>
                    <Typography className={classes.descriptionText}>
                      {displayDescription}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Grid>

            <Grid item xs={12}>
              <CardActions>
                <Grid container className={classes.cardActionsGrid} spacing={8}>
                  <Grid item xs={4}>
                    <Button
                      onClick={this.handleClickMoreInfo}
                      color="secondary"
                    >
                      More Info
                    </Button>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={1}>
                    <IconButton className={classes.appLink} onClick={this.handleClickAppLink}>
                      <OpenInBrowser />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardActions>
            </Grid>
          </Grid>
        </Card>
      </div>
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
