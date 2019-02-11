import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  fetchDataResources,
  setPageSize,
  setCurrentPage
} from '../actions';

import MUIDataTable from 'mui-datatables';
import DataPumper from './DataPumper';

const styles = theme => ({
  datatable: {
    paddingBottom: '35px',
  }
});

const columns = [
  {
    name: "Name",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Path",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Last Modified",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Date Submitted",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Size",
    options: {
      filter: true,
      sort: true
    }
  }
];

class DataBrowser extends Component {
  state = {
    options: {
      serverSide: true,
      filter:     false, // filter requires knowing all values for each column up front.
      search:     true,
      print:      false,
      download:   false,
    },
    searchTimer: null,
  };

  render() {
    const {
      classes,
      resources,
      pageSize,
      currentPage,
      total,
      currentDirectory,
      setPageSize,
      setPage
    } = this.props;

    let options = {
      ...this.state.options,
      rowsPerPage:         pageSize,
      page:                currentPage,
      count:               total,
      onChangePage:        (newPageNumber) => {
        setPage(newPageNumber);
      },
      onChangeRowsPerPage: (newPageSize) => {
        setPageSize(newPageSize);
      },
    }

    const data = resources.map((resource) => {
      const modified = new Date(resource.dateModified);
      const created = new Date(resource.dateCreated);
      return [
        resource.name,
        resource.path,
        modified.toString(),
        created.toString(),
        resource.size,
      ]
    });

    return (
      <div className={classes.datatable}>
        <DataPumper />
        <MUIDataTable
          title={currentDirectory}
          columns={columns}
          data={data}
          options={options}
        />
      </div>
    );
  }
}

DataBrowser.propTypes = {
  classes:          PropTypes.object.isRequired,
  resources:        PropTypes.array.isRequired,
  total:            PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  resources:        state.dataResources.resources,
  total:            state.dataResources.total,
  pageSize:         state.dataResources.pageSize,
  currentPage:      state.dataResources.currentPage,
  currentDirectory: state.dataResources.currentDirectory,
});

const mapDispatchToProps = dispatch => ({
  setPageSize: (pageSize) => dispatch(setPageSize(pageSize)),
  setPage:     (page) => dispatch(setCurrentPage(page)),
});

const MappedDataBrowser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataBrowser);

export default withStyles(styles, {withTheme: true})(MappedDataBrowser);
