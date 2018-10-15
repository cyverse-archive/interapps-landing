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
      displayDescription = [...description].slice(0, 139).join('') + '...'
    } else {
      displayDescription = description
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
