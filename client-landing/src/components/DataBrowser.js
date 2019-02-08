import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { fetchDataResources } from '../actions';

import MUIDataTable from 'mui-datatables';

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
      onTableChange: (action, tableState) => {
        console.log(action);
        console.log(tableState);
      },
    },
    searchTimer: null,
  };

  componentDidMount() {
    const offset = this.props.pageSize * (this.props.currentPage - 1);
    const limit = this.props.pageSize;
    let dir = this.props.currentDirectory;
    const sortField = this.props.sortField;
    const sortDirection = this.props.sortDirection;
    const username = this.props.username;

    if (dir === "") {
      dir = `/iplant/home/${username}`;
    }
    this.props.fetch(dir, offset, limit, sortField, sortDirection);
  }

  render() {
    const {
      classes,
      resources,
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
        <MUIDataTable
          title={currentDirectory}
          columns={columns}
          data={data}
          options={this.state.options}
        />
      </div>
    );
  }
}

DataBrowser.propTypes = {
  classes:          PropTypes.object.isRequired,
  resources:        PropTypes.array.isRequired,
  currentDirectory: PropTypes.string.isRequired,
  currentPage:      PropTypes.number.isRequired,
  numberOfPages:    PropTypes.number.isRequired,
  pageSize:         PropTypes.number.isRequired,
  total:            PropTypes.number.isRequired,
  sortField:        PropTypes.string.isRequired,
  sortDirection:    PropTypes.string.isRequired,
  username:         PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  currentPage:      state.dataResources.currentPage,
  currentDirectory: state.dataResources.currentDirectory,
  resources:        state.dataResources.resources,
  numberOfPages:    state.dataResources.numberOfPages,
  pageSize:         state.dataResources.pageSize,
  total:            state.dataResources.total,
  sortField:        state.dataResources.sortField,
  sortDirection:    state.dataResources.sortDirection,
  username:         state.username,
});

const mapDispatchToProps = dispatch => ({
  fetch: (path, offset=0, limit=500, sortField="", sortDir="", zone="iplant") => {
    dispatch(fetchDataResources(path, offset, limit, sortField, sortDir, zone));
  },
});

const MappedDataBrowser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataBrowser);

export default withStyles(styles, {withTheme: true})(MappedDataBrowser);
