import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchDataResources,
  selectAllDataResources,
  clearSelected
} from '../actions';

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

    this.props.fetch(dir, offset, limit, sortField, sortDirection.toUpperCase(), zone);
  }

  doSelectAll() {
    const {
      currentDirectory,
      zone,
      selectAllResources,
      username
    } = this.props;

    let dir = currentDirectory;
    if (dir === "") {
      dir = `/iplant/home/${username}`;
    }

    selectAllResources(dir, zone);
  }

  componentDidUpdate(prevProps) {
    let doUpdate = false;

    let propsToCheck = [
      'currentDirectory',
      'currentPage',
      'limit',
      'sortField',
      'sortDirection',
      'username',
      'zone',
    ];

    propsToCheck.forEach(p => {
      if (this.props[p] !== prevProps[p]) {
        doUpdate = true;
      }
    });

    if (doUpdate) {
      this.getDataResources();
    }

    if (this.props.selectAll !== prevProps.selectAll) {
      if (this.props.selectAll) {
        this.doSelectAll();
      } else {
        this.props.unselectAllResources();
      }
    }
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
  selectAll:        PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  currentDirectory: state.dataResources.currentDirectory,
  currentPage:      state.dataResources.currentPage,
  limit:            state.dataResources.pageSize,
  sortField:        state.dataResources.sortField,
  sortDirection:    state.dataResources.sortDirection,
  username:         state.username,
  zone:             state.dataResources.zone,
  selectAll:        state.dataResources.selectAll,
});

const mapDispatchToProps = dispatch => ({
  fetch:       (dir, offset, limit, sortField, sortDir, zone) =>
    dispatch(fetchDataResources(dir, offset, limit, sortField, sortDir, zone)),
  selectAllResources:   (dir, zone) => dispatch(selectAllDataResources(dir, zone)),
  unselectAllResources: () => dispatch(clearSelected()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataPumper);
