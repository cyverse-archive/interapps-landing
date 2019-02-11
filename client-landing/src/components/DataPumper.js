import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchDataResources } from '../actions';

class DataPumper extends Component {
  getDataResources() {
    const {
      currentDirectory,
      currentPage,
      limit,
      sortField,
      sortDirection,
      username,
      zone
    } = this.props;
    const offset = limit * currentPage;

    let dir = currentDirectory;
    if (dir === "") {
      dir = `/iplant/home/${username}`;
    }

    this.props.fetch(dir, offset, limit, sortField, sortDirection, zone);
  }

  render() {
    this.getDataResources();
    return (<div/>);
  }
}

DataPumper.propTypes = {
  currentDirectory: PropTypes.string.isRequired,
  currentPage:      PropTypes.number.isRequired,
  limit:            PropTypes.number.isRequired,
  sortField:        PropTypes.string.isRequired,
  sortDirection:    PropTypes.string.isRequired,
  username:         PropTypes.string.isRequired,
  zone:             PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  currentDirectory: state.dataResources.currentDirectory,
  currentPage:      state.dataResources.currentPage,
  limit:            state.dataResources.pageSize,
  sortField:        state.dataResources.sortField,
  sortDirection:    state.dataResources.sortDirection,
  username:         state.username,
  zone:             state.dataResources.zone,
});

const mapDispatchToProps = dispatch => ({
  fetch: (dir, offset, limit, sortField, sortDir, zone) => {
    dispatch(fetchDataResources(dir, offset, limit, sortField, sortDir, zone));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataPumper);
