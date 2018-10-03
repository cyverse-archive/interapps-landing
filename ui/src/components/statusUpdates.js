import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { addUpdate, setSubdomain, setJob } from '../actions';


class StatusUpdate extends Component {
  render() {
    return <li>{this.props.status} - {this.props.message}</li>;
  }
}

class StatusUpdates extends Component {
  render() {
    return <div className="status-updates"></div>;
    // return (
    //   <ul>
    //     {Object.entries(this.props.entities.updates) // Make the object into a [[1,{}], ...]
    //            .map(x => x[1])                       // grab the {} from the tuples
    //            .sort((a, b) => a.sentOn - b.sentOn)  // sort the tuples based on the sentOn field
    //            .map(update => <StatusUpdate key={update.id} status={update.status} message={update.message} />)}
    //   </ul>
    // );
  }
}

const mapStateToProps = state => {
  return Object.assign({}, state);
};

const mapDispatchToProps = dispatch => ({});

const StatusUpdatesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusUpdates);

export { StatusUpdate, StatusUpdates };
export default StatusUpdatesContainer;
