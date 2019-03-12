import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clearErrors, setErrorDialogOpen, rmError } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import FileCopy from '@material-ui/icons/FileCopy';
import RemoveCircle from '@material-ui/icons/RemoveCircle';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  errorIcon: {
    position: 'relative',
    top: '4px',
    paddingRight: '10px',
  },
});

class ErrorDialog extends Component {
  render() {
    const { classes, open, errors, handleClose, handleClear, handleRemove } = this.props;

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="error-dialog-title"
          aria-describedby="error-dialog-description"
        >
          <DialogTitle id="error-dialog-title">
            <ErrorOutline className={classes.errorIcon} />
            Errors
          </DialogTitle>
          <DialogContent>
            {
              (errors.length > 0) ?
                errors.map((error, index) => {
                  const displayDate = new Date(error.dateCreated);
                  const displayDateString = `${displayDate.toLocaleDateString()} ${displayDate.toLocaleTimeString()}`;
                  const errorMessage = `${error.response.data.message || error.message || "Unknown message"}`;

                  return (
                    <ExpansionPanel id={`expansion-panel-${index}`}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{error.status} Error - {displayDateString}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Typography>{errorMessage}</Typography>
                      </ExpansionPanelDetails>

                      <ExpansionPanelActions>
                        <CopyToClipboard text={errorMessage}>
                          <Button size="small"><FileCopy /></Button>
                        </CopyToClipboard>
                        <Button size="small" onClick={() => handleRemove(index)}><RemoveCircle /></Button>
                      </ExpansionPanelActions>
                    </ExpansionPanel>
                  );
                })
                :
                <Typography>No errors have been received.</Typography>
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClear} color="primary">
              Clear
            </Button>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ErrorDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  errors:  PropTypes.array.isRequired,
  open:    PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  open:   state.errorDialogOpen,
});

const mapDispatchToProps = dispatch => ({
  handleClose:  () => dispatch(setErrorDialogOpen(false)),
  handleRemove: (index) => dispatch(rmError(index)),
  handleClear:  () => dispatch(clearErrors()),
});

const MappedErrorDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorDialog);

export default withStyles(styles, {withTheme: true})(MappedErrorDialog);
