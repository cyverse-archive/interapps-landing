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
  }
  render() {
    const { sorted } = this.props;

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
        title={"Files and Folders"}
        columns={columns}
        data={data}
        options={this.state.options}
      />
    );
  }
}

DataBrowser.propTypes = {
  classes:        PropTypes.object.isRequired,
  collection:     PropTypes.object.isRequired,
  sorted:         PropTypes.array.isRequired,
  currentPage:    PropTypes.number.isRequired,
  numberOfPages:  PropTypes.number.isRequired,
  pageSize:       PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  collection:    state.dataResources.collection,
  sorted:        state.dataResources.sorted,
  currentPage:   state.dataResources.currentPage,
  numberOfPages: state.dataResources.numberOfPages,
  pageSize:      state.dataResources.pageSize,
});

const mapDispatchToProps = dispatch => ({});

const MappedDataBrowser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataBrowser);

export default withStyles(styles, {withTheme: true})(MappedDataBrowser);
