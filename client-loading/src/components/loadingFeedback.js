import React, { Component } from 'react';
import { connect } from 'react-redux';

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
      window.location.href = this.props.appURL;
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
