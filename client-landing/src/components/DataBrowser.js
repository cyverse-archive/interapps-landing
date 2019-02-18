import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  fetchDataResources,
  setPageSize,
  setCurrentPage,
  setSortField,
  setSortDirection,
  setCurrentDirectory,
  setSelected,
  unsetSelected,
  clearSelected,
  selectAll
} from '../actions';

import filesize from 'filesize';
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
import DataBrowserBreadcrumbs from './DataBrowserBreadcrumbs';
import Link from '@material-ui/core/Link';

import Measure from 'react-measure';

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
      resetSortField,
      selectAll,
      selectAllCallback
    } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectAll}
              onChange={(event, checked) => selectAllCallback(checked)}
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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
    marginTop: 55,
    marginBottom: 100,
    boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  toolbar: {
    position: 'fixed',
    top: 0,
    height: 40,
    paddingTop: 75,
    zIndex: 500,
    backgroundColor: 'white',
    borderCollapse: 'collapse',
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',

  },
  footer: {
    position: 'fixed',
    zIndex: 500,
    backgroundColor: 'white',
    boxShadow: '0px -1px 5px 0px rgba(0,0,0,0.2)',
    height: 100,
  },
  breadcrumbs: {
    width: '75%',
    display: 'flex',
    float: 'left',
  },
  actions: {
    color: theme.palette.text.secondary,
    width: '25%',
    float: 'left',
  },
  filterButton: {
    float: 'right',
    marginRight: '20px',
  },
});

class DataBrowser extends Component {
  state = {
    dimensions: {
      width: -1,
      height: -1
    }
  };

  formatDate(millis) {
    let d = new Date(millis);
    return d.toLocaleString();
  }

  render() {
    const {
      classes,
      resources,
      pageSize,
      currentPage,
      total,
      currentDirectory,
      selected,
      setSelected,
      unsetSelected,
      selectAllRows,
      selectAll,
      setPageSize,
      setPage,
      resetSortField,
      resetSortDirection,
      sortField,
      sortDirection,
      setNavDir
    } = this.props;

    const {
      height,
      width
    } = this.state.dimensions;

    return (
      <Measure bounds onResize={rect => this.setState({dimensions: rect.bounds})}>
        {({ measureRef }) => (
        <div ref={measureRef} className={classes.datatable}>
          <Paper className={classes.root}>
            <div style={{'width': width}}className={classes.toolbar}>
              <div className={classes.breadcrumbs}>
                <DataBrowserBreadcrumbs
                  currentDirectory={currentDirectory}
                  crumbcallback={(pathElements, pathIndex) => {
                    setNavDir(`/${pathElements.slice(0, pathIndex+1).join('/')}`);
                  }}
                />
              </div>

              <div className={classes.actions}>
                <Tooltip title="Filter list">
                  <IconButton className={classes.filterButton} aria-label="Filter list">
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </div>

            <Table width={width} className={classes.table} aria-labelledby="tableTitle">
              <DataBrowserHead
                sortField={sortField}
                resetSortField={resetSortField}
                sortDirection={sortDirection}
                resetSortDirection={resetSortDirection}
                selectAllCallback={selectAllRows}
                selectAll={selectAll}
              />
              <TableBody>
                {resources.map(r => {
                  return (
                    <TableRow
                      hover
                      key={r.id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected[r.id] === 1}
                          onChange={(event, checked) => {
                            if (checked) {
                              setSelected(r.id);
                            } else {
                              unsetSelected(r.id);
                            }
                          }}
                          />
                      </TableCell>

                      <TableCell
                        component="th"
                        scope="row"
                        padding={columns[0].disablePadding ? "none" : "default"}
                        align={columns[0].align}>
                        {r.type === 'file' ?
                          r.name
                          :
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => {
                              this.props.setNavDir(r.path);
                            }}
                            >
                            {r.name}
                          </Link>}
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
                        {this.formatDate(r.dateModified)}
                      </TableCell>

                      <TableCell
                        align={columns[3].align}
                        padding={columns[3].disablePadding ? "none" : "default"}
                      >
                        {this.formatDate(r.dateCreated)}
                      </TableCell>

                      <TableCell
                        align={columns[4].align}
                        padding={columns[4].disablePadding ? "none" : "default"}
                      >
                        {filesize(r.size)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <div className={classes.footer} style={{'top': window.innerHeight-96, 'width': width}}>
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
            </div>
          </Paper>
        </div>
        )}
      </Measure>
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
  selected:         state.dataResources.selected,
  selectAll:        state.dataResources.selectAll
});

const mapDispatchToProps = dispatch => ({
  setNavDir:     (currentDirectory) => dispatch(setCurrentDirectory(currentDirectory)),
  setPageSize:   (pageSize) => dispatch(setPageSize(pageSize)),
  setPage:       (page) => dispatch(setCurrentPage(page)),
  setSelected:   (id) => dispatch(setSelected(id)),
  unsetSelected: (id) => dispatch(unsetSelected(id)),
  selectAllRows: (val) => dispatch(selectAll(val)),

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
