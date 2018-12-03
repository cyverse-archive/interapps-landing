import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import Description from '@material-ui/icons/Description';
import Computer from '@material-ui/icons/Computer';
import Assessment from '@material-ui/icons/Assessment';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';

const styles = {
  root: {
    padding: "20px",
  },
  fieldIcon: {
    position: 'relative',
    top: '-2px',
  },
  appLink: {
    top: '-5px',
  },
  owner: {
    marginTop: '5px',
  },
};

class RunningAnalysisDialog extends Component {
  render() {
    const { fullScreen, classes } = this.props;
    const { analysisName, analysisLink, owner, description } = this.props;
    const { appName, handleClose, handleClickLink, open } = this.props;

    return (
      <Dialog fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              aria-labelledby="running-analysis-name"
      >
        <Grid container spacing={8} className={classes.root}>
          <Grid item xs={11} />
          <Grid item xs={1}>
            <IconButton color="inherit" onClick={handleClose} area-label="Close">
              <CloseIcon />
            </IconButton>
          </Grid>

          <Grid item xs={1}>
            <Assessment className={classes.fieldIcon} />
          </Grid>
          <Grid item xs={11}>
            <Typography id="running-analysis-name" gutterBottom>
              {analysisName}
            </Typography>
          </Grid>

          <Grid item xs={1}>
            <Computer className={classes.fieldIcon} />
          </Grid>
          <Grid item xs={11}>
            <Typography gutterBottom>
              {appName}

              <Typography color="textSecondary" className={classes.owner} gutterBottom>
                Added by {owner}
              </Typography>
            </Typography>
          </Grid>

          <Grid item xs={1}>
            <Description className={classes.fieldIcon} />
          </Grid>
          <Grid item xs={11}>
            <Typography>
              {description}
            </Typography>
          </Grid>

          <Grid item xs={11} />
          <Grid item xs={1}>
            <IconButton className={classes.appLink} onClick={handleClickLink} autoFocus>
              <OpenInBrowser />
            </IconButton>
          </Grid>
        </Grid>
      </Dialog>
    );
  };
}

RunningAnalysisDialog.propTypes = {
  classes:         PropTypes.object.isRequired,
  handleClose:     PropTypes.func.isRequired,
  handleClickLink: PropTypes.func.isRequired,
  open:            PropTypes.bool.isRequired,
  analysisName:    PropTypes.string.isRequired,
  appName:         PropTypes.string.isRequired,
  owner:           PropTypes.string.isRequired,
  description:     PropTypes.string,
  analysisLink:    PropTypes.string.isRequired,
};

export default withStyles(styles)(withMobileDialog()(RunningAnalysisDialog));
