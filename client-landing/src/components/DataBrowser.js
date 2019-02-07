import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';

const styles = theme => ({});

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
      onTableChange: (action, tableState) => {
        console.log(action);
        console.log(tableState);
      },
    },
    searchTimer: null,
  };

  render() {
    const {
      sorted,
      pageSize,
      currentPage,
      total,
      currentDirectory
    } = this.props;

    let options = {
      ...this.state.options,
      rowsPerPage: pageSize,
      page:        currentPage,
      count:       total,
    }

    const data = sorted.map((resource) => {
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
      <MUIDataTable
        title={currentDirectory}
        columns={columns}
        data={data}
        options={this.state.options}
      />
    );
  }
}

DataBrowser.propTypes = {
  classes:          PropTypes.object.isRequired,
  sorted:           PropTypes.array.isRequired,
  currentDirectory: PropTypes.string.isRequired,
  currentPage:      PropTypes.number.isRequired,
  numberOfPages:    PropTypes.number.isRequired,
  pageSize:         PropTypes.number.isRequired,
  total:            PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  currentPage:      state.dataResources.currentPage,
  currentDirectory: state.dataResources.currentDirectory,
  sorted:           state.dataResources.sorted,
  numberOfPages:    state.dataResources.numberOfPages,
  pageSize:         state.dataResources.pageSize,
  total:            state.dataResources.total,
});

const mapDispatchToProps = dispatch => ({});

const MappedDataBrowser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataBrowser);

export default withStyles(styles, {withTheme: true})(MappedDataBrowser);
