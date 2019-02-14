import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Breadcrumbs from '@material-ui/lab/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
});

function handleClick(event) {
  event.preventDefault();
  alert('You clicked a breadcrumb.'); // eslint-disable-line no-alert
}

class DataBrowserBreadcrumbs extends React.Component {
  splitIntoLinkables() {
    const { currentDirectory } = this.props;
    return currentDirectory.split('/').filter(l => l !== "");
  }

  render() {
    const { classes } = this.props;
    const linkables = this.splitIntoLinkables();

    return (
      <Paper className={classes.paper}>
        <Breadcrumbs
          maxItems={2}
          itemsAfterCollapse={2}
          itemsBeforeCollapse={0}
          arial-label="Data Browser Breadcrumbs"
        >
          {linkables.map(linkable => {
            return (
              <Link color="inherit" href="#" onClick={handleClick}>
                {linkable}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Paper>
    )
  }
}

DataBrowserBreadcrumbs.propTypes = {
  classes:           PropTypes.object.isRequired,
  currentDirectory : PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  currentDirectory: state.dataResources.currentDirectory,
});

const dataBrowserBreadcrumbs = connect(
  mapStateToProps
)(DataBrowserBreadcrumbs);

export default withStyles(styles)(dataBrowserBreadcrumbs);
