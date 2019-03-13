import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { shiftMessage } from '../actions';

const styles = theme => ({
  close: {
    padding: theme.spacing.unit / 2,
  },
  messageSnackbar: {
    paddingBottom: 60, // Get it above the footer
  },
});

class MessageSnackbars extends React.Component {
  state = {
    open: false,
  };

  handleClick = () => {
    if (this.state.open) {
      this.setState({open: false});
    } else {
      this.processQueue();
    }
  };

  processQueue = () => {
    if (this.props.messages.length > 0) {
      this.props.shiftMessage();
      this.setState({open: true});
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({open: false});
    this.processQueue();
  };

  handleExited = () => {
    this.processQueue();
  };

  componentDidMount() {
    if (this.props.messages.length > 0) {
      this.setState({open: true});
    }
  }

  componentDidUpdate(prevProps) {
    // Open if it's going from no messages to one or more messages.
    if (prevProps.messages.length === 0 && this.props.messages.length > 0) {
      this.setState({open: true});
    }
  }

  render() {
    const { classes, messages } = this.props;
    return (
      <Snackbar
        className={classes.messageSnackbar}
        key={Date.now()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open && messages.length > 0}
        autoHideDuration={6000}
        onClose={this.handleClose}
        onExited={this.handleExited}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{messages[0]}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

MessageSnackbars.propTypes = {
  classes:     PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  messages: state.messages,
});

const mapDispatchToProps = dispatch => ({
  shiftMessage: () => dispatch(shiftMessage())
});

const MappedMessageSnackbars = connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageSnackbars);

export default withStyles(
  styles,
  { withTheme: true }
)(MappedMessageSnackbars);
