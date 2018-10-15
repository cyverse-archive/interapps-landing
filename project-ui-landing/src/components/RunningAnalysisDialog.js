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
import Typography from '@material-ui/core/Typography';
import withMobileDialog from '@material-ui/core/withMobileDialog';

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
              className={{ paper: classes.dialogPaper }}
      >

        <DialogContent>
          <Typography id="running-analysis-name" className={classes.title} variant="h3" gutterBottom>
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
        </DialogContent>

        <DialogActions>
          <IconButton className={classes.appLink} onClick={handleClickLink} autoFocus>
            <OpenInBrowser />
          </IconButton>
        </DialogActions>
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

export default withMobileDialog()(RunningAnalysisDialog);
