import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  fetchDataResources,
  setPageSize,
  setCurrentPage,
  setSortField,
  setSortDirection
} from '../actions';

import MUIDataTable from 'mui-datatables';
import DataPumper from './DataPumper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';

const columns = [
  {
    id: "name",
    label: "Name",
    align: 'left',
    disablePadding: true,
  },
  {
    id: "path",
    label: "Path",
    align: 'left',
    disablePadding: true,
  },
  {
    id: "datemodified",
    label: "Last Modified",
    align: 'left',
    disablePadding: false,
  },
  {
    id: "datecreated",
    label: "Date Submitted",
    align: 'left',
    disablePadding: false,
  },
  {
    id: "size",
    label: "Size",
    align: 'left',
    disablePadding: false,
  }
];

class DataBrowserHead extends Component {
  render() {
    const {
      classes,
      sortField,
      sortDirection,
      resetSortDirection,
      resetSortField
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              checked={false}
            />
          </TableCell>
          {columns.map(
            column => (
              <TableCell
                key={column.id}
                align={column.align}
                padding={column.disablePadding ? 'none' : 'default'}
              >
                <TableSortLabel
                  active={sortField === column.id}
                  direction={sortDirection}
                  onClick={() => {
                    resetSortDirection(sortDirection);
                    resetSortField(column.id);
                  }}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            )
          )}
        </TableRow>
      </TableHead>
    );
  }
}

const dataBrowserToolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

class DataBrowserToolbar extends Component {
  render() {
    const { classes, currentDirectory } = this.props;

    return (
      <Toolbar className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h6" id="tableTitle">
            {currentDirectory}
          </Typography>
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    );
  }
};

DataBrowserToolbar.propTypes = {
  classes:          PropTypes.object.isRequired,
  currentDirectory: PropTypes.string.isRequired,
}

DataBrowserToolbar = withStyles(dataBrowserToolbarStyles)(DataBrowserToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class DataBrowser extends Component {
  render() {
    const {
      classes,
      resources,
      pageSize,
      currentPage,
      total,
      currentDirectory,
      setPageSize,
      setPage,
      resetSortField,
      resetSortDirection,
      sortField,
      sortDirection
    } = this.props;

    return (
      <div className={classes.datatable}>
        <Paper className={classes.root}>
          <DataBrowserToolbar currentDirectory={currentDirectory} />

          <Table className={classes.table} aria-labelledby="tableTitle">
            <DataBrowserHead
              sortField={sortField}
              resetSortField={resetSortField}
              sortDirection={sortDirection}
              resetSortDirection={resetSortDirection}
            />
            <TableBody>
              {resources.map(r => {
                return (
                  <TableRow
                    hover
                    key={r.id}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={false} />
                    </TableCell>

                    <TableCell
                      component="th"
                      scope="row"
                      padding={columns[0].disablePadding ? "none" : "default"}
                      align={columns[0].align}>
                      {r.name}
                    </TableCell>

                    <TableCell
                      align={columns[1].align}
                      padding={columns[1].disablePadding ? "none" : "default"}
                    >
                      {r.path}
                    </TableCell>

                    <TableCell
                      align={columns[2].align}
                      padding={columns[2].disablePadding ? "none" : "default"}
                    >
                      {r.dateModified}
                    </TableCell>

                    <TableCell
                      align={columns[3].align}
                      padding={columns[3].disablePadding ? "none" : "default"}
                    >
                      {r.dateCreated}
                    </TableCell>

                    <TableCell
                      align={columns[4].align}
                      padding={columns[4].disablePadding ? "none" : "default"}
                    >
                      {r.size}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
            component="div"
            count={total}
            rowsPerPage={pageSize}
            page={currentPage}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={ (obj, page) => setPage(page) }
            onChangeRowsPerPage={ event => setPageSize(event.target.value) }
          />
        </Paper>
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
  sortField:        state.dataResources.sortField,
  sortDirection:    state.dataResources.sortDirection,
});

const mapDispatchToProps = dispatch => ({
  setPageSize:  (pageSize) => dispatch(setPageSize(pageSize)),
  setPage:      (page) => dispatch(setCurrentPage(page)),

  resetSortField:
    (sortField) => dispatch(setSortField(sortField)),

  resetSortDirection:
    (sortDirection) => {
      let realDir = '';
      switch(sortDirection.toLowerCase()) {
        case 'asc':
          realDir = 'desc';
          break;
        case 'desc':
          realDir = 'asc';
          break;
        default:
          realDir = 'asc';
      }
      dispatch(setSortDirection(realDir));
    }
});

const dataBrowser = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataBrowser);

export default withStyles(styles, {withTheme: true})(dataBrowser);
