import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { clearErrorsByStatus, setErrorDialogOpen } from '../actions';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({});

class ErrorDialog extends Component {
  render() {
    const { classes, open, error, handleClose, handleClear } = this.props;

    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="error-dialog-title"
          aria-describedby="error-dialog-description"
        >
          <DialogTitle id="error-dialog-title">{"Errors"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="error-dialog-description">
              Placeholder Text
            </DialogContentText>
          </DialogContent>
          <DialogActions>
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
  errors: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  open: state.errorDialogOpen,
});

const mapDispatchToProps = dispatch => ({
  handleClose: () => dispatch(setErrorDialogOpen(false)),
  handleClear: (statusCode) => dispatch(clearErrorsByStatus(statusCode)),
});

const MappedErrorDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorDialog);

export default withStyles(styles, {withTheme: true})(MappedErrorDialog);
