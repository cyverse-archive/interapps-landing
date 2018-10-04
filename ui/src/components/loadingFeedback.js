import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';

class AppButton extends Component {
  render() {
    return (
      <div>
        <div className="analysisMessage">Your application is ready!</div>
        <Button variant="contained" href={this.props.appURL} className="button">Go!</Button>
      </div>
    );
  }
}

class LoadingDots extends Component {
  render() {
    return (
      <div>
        <div className="analysisMessage">Please wait while we launch your application.</div>

        <div className="loading-dots">
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
          <div className="loading-dots--dot"></div>
        </div>
      </div>
    );
  }
}

class LoadingFeedback extends Component {
  render() {
    let feedback;

    if (this.props.isReady) {
      feedback = <AppButton appURL={this.props.appURL}/>;
    } else {
      feedback = <LoadingDots />;
    }

    return (
      <div className="loading-feedback">
        {feedback}
      </div>
    );
  }
}

const getAppURL = () => {
  let searchParams = new URLSearchParams(window.location.search);
  return searchParams.get('url');
};

const mapStateToProps = state => ({
  isReady: state.ready,
  appURL: getAppURL()
});

const LoadingFeedbackArea = connect(
  mapStateToProps
)(LoadingFeedback);

export default LoadingFeedbackArea;
