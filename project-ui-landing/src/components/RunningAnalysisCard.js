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

const paperWidth = '400px';
const paperHeight = '250px';

const styles = {
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
  appInfo: {
    float: 'left',
    marginTop: '7px',
    marginLeft: '0px',
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
    if ([...description].length > 140) {
      displayDescription = ellipsize(description, 140);
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
          <CardContent>
            <Typography className={classes.title} variant="h3" gutterBottom>
              <Assessment className={classes.fieldIcon} />

              {displayAnalysisName}
            </Typography>

            <Typography className={classes.title} variant="h3" gutterBottom>
              <Computer className={classes.fieldIcon} />

              {displayAppName}

              <Typography color="textSecondary" className={classes.owner} gutterBottom>
                Added by {displayOwner}
              </Typography>
            </Typography>

            <Typography>
              <Description className={classes.fieldIcon} />

              {displayDescription}
            </Typography>
          </CardContent>

          <CardActions className={classes.cardActions}>
            <Button
              className={classes.appInfo}
              onClick={this.handleClickMoreInfo}
              color="secondary"
            >
              More Info
            </Button>
            <IconButton className={classes.appLink} onClick={this.handleClickAppLink}>
              <OpenInBrowser />
            </IconButton>
          </CardActions>
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
